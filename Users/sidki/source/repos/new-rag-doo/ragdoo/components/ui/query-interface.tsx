'use client';

import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Send, 
  Mic, 
  MicOff, 
  Sparkles, 
  Brain, 
  Search,
  History,
  Settings,
  Zap,
  MessageSquare,
  Clock
} from 'lucide-react';

interface QuerySuggestion {
  id: string;
  text: string;
  category: 'research' | 'analysis' | 'summary' | 'comparison';
}

interface RecentQuery {
  id: string;
  text: string;
  timestamp: Date;
}

export function QueryInterface() {
  const [query, setQuery] = useState('');
  const [isListening, setIsListening] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [recentQueries, setRecentQueries] = useState<RecentQuery[]>([
    { id: '1', text: 'Summarize the key findings in the uploaded research papers', timestamp: new Date(Date.now() - 3600000) },
    { id: '2', text: 'What are the main differences between the two product specifications?', timestamp: new Date(Date.now() - 7200000) },
    { id: '3', text: 'Extract all financial data from the quarterly reports', timestamp: new Date(Date.now() - 86400000) },
  ]);

  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const suggestions: QuerySuggestion[] = [
    { id: '1', text: 'Summarize the main points from all uploaded documents', category: 'summary' },
    { id: '2', text: 'Find contradictions between different sources', category: 'analysis' },
    { id: '3', text: 'What are the key research findings?', category: 'research' },
    { id: '4', text: 'Compare the methodologies used in different papers', category: 'comparison' },
    { id: '5', text: 'Extract all statistical data and create a summary', category: 'analysis' },
    { id: '6', text: 'What questions remain unanswered?', category: 'research' },
  ];

  const getCategoryIcon = (category: QuerySuggestion['category']) => {
    switch (category) {
      case 'research': return Search;
      case 'analysis': return Brain;
      case 'summary': return MessageSquare;
      case 'comparison': return Zap;
      default: return Sparkles;
    }
  };

  const getCategoryColor = (category: QuerySuggestion['category']) => {
    switch (category) {
      case 'research': return 'from-blue-500/20 to-cyan-500/20 text-blue-400';
      case 'analysis': return 'from-purple-500/20 to-pink-500/20 text-purple-400';
      case 'summary': return 'from-green-500/20 to-emerald-500/20 text-green-400';
      case 'comparison': return 'from-orange-500/20 to-yellow-500/20 text-orange-400';
      default: return 'from-gray-500/20 to-slate-500/20 text-gray-400';
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim() || isProcessing) return;

    setIsProcessing(true);
    
    // Add to recent queries
    const newQuery: RecentQuery = {
      id: Math.random().toString(36).substring(7),
      text: query,
      timestamp: new Date()
    };
    setRecentQueries(prev => [newQuery, ...prev.slice(0, 9)]);

    // Simulate processing
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    setQuery('');
    setIsProcessing(false);
    setShowSuggestions(false);
  };

  const handleSuggestionClick = (suggestion: QuerySuggestion) => {
    setQuery(suggestion.text);
    setShowSuggestions(false);
    textareaRef.current?.focus();
  };

  const handleRecentQueryClick = (recentQuery: RecentQuery) => {
    setQuery(recentQuery.text);
    textareaRef.current?.focus();
  };

  const toggleVoiceInput = () => {
    setIsListening(!isListening);
    // Voice input functionality would be implemented here
  };

  const formatTimeAgo = (timestamp: Date) => {
    const now = new Date();
    const diff = now.getTime() - timestamp.getTime();
    const hours = Math.floor(diff / 3600000);
    const minutes = Math.floor((diff % 3600000) / 60000);
    
    if (hours > 0) return `${hours}h ago`;
    if (minutes > 0) return `${minutes}m ago`;
    return 'Just now';
  };

  // Auto-resize textarea
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
    }
  }, [query]);

  return (
    <div className="space-y-6">
      {/* Main Query Input */}
      <form onSubmit={handleSubmit} className="relative">
        <motion.div
          className="glass rounded-2xl p-6 hover:bg-white/10 transition-all focus-within:ring-2 focus-within:ring-purple-500/50"
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          <div className="flex items-start space-x-4">
            {/* AI Avatar */}
            <div className="flex-shrink-0 w-10 h-10 bg-gradient-to-r from-purple-500/20 to-blue-500/20 rounded-xl flex items-center justify-center">
              <Brain className="w-5 h-5 text-purple-400" />
            </div>

            {/* Input Area */}
            <div className="flex-1 space-y-4">
              <textarea
                ref={textareaRef}
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onFocus={() => setShowSuggestions(true)}
                placeholder="Ask me anything about your documents... I can summarize, analyze, compare, or answer specific questions."
                className="w-full bg-transparent text-white placeholder-gray-400 resize-none border-none outline-none text-lg leading-relaxed min-h-[60px] max-h-[200px]"
                rows={1}
              />

              {/* Input Actions */}
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <motion.button
                    type="button"
                    onClick={toggleVoiceInput}
                    className={`p-2 rounded-lg transition-all ${
                      isListening 
                        ? 'bg-red-500/20 text-red-400' 
                        : 'hover:bg-white/10 text-gray-400 hover:text-white'
                    }`}
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                  >
                    {isListening ? <MicOff className="w-5 h-5" /> : <Mic className="w-5 h-5" />}
                  </motion.button>

                  <motion.button
                    type="button"
                    className="p-2 rounded-lg hover:bg-white/10 text-gray-400 hover:text-white transition-all"
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                  >
                    <Settings className="w-5 h-5" />
                  </motion.button>
                </div>

                <motion.button
                  type="submit"
                  disabled={!query.trim() || isProcessing}
                  className="px-6 py-2 bg-gradient-to-r from-purple-600 to-blue-600 rounded-lg font-medium disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  {isProcessing ? (
                    <>
                      <motion.div
                        animate={{ rotate: 360 }}
                        transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                      >
                        <Sparkles className="w-4 h-4" />
                      </motion.div>
                      <span>Processing...</span>
                    </>
                  ) : (
                    <>
                      <Send className="w-4 h-4" />
                      <span>Ask AI</span>
                    </>
                  )}
                </motion.button>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Voice Input Indicator */}
        <AnimatePresence>
          {isListening && (
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              className="absolute -top-16 left-1/2 transform -translate-x-1/2 px-4 py-2 bg-red-500/20 text-red-400 rounded-full text-sm font-medium"
            >
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-red-400 rounded-full animate-pulse" />
                <span>Listening...</span>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </form>

      {/* Query Suggestions */}
      <AnimatePresence>
        {showSuggestions && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            className="space-y-4"
          >
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold text-white flex items-center">
                <Sparkles className="w-5 h-5 mr-2 text-purple-400" />
                Smart Suggestions
              </h3>
              <button
                onClick={() => setShowSuggestions(false)}
                className="text-gray-400 hover:text-white text-sm"
              >
                Hide
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {suggestions.map((suggestion) => {
                const Icon = getCategoryIcon(suggestion.category);
                return (
                  <motion.button
                    key={suggestion.id}
                    onClick={() => handleSuggestionClick(suggestion)}
                    className="text-left p-4 glass rounded-xl hover:bg-white/10 transition-all group"
                    whileHover={{ scale: 1.02, x: 5 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <div className="flex items-start space-x-3">
                      <div className={`w-8 h-8 rounded-lg bg-gradient-to-r ${getCategoryColor(suggestion.category)} flex items-center justify-center flex-shrink-0`}>
                        <Icon className="w-4 h-4" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-white font-medium group-hover:text-purple-400 transition-colors">
                          {suggestion.text}
                        </p>
                        <p className="text-gray-400 text-sm capitalize mt-1">
                          {suggestion.category}
                        </p>
                      </div>
                    </div>
                  </motion.button>
                );
              })}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Recent Queries */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="space-y-4"
      >
        <h3 className="text-lg font-semibold text-white flex items-center">
          <History className="w-5 h-5 mr-2 text-purple-400" />
          Recent Queries
        </h3>

        <div className="space-y-2">
          {recentQueries.slice(0, 3).map((recentQuery) => (
            <motion.button
              key={recentQuery.id}
              onClick={() => handleRecentQueryClick(recentQuery)}
              className="w-full text-left p-3 glass rounded-lg hover:bg-white/10 transition-all group"
              whileHover={{ scale: 1.01, x: 5 }}
            >
              <div className="flex items-center justify-between">
                <p className="text-gray-300 group-hover:text-white transition-colors truncate flex-1">
                  {recentQuery.text}
                </p>
                <div className="flex items-center text-gray-500 text-sm ml-4 flex-shrink-0">
                  <Clock className="w-3 h-3 mr-1" />
                  {formatTimeAgo(recentQuery.timestamp)}
                </div>
              </div>
            </motion.button>
          ))}
        </div>
      </motion.div>
    </div>
  );
}
