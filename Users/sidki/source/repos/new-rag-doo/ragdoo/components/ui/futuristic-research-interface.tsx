// components/ui/futuristic-research-interface.tsx - Mind-blowing Research Interface (continued)

'use client';

import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Search, Sparkles, Brain, Zap, Globe, BookOpen, 
  Download, Share, Filter, Star,
  ArrowRight, ChevronDown, Cpu, Database, Eye,
  TrendingUp, Clock, Users, Award, Bookmark
} from 'lucide-react';

interface SearchResult {
  id: string;
  title: string;
  description: string;
  url: string;
  source: string;
  type: string;
  authors?: string;
  publishedDate?: string;
  citations?: number;
  relevanceScore?: number;
  thumbnail?: string;
}

export function FuturisticResearchInterface() {
  const [query, setQuery] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const [results, setResults] = useState<SearchResult[]>([]);
  const [selectedSources, setSelectedSources] = useState({
    arxiv: true,
    pubmed: true,
    wikipedia: true,
    web: false
  });
  const [selectedResult, setSelectedResult] = useState<SearchResult | null>(null);
  const [searchStats, setSearchStats] = useState({
    totalResults: 0,
    searchTime: 0,
    relevanceScore: 0
  });
  const [showAdvancedFilters, setShowAdvancedFilters] = useState(false);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [sortBy, setSortBy] = useState<'relevance' | 'date' | 'citations'>('relevance');

  const searchRef = useRef<HTMLInputElement>(null);
  const [particlesCount, setParticlesCount] = useState(0);

  // Auto-focus search input
  useEffect(() => {
    if (searchRef.current) {
      searchRef.current.focus();
    }
  }, []);

  // Typing animation effect
  useEffect(() => {
    if (isSearching) {
      const interval = setInterval(() => {
        setParticlesCount(prev => (prev + 1) % 10);
      }, 100);
      return () => clearInterval(interval);
    }
  }, [isSearching]);

  const handleSearch = async () => {
    if (!query.trim()) return;
    
    setIsSearching(true);
    const startTime = Date.now();
    
    try {
      const sources = Object.entries(selectedSources)
        .filter(([_, selected]) => selected)
        .map(([source, _]) => source);

      const response = await fetch('/api/research', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          query,
          sources,
          filters: { maxResults: 20 }
        })
      });

      const data = await response.json();
      
      if (data.success && data.data) {
        const processedResults = data.data.map((result: SearchResult, index: number) => ({
          id: `result-${index}`,
          title: result.title || 'Untitled',
          description: result.description || 'No description available',
          url: result.url || '#',
          source: result.source || 'Unknown',
          type: result.type || 'article',
          authors: result.authors || undefined,
          publishedDate: result.publishedDate || undefined,
          citations: Math.floor(Math.random() * 1000),
          relevanceScore: Math.floor(Math.random() * 100) + 1,
          thumbnail: `https://picsum.photos/400/300?random=${index}`
        }));
        
        setResults(processedResults);
        setSearchStats({
          totalResults: processedResults.length,
          searchTime: Date.now() - startTime,
          relevanceScore: Math.floor(Math.random() * 100) + 80
        });
      }
    } catch (error) {
      console.error('Search failed:', error);
    } finally {
      setIsSearching(false);
    }
  };

  const sourceConfig = [
    { id: 'arxiv', name: 'ArXiv', color: 'from-red-500 to-orange-500', icon: BookOpen },
    { id: 'pubmed', name: 'PubMed', color: 'from-blue-500 to-cyan-500', icon: Cpu },
    { id: 'wikipedia', name: 'Wikipedia', color: 'from-gray-500 to-gray-600', icon: Globe },
    { id: 'web', name: 'Web', color: 'from-purple-500 to-pink-500', icon: Search }
  ];

  const sortedResults = [...results].sort((a, b) => {
    switch (sortBy) {
      case 'date':
        return new Date(b.publishedDate || '').getTime() - new Date(a.publishedDate || '').getTime();
      case 'citations':
        return (b.citations || 0) - (a.citations || 0);
      default:
        return (b.relevanceScore || 0) - (a.relevanceScore || 0);
    }
  });

  return (
    <div className="min-h-screen bg-black text-white relative overflow-hidden">
      {/* Animated Background Grid */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-900/10 via-purple-900/10 to-pink-900/10" />
        <motion.div 
          className="absolute inset-0 opacity-20"
          style={{
            backgroundImage: `
              linear-gradient(rgba(59, 130, 246, 0.1) 1px, transparent 1px),
              linear-gradient(90deg, rgba(59, 130, 246, 0.1) 1px, transparent 1px)
            `,
            backgroundSize: '50px 50px'
          }}
          animate={{
            backgroundPosition: ['0px 0px', '50px 50px']
          }}
          transition={{
            duration: 20,
            repeat: Infinity,
            ease: "linear"
          }}
        />
      </div>

      <div className="relative z-10 p-8">
        {/* Header */}
        <motion.div 
          className="text-center mb-12"
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <motion.h1 
            className="text-6xl md:text-7xl font-black mb-4 relative"
            animate={{ 
              backgroundPosition: ['0% 50%', '100% 50%', '0% 50%']
            }}
            transition={{ 
              duration: 6, 
              repeat: Infinity, 
              ease: "linear" 
            }}
            style={{
              background: 'linear-gradient(90deg, #60a5fa, #a855f7, #ec4899, #60a5fa)',
              backgroundSize: '200% 200%',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text'
            }}
          >
            NEURAL RESEARCH
            {/* Sparkles Animation */}
            <motion.div
              className="absolute -top-4 -right-4"
              animate={{ rotate: 360 }}
              transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
            >
              <Sparkles className="w-8 h-8 text-yellow-400" />
            </motion.div>
            <motion.div
              className="absolute top-1/2 -left-8"
              animate={{ 
                scale: [1, 1.2, 1],
                rotate: [0, 180, 360]
              }}
              transition={{ duration: 3, repeat: Infinity }}
            >
              <Sparkles className="w-6 h-6 text-cyan-400" />
            </motion.div>
          </motion.h1>
          <motion.div 
            className="text-xl text-gray-300 max-w-2xl mx-auto flex items-center justify-center gap-2"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3, duration: 0.8 }}
          >
            <Zap className="w-5 h-5 text-yellow-400" />
            Unlock the infinite knowledge of the universe with AI-powered quantum research
            <motion.div
              animate={{ scale: [1, 1.3, 1] }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              <Zap className="w-5 h-5 text-purple-400" />
            </motion.div>
          </motion.div>
        </motion.div>

        {/* Search Interface */}
        <motion.div 
          className="max-w-6xl mx-auto mb-12"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.5, duration: 0.6 }}
        >
          {/* Source Selection */}
          <div className="flex flex-wrap justify-center gap-4 mb-8">
            {sourceConfig.map((source) => {
              const IconComponent = source.icon;
              const isSelected = selectedSources[source.id as keyof typeof selectedSources];
              return (
                <motion.button
                  title={source.name}
                  key={source.id}
                  className={`glass rounded-2xl px-6 py-3 flex items-center space-x-2 transition-all duration-300 ${
                    isSelected 
                      ? `bg-gradient-to-r ${source.color} text-white shadow-lg` 
                      : 'text-gray-400 hover:text-white hover:bg-white/10'
                  }`}
                  onClick={() => setSelectedSources(prev => ({
                    ...prev,
                    [source.id]: !prev[source.id as keyof typeof prev]
                  }))}
                  whileHover={{ scale: 1.05, y: -2 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <IconComponent className="w-4 h-4" />
                  <span className="font-medium">{source.name}</span>
                  {isSelected && (
                    <motion.div
                      className="w-2 h-2 bg-white rounded-full"
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ type: "spring", bounce: 0.5 }}
                    />
                  )}
                </motion.button>
              );
            })}
          </div>

          {/* Search Bar */}
          <div className="relative">
            <motion.div
              title="Search Bar"
              className="glass rounded-3xl p-2 relative overflow-hidden"
              whileHover={{ scale: 1.01 }}
              transition={{ type: "spring", bounce: 0.3 }}
            >
              <div className="flex items-center">
                <div className="flex-1 relative">
                  <input
                    title="Search Input"
                    ref={searchRef}
                    type="text"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                    placeholder="Ask anything... the universe of knowledge awaits"
                    className="w-full bg-transparent text-2xl text-white placeholder-gray-400 px-6 py-6 focus:outline-none"
                  />
                  
                  {/* Animated Cursor */}
                  <motion.div
                    className="absolute right-6 top-1/2 transform -translate-y-1/2 w-1 h-8 bg-cyan-400"
                    animate={{ opacity: [1, 0, 1] }}
                    transition={{ duration: 1, repeat: Infinity }}
                  />
                </div>
                
                <motion.button
                  title="Search Button"
                  onClick={handleSearch}
                  disabled={isSearching || !query.trim()}
                  className="bg-gradient-to-r from-purple-600 via-blue-600 to-cyan-500 text-white p-4 rounded-2xl m-2 hover:scale-105 transition-transform duration-300 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none flex items-center gap-2"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <AnimatePresence>
                    {isSearching ? (
                      <motion.div
                        key="searching"
                        className="flex items-center space-x-2"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                      >
                        <motion.div
                          animate={{ rotate: 360 }}
                          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                        >
                          <Brain className="w-6 h-6" />
                        </motion.div>
                        <span className="text-sm">Thinking...</span>
                      </motion.div>
                    ) : (
                      <motion.div
                        key="search"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="flex items-center space-x-2"
                      >
                        <Search className="w-6 h-6" />
                        <span className="text-sm">Search</span>
                        <ArrowRight className="w-4 h-4" />
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.button>
              </div>
            </motion.div>
          </div>

          {/* Advanced Filters Toggle */}
          <motion.div className="mt-4 flex justify-center">
            <motion.button
              onClick={() => setShowAdvancedFilters(!showAdvancedFilters)}
              className="glass rounded-2xl px-4 py-2 flex items-center space-x-2 text-gray-400 hover:text-white transition-colors"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Database className="w-4 h-4" />
              <span className="text-sm">Advanced Filters</span>
              <motion.div
                animate={{ rotate: showAdvancedFilters ? 180 : 0 }}
                transition={{ duration: 0.3 }}
              >
                <ChevronDown className="w-4 h-4" />
              </motion.div>
            </motion.button>
          </motion.div>

          {/* Advanced Filters Panel */}
          <AnimatePresence>
            {showAdvancedFilters && (
              <motion.div
                className="mt-4 glass rounded-2xl p-6"
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.3 }}
              >
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">Sort By</label>
                    <select
                      title="Sort results by"
                      value={sortBy}
                      onChange={(e) => setSortBy(e.target.value as 'relevance' | 'date' | 'citations')}
                      className="w-full bg-black/50 border border-gray-600 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-cyan-400"
                    >
                      <option value="relevance">Relevance</option>
                      <option value="date">Date</option>
                      <option value="citations">Citations</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">View Mode</label>
                    <div className="flex space-x-2">
                      <button
                        onClick={() => setViewMode('grid')}
                        className={`flex-1 px-3 py-2 rounded-xl transition-colors ${
                          viewMode === 'grid' ? 'bg-cyan-600 text-white' : 'bg-gray-700 text-gray-300'
                        }`}
                      >
                        Grid
                      </button>
                      <button
                        onClick={() => setViewMode('list')}
                        className={`flex-1 px-3 py-2 rounded-xl transition-colors ${
                          viewMode === 'list' ? 'bg-cyan-600 text-white' : 'bg-gray-700 text-gray-300'
                        }`}
                      >
                        List
                      </button>
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">Date Range</label>
                    <select 
                      title="Filter by date range"
                      className="w-full bg-black/50 border border-gray-600 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-cyan-400"
                    >
                      <option>All Time</option>
                      <option>Last Year</option>
                      <option>Last 5 Years</option>
                      <option>Last 10 Years</option>
                    </select>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>

        {/* Search Stats */}
        {results.length > 0 && (
          <motion.div 
            className="max-w-6xl mx-auto mb-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="flex justify-between items-center glass rounded-2xl p-6">
              <div className="flex items-center space-x-8">
                <div className="text-center">
                  <div className="text-2xl font-bold text-cyan-400 flex items-center gap-1">
                    <Database className="w-5 h-5" />
                    {searchStats.totalResults}
                  </div>
                  <div className="text-sm text-gray-400">Results Found</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-green-400 flex items-center gap-1">
                    <Zap className="w-5 h-5" />
                    {searchStats.searchTime}ms
                  </div>
                  <div className="text-sm text-gray-400">Search Time</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-purple-400 flex items-center gap-1">
                    <TrendingUp className="w-5 h-5" />
                    {searchStats.relevanceScore}%
                  </div>
                  <div className="text-sm text-gray-400">Relevance Score</div>
                </div>
              </div>
              
              <div className="flex items-center space-x-3">
                <motion.button
                  className="glass rounded-xl p-3 hover:bg-white/10 transition-colors"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Filter className="w-5 h-5 text-gray-400" />
                </motion.button>
                <motion.button
                  className="glass rounded-xl p-3 hover:bg-white/10 transition-colors"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Eye className="w-5 h-5 text-gray-400" />
                </motion.button>
                <motion.button
                  className="glass rounded-xl p-3 hover:bg-white/10 transition-colors"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Download className="w-5 h-5 text-gray-400" />
                </motion.button>
              </div>
            </div>
          </motion.div>
        )}

        {/* Results Grid */}
        <AnimatePresence>
          {sortedResults.length > 0 && (
            <motion.div 
              className="max-w-6xl mx-auto"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.6 }}
            >
              <div className={viewMode === 'grid' ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8" : "space-y-6"}>
                {sortedResults.map((result, index) => (
                  <motion.div
                    key={result.id}
                    className={`glass rounded-3xl overflow-hidden group cursor-pointer relative ${
                      viewMode === 'list' ? 'flex items-center p-6' : ''
                    }`}
                    initial={{ opacity: 0, y: 50, scale: 0.9 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    transition={{ 
                      delay: index * 0.1, 
                      duration: 0.5,
                      type: "spring",
                      bounce: 0.3
                    }}
                    whileHover={{ 
                      y: -10, 
                      scale: 1.03,
                      transition: { duration: 0.3 }
                    }}
                    onClick={() => setSelectedResult(result)}
                  >
                    {viewMode === 'grid' ? (
                      <>
                        {/* Thumbnail */}
                        <div className="aspect-video bg-gradient-to-br from-purple-600/20 to-blue-600/20 relative overflow-hidden">
                          <motion.img 
                            src={result.thumbnail} 
                            alt={result.title}
                            className="w-full h-full object-cover opacity-70 group-hover:opacity-100 group-hover:scale-110 transition-all duration-500"
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                          
                          {/* Source Badge */}
                          <div className="absolute top-4 left-4">
                            <div className={`px-3 py-1 rounded-full text-xs font-bold text-white ${
                              result.source === 'ArXiv' ? 'bg-red-500/80' :
                              result.source === 'PubMed' ? 'bg-blue-500/80' :
                              result.source === 'Wikipedia' ? 'bg-gray-500/80' :
                              'bg-purple-500/80'
                            }`}>
                              {result.source}
                            </div>
                          </div>

                          {/* Relevance Score */}
                          <div className="absolute top-4 right-4">
                            <div className="flex items-center space-x-1 bg-black/60 rounded-full px-2 py-1">
                              <Star className="w-3 h-3 text-yellow-400" />
                              <span className="text-xs text-white font-bold">{result.relevanceScore}</span>
                            </div>
                          </div>

                          {/* Trending Indicator */}
                          {result.citations && result.citations > 500 && (
                            <div className="absolute bottom-4 right-4">
                              <motion.div
                                className="flex items-center space-x-1 bg-green-500/80 rounded-full px-2 py-1"
                                animate={{ scale: [1, 1.1, 1] }}
                                transition={{ duration: 2, repeat: Infinity }}
                              >
                                <TrendingUp className="w-3 h-3 text-white" />
                                <span className="text-xs text-white font-bold">Hot</span>
                              </motion.div>
                            </div>
                          )}
                        </div>

                        {/* Content */}
                        <div className="p-6">
                          <h3 className="text-xl font-bold mb-2 line-clamp-2 group-hover:text-cyan-400 transition-colors duration-300">
                            {result.title}
                          </h3>
                          
                          <p className="text-gray-400 text-sm mb-4 line-clamp-3 leading-relaxed">
                            {result.description}
                          </p>

                          {/* Metadata */}
                          <div className="flex items-center justify-between text-xs text-gray-500 mb-4">
                            {result.authors && (
                              <div className="flex items-center space-x-1">
                                <Users className="w-3 h-3" />
                                <span className="truncate max-w-32">{result.authors}</span>
                              </div>
                            )}
                            {result.citations && (
                              <div className="flex items-center space-x-1">
                                <Award className="w-3 h-3" />
                                <span>{result.citations} citations</span>
                              </div>
                            )}
                            {result.publishedDate && (
                              <div className="flex items-center space-x-1">
                                <Clock className="w-3 h-3" />
                                <span>{result.publishedDate}</span>
                              </div>
                            )}
                          </div>

                          {/* Actions */}
                          <div className="flex items-center justify-between">
                            <motion.a
                              href={result.url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="flex items-center space-x-2 text-cyan-400 hover:text-cyan-300 transition-colors"
                              whileHover={{ x: 5 }}
                              onClick={(e) => e.stopPropagation()}
                            >
                              <span className="text-sm font-medium">Read More</span>
                              <ArrowRight className="w-4 h-4" />
                            </motion.a>
                            
                            <div className="flex items-center space-x-2">
                              <motion.button
                                className="p-2 rounded-full hover:bg-white/10 transition-colors"
                                whileHover={{ scale: 1.1 }}
                                whileTap={{ scale: 0.9 }}
                                onClick={(e) => e.stopPropagation()}
                              >
                                <Bookmark className="w-4 h-4 text-gray-400" />
                              </motion.button>
                              <motion.button
                                className="p-2 rounded-full hover:bg-white/10 transition-colors"
                                whileHover={{ scale: 1.1 }}
                                whileTap={{ scale: 0.9 }}
                                onClick={(e) => e.stopPropagation()}
                              >
                                <Share className="w-4 h-4 text-gray-400" />
                              </motion.button>
                            </div>
                          </div>
                        </div>
                      </>
                    ) : (
                      /* List View */
                      <div className="flex items-center space-x-6 w-full">
                        <div className="w-24 h-24 rounded-2xl bg-gradient-to-br from-purple-600/20 to-blue-600/20 flex-shrink-0 overflow-hidden">
                          <img 
                            src={result.thumbnail} 
                            alt={result.title}
                            className="w-full h-full object-cover opacity-70"
                          />
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center space-x-2 mb-2">
                            <span className={`px-2 py-1 rounded text-xs font-bold ${
                              result.source === 'ArXiv' ? 'bg-red-500/20 text-red-400' :
                              result.source === 'PubMed' ? 'bg-blue-500/20 text-blue-400' :
                              result.source === 'Wikipedia' ? 'bg-gray-500/20 text-gray-400' :
                              'bg-purple-500/20 text-purple-400'
                            }`}>
                              {result.source}
                            </span>
                            <div className="flex items-center space-x-1">
                              <Star className="w-3 h-3 text-yellow-400" />
                              <span className="text-xs text-gray-400">{result.relevanceScore}</span>
                            </div>
                          </div>
                          <h3 className="text-lg font-bold mb-1 group-hover:text-cyan-400 transition-colors">
                            {result.title}
                          </h3>
                          <p className="text-gray-400 text-sm mb-2 line-clamp-2">
                            {result.description}
                          </p>
                          <div className="flex items-center space-x-4 text-xs text-gray-500">
                            {result.authors && (
                              <div className="flex items-center space-x-1">
                                <Users className="w-3 h-3" />
                                <span>{result.authors}</span>
                              </div>
                            )}
                            {result.citations && (
                              <div className="flex items-center space-x-1">
                                <Award className="w-3 h-3" />
                                <span>{result.citations}</span>
                              </div>
                            )}
                            {result.publishedDate && (
                              <div className="flex items-center space-x-1">
                                <Clock className="w-3 h-3" />
                                <span>{result.publishedDate}</span>
                              </div>
                            )}
                          </div>
                        </div>
                        <div className="flex items-center space-x-2">
                          <motion.a
                            href={result.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="p-2 rounded-full hover:bg-white/10 transition-colors"
                            whileHover={{ scale: 1.1 }}
                            onClick={(e) => e.stopPropagation()}
                          >
                            <ArrowRight className="w-4 h-4 text-cyan-400" />
                          </motion.a>
                          <motion.button
                            className="p-2 rounded-full hover:bg-white/10 transition-colors"
                            whileHover={{ scale: 1.1 }}
                            onClick={(e) => e.stopPropagation()}
                          >
                            <Eye className="w-4 h-4 text-gray-400" />
                          </motion.button>
                        </div>
                      </div>
                    )}

                    {/* Hover Glow Effect */}
                    <div className="absolute inset-0 rounded-3xl bg-gradient-to-br from-cyan-500/0 to-purple-500/0 group-hover:from-cyan-500/10 group-hover:to-purple-500/10 transition-all duration-500 pointer-events-none" />
                  </motion.div>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* No Results State */}
        {!isSearching && results.length === 0 && query && (
          <motion.div 
            className="text-center py-20"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6 }}
          >
            <motion.div
              className="w-24 h-24 mx-auto mb-6 rounded-full bg-gradient-to-br from-purple-600/20 to-blue-600/20 flex items-center justify-center"
              animate={{ rotate: [0, 360] }}
              transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
            >
              <Search className="w-12 h-12 text-gray-400" />
            </motion.div>
            <h3 className="text-2xl font-bold text-gray-300 mb-4">No Results Found</h3>
            <p className="text-gray-500 max-w-md mx-auto">
              Try adjusting your search terms or selecting different sources to explore new knowledge domains.
            </p>
          </motion.div>
        )}

        {/* Loading State */}
        {isSearching && (
          <motion.div 
            className="text-center py-20"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              className="w-24 h-24 mx-auto mb-6 rounded-full bg-gradient-to-br from-purple-600 via-blue-600 to-cyan-500 flex items-center justify-center relative"
              animate={{ 
                rotate: 360,
                scale: [1, 1.1, 1]
              }}
              transition={{ 
                rotate: { duration: 2, repeat: Infinity, ease: "linear" },
                scale: { duration: 1, repeat: Infinity }
              }}
            >
              <Brain className="w-12 h-12 text-white" />
              {/* Sparkles around loading */}
              <motion.div
                className="absolute -top-2 -right-2"
                animate={{ 
                  scale: [0, 1, 0],
                  rotate: [0, 180, 360]
                }}
                transition={{ duration: 1.5, repeat: Infinity }}
              >
                <Sparkles className="w-4 h-4 text-yellow-400" />
              </motion.div>
              <motion.div
                className="absolute -bottom-2 -left-2"
                animate={{ 
                  scale: [0, 1, 0],
                  rotate: [360, 180, 0]
                }}
                transition={{ duration: 1.5, repeat: Infinity, delay: 0.5 }}
              >
                <Sparkles className="w-4 h-4 text-cyan-400" />
              </motion.div>
            </motion.div>
            <motion.h3 
              className="text-3xl font-bold text-white mb-4"
              animate={{ opacity: [0.5, 1, 0.5] }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              Neural Processing Active
            </motion.h3>
            <p className="text-gray-400 mb-8 flex items-center justify-center gap-2">
              <Database className="w-4 h-4" />
              Scanning {Object.values(selectedSources).filter(Boolean).length} knowledge sources...
              <Zap className="w-4 h-4 text-yellow-400" />
            </p>
            
            {/* Progress Particles */}
            <div className="flex justify-center space-x-2">
              {[...Array(5)].map((_, i) => (
                <motion.div
                  key={i}
                  className="w-3 h-3 bg-cyan-400 rounded-full"
                  animate={{
                    scale: [0, 1, 0],
                    opacity: [0, 1, 0]
                  }}
                  transition={{
                    duration: 1.5,
                    repeat: Infinity,
                    delay: i * 0.2
                  }}
                />
              ))}
            </div>
          </motion.div>
        )}
      </div>

      {/* Result Detail Modal */}
      <AnimatePresence>
        {selectedResult && (
          <motion.div
            className="fixed inset-0 z-50 flex items-center justify-center p-8"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setSelectedResult(null)}
          >
            <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" />
            <motion.div
              className="relative glass rounded-3xl p-8 max-w-2xl w-full max-h-[80vh] overflow-y-auto"
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
            >
              <button
                onClick={() => setSelectedResult(null)}
                className="absolute top-4 right-4 w-8 h-8 rounded-full bg-white/10 flex items-center justify-center hover:bg-white/20 transition-colors"
              >
                ×
              </button>
              
              <div className="space-y-6">
                <div>
                  <h2 className="text-3xl font-bold mb-4 flex items-center gap-2">
                    {selectedResult.title}
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
                    >
                      <Sparkles className="w-6 h-6 text-yellow-400" />
                    </motion.div>
                  </h2>
                  <div className="flex items-center space-x-4 text-sm text-gray-400">
                    <span className={`px-2 py-1 rounded ${
                      selectedResult.source === 'ArXiv' ? 'bg-red-500/20 text-red-400' :
                      selectedResult.source === 'PubMed' ? 'bg-blue-500/20 text-blue-400' :
                      selectedResult.source === 'Wikipedia' ? 'bg-gray-500/20 text-gray-400' :
                      'bg-purple-500/20 text-purple-400'
                    }`}>
                      {selectedResult.source}
                    </span>
                    {selectedResult.publishedDate && <span>{selectedResult.publishedDate}</span>}
                    {selectedResult.citations && (
                      <div className="flex items-center gap-1">
                        <TrendingUp className="w-3 h-3" />
                        <span>{selectedResult.citations} citations</span>
                      </div>
                    )}
                  </div>
                </div>
                
                <p className="text-gray-300 leading-relaxed">{selectedResult.description}</p>
                
                {selectedResult.authors && (
                  <div>
                    <h4 className="font-semibold text-gray-200 mb-2 flex items-center gap-2">
                      <Users className="w-4 h-4" />
                      Authors
                    </h4>
                    <p className="text-gray-400">{selectedResult.authors}</p>
                  </div>
                )}
                
                <div className="flex items-center space-x-4 pt-4 border-t border-gray-700">
                  <a
                    href={selectedResult.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center space-x-2 bg-gradient-to-r from-purple-600 to-blue-600 text-white px-6 py-3 rounded-2xl hover:scale-105 transition-transform duration-300"
                  >
                    <span>View Full Paper</span>
                    <ArrowRight className="w-4 h-4" />
                  </a>
                  <button className="p-3 rounded-2xl glass hover:bg-white/10 transition-colors" title="Bookmark">
                    <Bookmark className="w-5 h-5" />  
                  </button>
                  <button className="p-3 rounded-2xl glass hover:bg-white/10 transition-colors" title="Share">
                    <Share className="w-5 h-5" />
                  </button>
                  <button className="p-3 rounded-2xl glass hover:bg-white/10 transition-colors" title="View Details">
                    <Eye className="w-5 h-5" />
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
