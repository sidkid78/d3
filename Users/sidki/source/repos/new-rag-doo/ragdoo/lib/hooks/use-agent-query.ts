// lib/hooks/use-agent-query.ts - React Hook for Agent Queries

'use client';

import { useState, useCallback } from 'react';
import { AgentQueryResult, AgentQueryParams } from '@/lib/types/agent-types';

interface UseAgentQueryReturn {
  query: (params: AgentQueryParams) => Promise<void>;
  results: AgentQueryResult | null;
  isLoading: boolean;
  error: string | null;
  clearResults: () => void;
}

export function useAgentQuery(): UseAgentQueryReturn {
  const [results, setResults] = useState<AgentQueryResult | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const query = useCallback(async (params: AgentQueryParams) => {
    try {
      setIsLoading(true);
      setError(null);

      const response = await fetch('/api/query', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(params),
      });

      const data = await response.json();

      if (!data.success) {
        throw new Error(data.error || 'Query failed');
      }

      setResults(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
      setResults(null);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const clearResults = useCallback(() => {
    setResults(null);
    setError(null);
  }, []);

  return { query, results, isLoading, error, clearResults };
}
