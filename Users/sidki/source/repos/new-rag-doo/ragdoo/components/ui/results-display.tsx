'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  FileText, 
  ExternalLink, 
  Copy, 
  Download, 
  Share2,
  ThumbsUp,
  ThumbsDown,
  Bookmark,
  BookmarkCheck,
  Clock,
  Brain,
  Zap,
  CheckCircle,
  AlertCircle,
  Info,
  ChevronRight,
  ChevronDown,
  Search,
  MoreVertical
} from 'lucide-react';

interface Source {
  id: string;
  title: string;
  type: 'pdf' | 'doc' | 'web' | 'text';
  url?: string;
  page?: number;
  confidence: number;
  excerpt: string;
}

interface QueryResult {
  id: string;
  query: string;
  answer: string;
  sources: Source[];
  confidence: number;
  processingTime: number;
  timestamp: Date;
  isBookmarked: boolean;
  rating?: 'up' | 'down';
}

export function ResultsDisplay() {
  const [results, setResults] = useState<QueryResult[]>([
    {
      id: '1',
      query: 'What are the main findings from the research papers about AI in healthcare?',
      answer: 'Based on the analysis of the uploaded research papers, the main findings about AI in healthcare include: 1) AI-powered diagnostic tools show 94% accuracy in medical imaging, particularly in radiology and pathology. 2) Machine learning algorithms can predict patient outcomes with 89% precision, enabling proactive care. 3) Natural language processing improves clinical documentation efficiency by 60%. 4) AI-assisted drug discovery reduces development time by 30-50%. 5) However, challenges remain in data privacy, algorithmic bias, and regulatory compliance.',
      sources: [
        {
          id: 's1',
          title: 'AI in Medical Imaging: A Comprehensive Review',
          type: 'pdf',
          page: 15,
          confidence: 0.94,
          excerpt: 'Our study demonstrates that AI-powered diagnostic tools achieve 94% accuracy in medical imaging applications...'
        },
        {
          id: 's2',
          title: 'Machine Learning for Predictive Healthcare Analytics',
          type: 'pdf',
          page: 8,
          confidence: 0.89,
          excerpt: 'The predictive models showed 89% precision in forecasting patient outcomes across multiple healthcare scenarios...'
        },
        {
          id: 's3',
          title: 'NLP Applications in Clinical Documentation',
          type: 'doc',
          confidence: 0.87,
          excerpt: 'Implementation of NLP systems resulted in 60% improvement in clinical documentation efficiency...'
        }
      ],
      confidence: 0.91,
      processingTime: 2.3,
      timestamp: new Date(Date.now() - 300000),
      isBookmarked: true,
      rating: 'up'
    },
    {
      id: '2',
      query: 'Compare the methodologies used in different machine learning studies',
      answer: 'The uploaded papers employ various methodologies: supervised learning with labeled datasets (60% of studies), unsupervised clustering for pattern recognition (25%), and reinforcement learning for sequential decision-making (15%). Most studies use cross-validation with 80/20 train-test splits, though some employ k-fold validation. Deep learning approaches favor convolutional neural networks for image data and transformers for text processing.',
      sources: [
        {
          id: 's4',
          title: 'Comparative Analysis of ML Methodologies',
          type: 'pdf',
          page: 23,
          confidence: 0.88,
          excerpt: 'Our comparative analysis reveals that supervised learning approaches dominate the field...'
        }
      ],
      confidence: 0.85,
      processingTime: 1.8,
      timestamp: new Date(Date.now() - 900000),
      isBookmarked: false
    }
  ]);

  const [expandedResults, setExpandedResults] = useState<Set<string>>(new Set(['1']));
  const [filter, setFilter] = useState<'all' | 'bookmarked' | 'recent'>('all');

  const getSourceIcon = (type: Source['type']) => {
    switch (type) {
      case 'pdf': return FileText;
      case 'doc': return FileText;
      case 'web': return ExternalLink;
      case 'text': return FileText;
      default: return FileText;
    }
  };

  const getConfidenceColor = (confidence: number) => {
    if (confidence >= 0.9) return 'text-green-400 bg-green-500/20';
    if (confidence >= 0.7) return 'text-yellow-400 bg-yellow-500/20';
    return 'text-red-400 bg-red-500/20';
  };

  const getConfidenceIcon = (confidence: number) => {
    if (confidence >= 0.9) return CheckCircle;
    if (confidence >= 0.7) return AlertCircle;
    return Info;
  };

  const toggleResultExpansion = (id: string) => {
    setExpandedResults(prev => {
      const newSet = new Set(prev);
      if (newSet.has(id)) {
        newSet.delete(id);
      } else {
        newSet.add(id);
      }
      return newSet;
    });
  };

  const toggleBookmark = (id: string) => {
    setResults(prev => prev.map(result => 
      result.id === id ? { ...result, isBookmarked: !result.isBookmarked } : result
    ));
  };

  const rateResult = (id: string, rating: 'up' | 'down') => {
    setResults(prev => prev.map(result => 
      result.id === id ? { ...result, rating: result.rating === rating ? undefined : rating } : result
    ));
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    // Toast notification would go here
  };

  const filteredResults = results.filter(result => {
    switch (filter) {
      case 'bookmarked': return result.isBookmarked;
      case 'recent': return Date.now() - result.timestamp.getTime() < 3600000; // Last hour
      default: return true;
    }
  });

  const formatTimeAgo = (timestamp: Date) => {
    const now = new Date();
    const diff = now.getTime() - timestamp.getTime();
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    
    if (hours > 0) return `${hours}h ago`;
    if (minutes > 0) return `${minutes}m ago`;
    return 'Just now';
  };

  return (
    <div className="space-y-6">
      {/* Header with Filters */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <h3 className="text-2xl font-bold text-white flex items-center">
            <Brain className="w-6 h-6 mr-2 text-purple-400" />
            Query Results
          </h3>
          <span className="px-3 py-1 bg-purple-500/20 text-purple-400 rounded-full text-sm font-medium">
            {filteredResults.length} results
          </span>
        </div>

        <div className="flex items-center space-x-2">
          {['all', 'bookmarked', 'recent'].map((filterType) => (
            <button
              key={filterType}
              onClick={() => setFilter(filterType as 'all' | 'bookmarked' | 'recent')}
              className={`px-3 py-1 rounded-lg text-sm font-medium transition-all capitalize ${
                filter === filterType
                  ? 'bg-purple-600 text-white'
                  : 'text-gray-400 hover:text-white hover:bg-white/10'
              }`}
            >
              {filterType}
            </button>
          ))}
        </div>
      </div>

      {/* Results List */}
      <div className="space-y-6">
        <AnimatePresence>
          {filteredResults.map((result, index) => {
            const isExpanded = expandedResults.has(result.id);
            const ConfidenceIcon = getConfidenceIcon(result.confidence);
            
            return (
              <motion.div
                key={result.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3, delay: index * 0.1 }}
                className="glass rounded-2xl p-6 hover:bg-white/5 transition-all"
              >
                {/* Result Header */}
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1 space-y-2">
                    <div className="flex items-center space-x-3">
                      <button
                        onClick={() => toggleResultExpansion(result.id)}
                        className="flex items-center space-x-2 text-left hover:text-purple-400 transition-colors"
                      >
                        {isExpanded ? (
                          <ChevronDown className="w-5 h-5 text-purple-400" />
                        ) : (
                          <ChevronRight className="w-5 h-5 text-gray-400" />
                        )}
                        <h4 className="text-lg font-semibold text-white line-clamp-2">
                          {result.query}
                        </h4>
                      </button>
                    </div>

                    <div className="flex items-center space-x-4 text-sm text-gray-400">
                      <div className="flex items-center space-x-1">
                        <ConfidenceIcon className={`w-4 h-4 ${getConfidenceColor(result.confidence).split(' ')[0]}`} />
                        <span>{Math.round(result.confidence * 100)}% confidence</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <Zap className="w-4 h-4" />
                        <span>{result.processingTime}s</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <Clock className="w-4 h-4" />
                        <span>{formatTimeAgo(result.timestamp)}</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center space-x-2 ml-4">
                    <motion.button
                      onClick={() => toggleBookmark(result.id)}
                      className={`p-2 rounded-lg transition-all ${
                        result.isBookmarked 
                          ? 'text-yellow-400 bg-yellow-500/20' 
                          : 'text-gray-400 hover:text-yellow-400 hover:bg-yellow-500/10'
                      }`}
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                    >
                      {result.isBookmarked ? (
                        <BookmarkCheck className="w-5 h-5" />
                      ) : (
                        <Bookmark className="w-5 h-5" />
                      )}
                    </motion.button>

                    <button 
                      title="More options"
                      className="p-2 rounded-lg text-gray-400 hover:text-white hover:bg-white/10 transition-all"
                    >
                      <MoreVertical className="w-5 h-5" />
                    </button>
                  </div>
                </div>

                {/* Expanded Content */}
                <AnimatePresence>
                  {isExpanded && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      transition={{ duration: 0.3 }}
                      className="space-y-6"
                    >
                      {/* Answer */}
                      <div className="space-y-3">
                        <div className="flex items-center space-x-2">
                          <Brain className="w-5 h-5 text-purple-400" />
                          <h5 className="font-semibold text-white">AI Response</h5>
                        </div>
                        <div className="bg-gradient-to-r from-purple-500/10 to-blue-500/10 rounded-xl p-4 border border-purple-500/20">
                          <p className="text-gray-200 leading-relaxed">
                            {result.answer}
                          </p>
                        </div>
                      </div>

                      {/* Sources */}
                      <div className="space-y-3">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-2">
                            <FileText className="w-5 h-5 text-blue-400" />
                            <h5 className="font-semibold text-white">Sources</h5>
                            <span className="px-2 py-1 bg-blue-500/20 text-blue-400 rounded text-xs">
                              {result.sources.length}
                            </span>
                          </div>
                        </div>

                        <div className="grid grid-cols-1 gap-3">
                          {result.sources.map((source) => {
                            const SourceIcon = getSourceIcon(source.type);
                            return (
                              <motion.div
                                key={source.id}
                                className="p-4 bg-white/5 rounded-xl border border-gray-700/50 hover:border-purple-500/30 transition-all cursor-pointer"
                                whileHover={{ scale: 1.02 }}
                              >
                                <div className="flex items-start space-x-3">
                                  <div className="w-8 h-8 bg-gradient-to-r from-blue-500/20 to-purple-500/20 rounded-lg flex items-center justify-center flex-shrink-0">
                                    <SourceIcon className="w-4 h-4 text-blue-400" />
                                  </div>
                                  
                                  <div className="flex-1 space-y-2">
                                    <div className="flex items-center justify-between">
                                      <h6 className="font-medium text-white">{source.title}</h6>
                                      <div className={`px-2 py-1 rounded text-xs ${getConfidenceColor(source.confidence)}`}>
                                        {Math.round(source.confidence * 100)}%
                                      </div>
                                    </div>
                                    
                                    {source.page && (
                                      <p className="text-gray-400 text-sm">Page {source.page}</p>
                                    )}
                                    
                                    <p className="text-gray-300 text-sm leading-relaxed">
                                      {source.excerpt}
                                    </p>
                                  </div>
                                </div>
                              </motion.div>
                            );
                          })}
                        </div>
                      </div>

                      {/* Actions */}
                      <div className="flex items-center justify-between pt-4 border-t border-gray-700/50">
                        <div className="flex items-center space-x-3">
                          <motion.button
                            onClick={() => rateResult(result.id, 'up')}
                            className={`p-2 rounded-lg transition-all ${
                              result.rating === 'up'
                                ? 'text-green-400 bg-green-500/20'
                                : 'text-gray-400 hover:text-green-400 hover:bg-green-500/10'
                            }`}
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                          >
                            <ThumbsUp className="w-5 h-5" />
                          </motion.button>
                          
                          <motion.button
                            onClick={() => rateResult(result.id, 'down')}
                            className={`p-2 rounded-lg transition-all ${
                              result.rating === 'down'
                                ? 'text-red-400 bg-red-500/20'
                                : 'text-gray-400 hover:text-red-400 hover:bg-red-500/10'
                            }`}
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                          >
                            <ThumbsDown className="w-5 h-5" />
                          </motion.button>
                        </div>

                        <div className="flex items-center space-x-2">
                          <motion.button
                            onClick={() => copyToClipboard(result.answer)}
                            className="px-3 py-2 text-gray-400 hover:text-white hover:bg-white/10 rounded-lg transition-all text-sm flex items-center space-x-1"
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                          >
                            <Copy className="w-4 h-4" />
                            <span>Copy</span>
                          </motion.button>

                          <motion.button
                            className="px-3 py-2 text-gray-400 hover:text-white hover:bg-white/10 rounded-lg transition-all text-sm flex items-center space-x-1"
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                          >
                            <Share2 className="w-4 h-4" />
                            <span>Share</span>
                          </motion.button>

                          <motion.button
                            className="px-3 py-2 text-gray-400 hover:text-white hover:bg-white/10 rounded-lg transition-all text-sm flex items-center space-x-1"
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                          >
                            <Download className="w-4 h-4" />
                            <span>Export</span>
                          </motion.button>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>

      {/* Empty State */}
      {filteredResults.length === 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center py-12"
        >
          <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-r from-purple-500/20 to-blue-500/20 rounded-2xl flex items-center justify-center">
            <Search className="w-8 h-8 text-gray-400" />
          </div>
          <h3 className="text-xl font-semibold text-white mb-2">No results found</h3>
          <p className="text-gray-400">
            {filter === 'all' 
              ? 'Upload some documents and ask questions to see results here.'
              : `No ${filter} results available.`
            }
          </p>
        </motion.div>
      )}
    </div>
  );
}
