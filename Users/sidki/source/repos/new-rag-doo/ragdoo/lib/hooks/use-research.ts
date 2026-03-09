// lib/hooks/use-research.ts - Research Hook

'use client';

import { useState, useCallback } from 'react';

interface ResearchParams {
  query: string;
  sources: string[];
  filters?: Record<string, any>;
}

export function useResearch() {
  const [results, setResults] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const search = useCallback(async (params: ResearchParams) => {
    try {
      setIsLoading(true);
      setError(null);

      const response = await fetch('/api/research', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(params)
      });

      const data = await response.json();

      if (!data.success) {
        throw new Error(data.error || 'Research failed');
      }

      setResults(data.data || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Research failed');
      setResults([]);
    } finally {
      setIsLoading(false);
    }
  }, []);

  return { search, results, isLoading, error };
}
