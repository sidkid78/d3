// components/forms/research-form.tsx - Research Interface Component

'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
import { Badge } from '@/components/ui/badge';
import { useResearch } from '@/lib/hooks/use-research';

export function ResearchForm() {
  const { search, results, isLoading, error } = useResearch();
  const [query, setQuery] = useState('');
  const [sources, setSources] = useState({
    arxiv: true,
    pubmed: true,
    wikipedia: false,
    web: false
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const selectedSources = Object.entries(sources)
      .filter(([_, selected]) => selected)
      .map(([source, _]) => source);

    if (selectedSources.length === 0) {
      alert('Please select at least one source');
      return;
    }

    await search({
      query,
      sources: selectedSources,
      filters: { maxResults: 10 }
    });
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <Card>
        <CardHeader>
          <CardTitle>Research Assistant</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-medium mb-2">
                Research Query
              </label>
              <Input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Enter your research question..."
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">
                Search Sources
              </label>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {Object.entries(sources).map(([source, selected]) => (
                  <div key={source} className="flex items-center space-x-2">
                    <Checkbox
                      id={source}
                      checked={selected}
                      onCheckedChange={(checked) =>
                        setSources(prev => ({ ...prev, [source]: !!checked }))
                      }
                    />
                    <label htmlFor={source} className="capitalize cursor-pointer">
                      {source === 'arxiv' ? 'ArXiv' : 
                       source === 'pubmed' ? 'PubMed' : 
                       source}
                    </label>
                  </div>
                ))}
              </div>
            </div>

            <Button type="submit" disabled={isLoading || !query.trim()} className="w-full">
              {isLoading ? 'Researching...' : 'Start Research'}
            </Button>
          </form>

          {error && (
            <div className="mt-6 p-4 border border-red-200 rounded-lg bg-red-50">
              <p className="text-red-800">{error}</p>
            </div>
          )}

          {results.length > 0 && (
            <div className="mt-6">
              <h3 className="text-lg font-semibold mb-4">Research Results ({results.length})</h3>
              <div className="space-y-4">
                {results.map((result, index) => (
                  <div key={index} className="border rounded-lg p-4">
                    <h4 className="font-medium text-blue-600">
                      {result.url ? (
                        <a 
                          href={result.url} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="hover:underline"
                        >
                          {result.title}
                        </a>
                      ) : (
                        result.title
                      )}
                    </h4>
                    <p className="text-sm text-gray-600 mt-1">{result.description}</p>
                    <div className="flex items-center gap-2 mt-2">
                      <Badge variant="secondary">{result.source}</Badge>
                      {result.type && <Badge variant="outline">{result.type}</Badge>}
                      {result.authors && (
                        <span className="text-xs text-gray-500">
                          Authors: {result.authors}
                        </span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
