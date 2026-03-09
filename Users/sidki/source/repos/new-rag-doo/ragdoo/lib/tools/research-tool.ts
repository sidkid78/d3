// lib/tools/research-tool.ts - Research Tool Implementation

import axios from 'axios';
import { GoogleGenAI } from '@google/genai';
import { BaseTool } from './base-tool';
import { ToolResult, ResearchQuery } from '@/lib/types/agent-types';

interface ResearchResult {
  title: string;
  description: string;
  url: string;
  source: string;
  type: string;
  authors?: string;
  publishedDate?: string;
}
import { EnvironmentConfig } from '@/lib/config/environment';

export class ResearchTool extends BaseTool {
  private arxivCache = new Map<string, ResearchResult[]>();
  private pubmedCache = new Map<string, ResearchResult[]>();

  private gemini: GoogleGenAI;

  constructor(private config: EnvironmentConfig) {
    super();
    this.gemini = new GoogleGenAI({ apiKey: config.geminiApiKey });
  }

  async execute(params: ResearchQuery, _context?: unknown): Promise<ToolResult> {
    try {
      const results = await Promise.allSettled(
        params.sources.map(source => this.searchSource(source, params))
      );

      const aggregatedResults = this.aggregateResults(results);
      
      return this.createResult(true, aggregatedResults, undefined, {
        totalResults: aggregatedResults.length,
        sources: params.sources
      });
    } catch (error) {
      return this.createResult(false, undefined, error instanceof Error ? error.message : 'Research failed');
    }
  }

  private async searchSource(source: string, params: ResearchQuery): Promise<ResearchResult[]> {
    switch (source) {
      case 'arxiv':
        return this.searchArxiv(params);
      case 'pubmed':
        return this.searchPubmed(params);
      case 'wikipedia':
        return this.searchWikipedia(params);
      case 'web':
        return this.searchWeb(params);
      default:
        throw new Error(`Unknown source: ${source}`);
    }
  }

  private async searchArxiv(params: ResearchQuery): Promise<ResearchResult[]> {
    const cacheKey = `arxiv:${params.query}`;
    if (this.arxivCache.has(cacheKey)) {
      return this.arxivCache.get(cacheKey) || [];
    }

    const url = 'http://export.arxiv.org/api/query';
    const searchQuery = params.query.replace(/\s+/g, '+');
    const maxResults = params.filters?.maxResults || 10;

    try {
      const response = await axios.get(url, {
        params: {
          search_query: `all:${searchQuery}`,
          start: 0,
          max_results: maxResults,
          sortBy: 'relevance',
          sortOrder: 'descending'
        },
        timeout: 10000
      });

      const results = this.parseArxivXML(response.data);
      this.arxivCache.set(cacheKey, results);
      return results;
    } catch (error) {
      console.warn('ArXiv search failed:', error);
      return [];
    }
  }

  private async searchPubmed(params: ResearchQuery): Promise<ResearchResult[]> {
    const cacheKey = `pubmed:${params.query}`;
    if (this.pubmedCache.has(cacheKey)) {
      return this.pubmedCache.get(cacheKey) || [];
    }

    const baseUrl = 'https://eutils.ncbi.nlm.nih.gov/entrez/eutils/';
    const maxResults = params.filters?.maxResults || 10;

    try {
      // Search for paper IDs
      const searchResponse = await axios.get(`${baseUrl}esearch.fcgi`, {
        params: {
          db: 'pubmed',
          term: params.query,
          retmax: maxResults,
          retmode: 'json'
        }
      });

      const ids = searchResponse.data.esearchresult?.idlist || [];
      if (ids.length === 0) return [];

      // Fetch paper details
      const detailsResponse = await axios.get(`${baseUrl}esummary.fcgi`, {
        params: {
          db: 'pubmed',
          id: ids.join(','),
          retmode: 'json'
        }
      });

      const results = this.parsePubmedResults(detailsResponse.data);
      this.pubmedCache.set(cacheKey, results);
      return results;
    } catch (error) {
      console.warn('PubMed search failed:', error);
      return [];
    }
  }

  private async searchWikipedia(params: ResearchQuery): Promise<ResearchResult[]> {
    try {
      const searchUrl = 'https://en.wikipedia.org/w/api.php';
      const response = await axios.get(searchUrl, {
        params: {
          action: 'query',
          list: 'search',
          srsearch: params.query,
          format: 'json',
          origin: '*',
          srlimit: params.filters?.maxResults || 5
        },
        timeout: 10000
      });

      return response.data.query?.search?.map((page: Record<string, unknown>) => ({
        title: page.title as string,
        description: (page.snippet as string)?.replace(/<[^>]*>/g, '') || (page.extract as string) || '',
        url: `https://en.wikipedia.org/wiki/${encodeURIComponent(page.title as string)}`,
        source: 'Wikipedia',
        type: 'encyclopedia'
      })) || [];
    } catch (error) {
      console.warn('Wikipedia search failed:', error);
      return [];
    }
  }

  private async searchWeb(params: ResearchQuery): Promise<ResearchResult[]> {
    try {
      if (!this.config.geminiApiKey) {
        console.warn('Gemini API Key not configured - skipping web search');
        return [];
      }

      const response = await this.gemini.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: `Research the following query and provide grounding results: ${params.query}`,
        config: {
          tools: [{ googleSearch: {} }]
        }
      });

      const groundingMetadata = response.candidates?.[0]?.groundingMetadata;
      if (!groundingMetadata || !groundingMetadata.groundingChunks) {
        return [];
      }

      return groundingMetadata.groundingChunks.map(chunk => {
        const web = chunk.web;
        return {
          title: web?.title || 'Web Result',
          description: '', // Gemini grounding chunks don't always provide snippets in the same way
          url: web?.uri || '',
          source: 'Google Search (Gemini)',
          type: 'web_result'
        };
      }).filter(res => res.url !== '');
      
    } catch (error) {
      console.warn('Gemini Google Search failed:', error);
      return [];
    }
  }

  private parseArxivXML(xmlData: string): ResearchResult[] {
    // Simple XML parsing - in production, use a proper XML parser
    const results: ResearchResult[] = [];
    
    // This is a simplified parser - you'd want to use xml2js or similar
    const entries = xmlData.split('<entry>').slice(1);
    
    entries.forEach(entry => {
      const titleMatch = entry.match(/<title>(.*?)<\/title>/gi);
      const summaryMatch = entry.match(/<summary>(.*?)<\/summary>/gi);
      const linkMatch = entry.match(/href="([^"]*arxiv[^"]*)"/);
      const authorMatch = entry.match(/<author><name>(.*?)<\/name>/);
      
      if (titleMatch && summaryMatch) {
        results.push({
          title: titleMatch[1].trim(),
          description: summaryMatch[1].trim().substring(0, 200) + '...',
          url: linkMatch ? linkMatch[1] : '',
          authors: authorMatch ? authorMatch[1] : 'Unknown',
          source: 'ArXiv',
          type: 'academic_paper'
        });
      }
    });
    
    return results;
  }

  private parsePubmedResults(data: Record<string, unknown>): ResearchResult[] {
    const results: ResearchResult[] = [];
    
    if (data.result) {
      Object.values(data.result as Record<string, unknown>).forEach((paper: unknown) => {
        const p = paper as Record<string, unknown>;
        if (p.title && p.uid) {
          results.push({
            title: p.title as string,
            description: (p.source as string) || 'PubMed article',
            url: `https://pubmed.ncbi.nlm.nih.gov/${p.uid}/`,
            authors: (p.authors as Array<{ name: string }> | undefined)?.map(a => a.name).join(', ') || 'Unknown',
            source: 'PubMed',
            type: 'academic_paper',
            publishedDate: p.pubdate as string | undefined
          });
        }
      });
    }
    
    return results;
  }

  private aggregateResults(results: PromiseSettledResult<ResearchResult[]>[]): ResearchResult[] {
    const aggregated: ResearchResult[] = [];
    
    results.forEach(result => {
      if (result.status === 'fulfilled' && Array.isArray(result.value)) {
        aggregated.push(...result.value);
      }
    });
    
    // Sort by relevance/source priority
    return aggregated.sort((a, b) => {
      const sourcePriority = { 'ArXiv': 3, 'PubMed': 2, 'Wikipedia': 1 };
      return (sourcePriority[b.source as keyof typeof sourcePriority] || 0) - 
             (sourcePriority[a.source as keyof typeof sourcePriority] || 0);
    });
  }
}
