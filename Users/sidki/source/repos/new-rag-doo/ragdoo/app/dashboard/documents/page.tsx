// app/dashboard/documents/page.tsx - Document Management & RAG Interface
'use client';

import { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  FileText, 
  Upload, 
  Search, 
  Filter, 
  Download, 
  Trash2, 
  Eye,
  MessageSquare,
  Brain,
  Clock,
  File,
  Image,
  Code,
  Database,
  Loader2,
  CheckCircle,
  AlertCircle,
  Star,
  BookOpen,
  Zap,
  MoreVertical,
  Tag,
  Calendar,
  User
} from 'lucide-react';

interface Document {
  id: string;
  name: string;
  type: 'pdf' | 'doc' | 'txt' | 'md' | 'code' | 'image';
  size: number;
  uploadDate: Date;
  status: 'processing' | 'indexed' | 'error';
  tags: string[];
  summary?: string;
  pageCount?: number;
  wordCount?: number;
  isStarred: boolean;
  lastQueried?: Date;
  queryCount: number;
}

interface QueryResult {
  id: string;
  query: string;
  answer: string;
  sources: string[];
  confidence: number;
  timestamp: Date;
}

export default function DocumentsPage() {
  const [documents, setDocuments] = useState<Document[]>([
    {
      id: '1',
      name: 'Machine Learning Research Paper.pdf',
      type: 'pdf',
      size: 2547892,
      uploadDate: new Date(Date.now() - 86400000),
      status: 'indexed',
      tags: ['research', 'ml', 'ai'],
      summary: 'Comprehensive study on advanced machine learning algorithms and their applications in real-world scenarios.',
      pageCount: 45,
      wordCount: 12543,
      isStarred: true,
      lastQueried: new Date(Date.now() - 3600000),
      queryCount: 15
    },
    {
      id: '2',
      name: 'Project Requirements.docx',
      type: 'doc',
      size: 156743,
      uploadDate: new Date(Date.now() - 172800000),
      status: 'indexed',
      tags: ['project', 'requirements'],
      summary: 'Detailed project requirements and specifications for the new AI platform.',
      pageCount: 12,
      wordCount: 3421,
      isStarred: false,
      queryCount: 8
    },
    {
      id: '3',
      name: 'API Documentation.md',
      type: 'md',
      size: 89234,
      uploadDate: new Date(Date.now() - 259200000),
      status: 'processing',
      tags: ['documentation', 'api'],
      isStarred: false,
      queryCount: 3
    }
  ]);

  const [queries, setQueries] = useState<QueryResult[]>([
    {
      id: '1',
      query: 'What are the key findings in the ML research paper?',
      answer: 'The research paper highlights three key findings: 1) Transformer architectures show 23% better performance on complex NLP tasks, 2) Data augmentation techniques can improve model accuracy by up to 15%, and 3) Ensemble methods provide more robust predictions in production environments.',
      sources: ['Machine Learning Research Paper.pdf'],
      confidence: 0.92,
      timestamp: new Date(Date.now() - 3600000)
    }
  ]);

  const [currentQuery, setCurrentQuery] = useState('');
  const [isQuerying, setIsQuerying] = useState(false);
  const [selectedDocument, setSelectedDocument] = useState<Document | null>(null);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [filterStatus, setFilterStatus] = useState<'all' | 'indexed' | 'processing' | 'error'>('all');
  const [searchTerm, setSearchTerm] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const getFileIcon = (type: Document['type']) => {
    switch (type) {
      case 'pdf': return FileText;
      case 'doc': return FileText;
      case 'txt': return File;
      case 'md': return BookOpen;
      case 'code': return Code;
      case 'image': return Image;
      default: return File;
    }
  };

  const getStatusColor = (status: Document['status']) => {
    switch (status) {
      case 'indexed': return 'text-green-400 bg-green-500/20';
      case 'processing': return 'text-yellow-400 bg-yellow-500/20';
      case 'error': return 'text-red-400 bg-red-500/20';
      default: return 'text-gray-400 bg-gray-500/20';
    }
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (!files) return;

    for (const file of Array.from(files)) {
      const newDoc: Document = {
        id: Math.random().toString(36).substring(7),
        name: file.name,
        type: getFileType(file.name),
        size: file.size,
        uploadDate: new Date(),
        status: 'processing',
        tags: [],
        isStarred: false,
        queryCount: 0
      };

      setDocuments(prev => [newDoc, ...prev]);

      // Simulate processing
      setTimeout(() => {
        setDocuments(prev => prev.map(doc => 
          doc.id === newDoc.id ? { ...doc, status: 'indexed' } : doc
        ));
      }, 3000);
    }
  };

  const getFileType = (filename: string): Document['type'] => {
    const ext = filename.split('.').pop()?.toLowerCase();
    switch (ext) {
      case 'pdf': return 'pdf';
      case 'doc':
      case 'docx': return 'doc';
      case 'txt': return 'txt';
      case 'md': return 'md';
      case 'js':
      case 'ts':
      case 'py':
      case 'java': return 'code';
      case 'jpg':
      case 'jpeg':
      case 'png': return 'image';
      default: return 'txt';
    }
  };

  const handleQuery = async () => {
    if (!currentQuery.trim()) return;

    setIsQuerying(true);

    try {
      const response = await fetch('/api/query', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          query: currentQuery,
          documents: documents.filter(doc => doc.status === 'indexed').map(doc => doc.id)
        })
      });

      const result = await response.json();
      
      const newQuery: QueryResult = {
        id: Math.random().toString(36).substring(7),
        query: currentQuery,
        answer: result.answer,
        sources: result.sources,
        confidence: result.confidence,
        timestamp: new Date()
      };

      setQueries(prev => [newQuery, ...prev]);
      setCurrentQuery('');
    } catch (error) {
      console.error('Query failed:', error);
    }

    setIsQuerying(false);
  };

  const toggleStar = (docId: string) => {
    setDocuments(prev => prev.map(doc => 
      doc.id === docId ? { ...doc, isStarred: !doc.isStarred } : doc
    ));
  };

  const deleteDocument = (docId: string) => {
    setDocuments(prev => prev.filter(doc => doc.id !== docId));
  };

  const filteredDocuments = documents.filter(doc => {
    const matchesSearch = doc.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         doc.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesFilter = filterStatus === 'all' || doc.status === filterStatus;
    return matchesSearch && matchesFilter;
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-purple-950/20 to-black p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-black text-white mb-2 flex items-center">
                <Database className="w-10 h-10 mr-4 text-purple-400" />
                Document Intelligence
              </h1>
              <p className="text-gray-400 text-lg">
                Upload, analyze, and query your documents with AI-powered insights
              </p>
            </div>
            <div className="flex items-center space-x-4">
              <input
                ref={fileInputRef}
                type="file"
                multiple
                accept=".pdf,.doc,.docx,.txt,.md,.py,.js,.ts,.java"
                onChange={handleFileUpload}
                className="hidden"
              />
              <motion.button
                onClick={() => fileInputRef.current?.click()}
                className="px-6 py-3 bg-gradient-to-r from-purple-600 to-blue-600 rounded-lg font-semibold text-white flex items-center space-x-2"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Upload className="w-5 h-5" />
                <span>Upload Documents</span>
              </motion.button>
            </div>
          </div>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Documents Panel */}
          <div className="lg:col-span-2 space-y-6">
            {/* Controls */}
            <div className="flex items-center justify-between glass rounded-xl p-4">
              <div className="flex items-center space-x-4">
                <div className="relative">
                  <Search className="w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                  <input
                    type="text"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    placeholder="Search documents..."
                    aria-label="Search documents"
                    className="pl-10 pr-4 py-2 bg-black/50 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:border-purple-500 focus:outline-none"
                  />
                </div>

                <div className="flex items-center space-x-2">
                  {['all', 'indexed', 'processing', 'error'].map((status) => (
                    <button
                      key={status}
                      onClick={() => setFilterStatus(status as any)}
                      className={`px-3 py-2 rounded-lg text-sm font-medium transition-all capitalize ${
                        filterStatus === status
                          ? 'bg-purple-600 text-white'
                          : 'text-gray-400 hover:text-white hover:bg-white/10'
                      }`}
                    >
                      {status}
                    </button>
                  ))}
                </div>
              </div>

              <div className="flex items-center space-x-2">
                <button
                  onClick={() => setViewMode('grid')}
                  className={`p-2 rounded-lg ${viewMode === 'grid' ? 'bg-purple-600' : 'glass hover:bg-white/10'}`}
                >
                  <div className="w-4 h-4 grid grid-cols-2 gap-0.5">
                    <div className="bg-current rounded-sm"></div>
                    <div className="bg-current rounded-sm"></div>
                    <div className="bg-current rounded-sm"></div>
                    <div className="bg-current rounded-sm"></div>
                  </div>
                </button>
                <button
                  onClick={() => setViewMode('list')}
                  className={`p-2 rounded-lg ${viewMode === 'list' ? 'bg-purple-600' : 'glass hover:bg-white/10'}`}
                >
                  <div className="w-4 h-4 flex flex-col space-y-1">
                    <div className="h-0.5 bg-current rounded"></div>
                    <div className="h-0.5 bg-current rounded"></div>
                    <div className="h-0.5 bg-current rounded"></div>
                  </div>
                </button>
              </div>
            </div>

            {/* Documents Grid/List */}
            <div className={`${
              viewMode === 'grid' 
                ? 'grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6' 
                : 'space-y-4'
            }`}>
              {filteredDocuments.map((doc) => {
                const Icon = getFileIcon(doc.type);
                
                return (
                  <motion.div
                    key={doc.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className={`glass rounded-xl p-6 hover:bg-white/10 transition-all cursor-pointer ${
                      viewMode === 'list' ? 'flex items-center space-x-4' : ''
                    }`}
                    onClick={() => setSelectedDocument(doc)}
                  >
                    <div className={`${viewMode === 'grid' ? 'text-center mb-4' : 'flex-shrink-0'}`}>
                      <div className={`${
                        viewMode === 'grid' 
                          ? 'w-16 h-16 mx-auto mb-3' 
                          : 'w-12 h-12'
                      } bg-gradient-to-r from-purple-500/20 to-blue-500/20 rounded-xl flex items-center justify-center`}>
                        <Icon className={`${viewMode === 'grid' ? 'w-8 h-8' : 'w-6 h-6'} text-purple-400`} />
                      </div>
                    </div>

                    <div className={`${viewMode === 'grid' ? 'text-center' : 'flex-1'}`}>
                      <div className={`${viewMode === 'list' ? 'flex items-center justify-between mb-2' : 'mb-2'}`}>
                        <h3 className={`font-semibold text-white ${
                          viewMode === 'grid' ? 'text-sm' : 'text-base'
                        } truncate`}>
                          {doc.name}
                        </h3>
                        <div className="flex items-center space-x-2">
                                                      <button
                              onClick={(e) => {
                                e.stopPropagation();
                                toggleStar(doc.id);
                              }}
                              className="p-1 hover:bg-white/10 rounded"
                              title={doc.isStarred ? "Remove from favorites" : "Add to favorites"}
                            >
                            <Star className={`w-4 h-4 ${
                              doc.isStarred ? 'text-yellow-400 fill-current' : 'text-gray-400'
                            }`} />
                          </button>
                          <span className={`px-2 py-1 rounded text-xs ${getStatusColor(doc.status)}`}>
                            {doc.status}
                          </span>
                        </div>
                      </div>

                      <div className={`${viewMode === 'list' ? 'flex items-center justify-between' : 'space-y-2'}`}>
                        <div className={`${viewMode === 'list' ? 'flex items-center space-x-4' : 'text-xs text-gray-400'}`}>
                          <span>{formatFileSize(doc.size)}</span>
                          <span className={viewMode === 'list' ? '' : 'block'}>
                            {doc.uploadDate.toLocaleDateString()}
                          </span>
                          {doc.queryCount > 0 && (
                            <span className={`${viewMode === 'list' ? '' : 'block'} text-purple-400`}>
                              {doc.queryCount} queries
                            </span>
                          )}
                        </div>

                        {viewMode === 'list' && (
                          <div className="flex items-center space-x-2">
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                deleteDocument(doc.id);
                              }}
                              className="p-1 text-red-400 hover:bg-red-500/10 rounded"
                              title="Delete document"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                            <button className="p-1 text-gray-400 hover:bg-white/10 rounded" title="More options">
                              <MoreVertical className="w-4 h-4" />
                            </button>
                          </div>
                        )}
                      </div>

                      {viewMode === 'grid' && doc.tags.length > 0 && (
                        <div className="flex flex-wrap gap-1 mt-2">
                          {doc.tags.slice(0, 2).map((tag) => (
                            <span key={tag} className="px-2 py-1 bg-purple-500/20 text-purple-400 rounded text-xs">
                              {tag}
                            </span>
                          ))}
                          {doc.tags.length > 2 && (
                            <span className="px-2 py-1 bg-gray-500/20 text-gray-400 rounded text-xs">
                              +{doc.tags.length - 2}
                            </span>
                          )}
                        </div>
                      )}
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </div>

          {/* Query Panel */}
          <div className="space-y-6">
            {/* Query Input */}
            <div className="glass rounded-xl p-6">
              <h2 className="text-xl font-bold text-white mb-4 flex items-center">
                <Brain className="w-5 h-5 mr-2 text-purple-400" />
                Ask Questions
              </h2>

              <div className="space-y-4">
                <textarea
                  value={currentQuery}
                  onChange={(e) => setCurrentQuery(e.target.value)}
                  placeholder="Ask anything about your documents..."
                  className="w-full h-24 bg-black/50 border border-gray-600 rounded-lg p-3 text-white placeholder-gray-400 focus:border-purple-500 focus:outline-none resize-none"
                />

                <motion.button
                  onClick={handleQuery}
                  disabled={!currentQuery.trim() || isQuerying}
                  className="w-full py-3 bg-gradient-to-r from-purple-600 to-blue-600 rounded-lg font-semibold text-white disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  {isQuerying ? (
                    <>
                      <Loader2 className="w-5 h-5 animate-spin" />
                      <span>Searching...</span>
                    </>
                  ) : (
                    <>
                      <MessageSquare className="w-5 h-5" />
                      <span>Ask AI</span>
                    </>
                  )}
                </motion.button>
              </div>
            </div>

            {/* Recent Queries */}
            <div className="glass rounded-xl p-6">
              <h3 className="font-semibold text-white mb-4 flex items-center">
                <Clock className="w-4 h-4 mr-2 text-purple-400" />
                Recent Queries
              </h3>

              <div className="space-y-4">
                {queries.slice(0, 3).map((query) => (
                  <motion.div
                    key={query.id}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="bg-black/30 rounded-lg p-4"
                  >
                    <p className="text-white font-medium text-sm mb-2">{query.query}</p>
                    <p className="text-gray-400 text-xs mb-2 line-clamp-2">{query.answer}</p>
                    <div className="flex items-center justify-between">
                      <span className="text-purple-400 text-xs">
                        {Math.round(query.confidence * 100)}% confidence
                      </span>
                      <span className="text-gray-500 text-xs">
                        {query.timestamp.toLocaleTimeString()}
                      </span>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>

            {/* Stats */}
            <div className="glass rounded-xl p-6">
              <h3 className="font-semibold text-white mb-4">Statistics</h3>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-gray-400">Total Documents</span>
                  <span className="text-white font-medium">{documents.length}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-400">Indexed</span>
                  <span className="text-green-400 font-medium">
                    {documents.filter(d => d.status === 'indexed').length}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-400">Total Queries</span>
                  <span className="text-purple-400 font-medium">{queries.length}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
