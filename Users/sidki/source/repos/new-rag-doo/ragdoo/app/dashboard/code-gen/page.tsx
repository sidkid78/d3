// app/dashboard/code-gen/page.tsx - AI Code Generation Interface
'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Code2, 
  Download, 
  Copy, 
  Settings, 
  Sparkles,
  FileCode,
  Terminal,
  Cpu,
  Zap,
  CheckCircle,
  AlertCircle,
  Clock,
  Loader2,
  ChevronRight,
  Lightbulb,
  Brain
} from 'lucide-react';

interface CodeTemplate {
  id: string;
  name: string;
  description: string;
  language: string;
  category: 'web' | 'api' | 'data' | 'ai' | 'mobile';
  icon: string;
  complexity: 'beginner' | 'intermediate' | 'advanced';
}

interface GeneratedCode {
  id: string;
  code: string;
  language: string;
  description: string;
  timestamp: Date;
  status: 'generating' | 'completed' | 'error';
  thoughts?: string;
  showThoughts?: boolean;
  previewHtml?: string;
  activeTab?: 'code' | 'preview';
}

export default function CodeGenPage() {
  const [prompt, setPrompt] = useState('');
  const [selectedLanguage, setSelectedLanguage] = useState('typescript');
  const [selectedFramework, setSelectedFramework] = useState('react');
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedCodes, setGeneratedCodes] = useState<GeneratedCode[]>([]);
  const [selectedTemplate, setSelectedTemplate] = useState<CodeTemplate | null>(null);

  const languages = [
    { id: 'typescript', name: 'TypeScript', color: 'text-blue-400' },
    { id: 'javascript', name: 'JavaScript', color: 'text-yellow-400' },
    { id: 'python', name: 'Python', color: 'text-green-400' },
    { id: 'rust', name: 'Rust', color: 'text-orange-400' },
    { id: 'go', name: 'Go', color: 'text-cyan-400' },
    { id: 'java', name: 'Java', color: 'text-red-400' }
  ];

  const frameworks = [
    { id: 'react', name: 'React', category: 'web' },
    { id: 'nextjs', name: 'Next.js', category: 'web' },
    { id: 'express', name: 'Express', category: 'api' },
    { id: 'fastapi', name: 'FastAPI', category: 'api' },
    { id: 'django', name: 'Django', category: 'web' },
    { id: 'flask', name: 'Flask', category: 'api' }
  ];

  const templates: CodeTemplate[] = [
    {
      id: '1',
      name: 'REST API with Authentication',
      description: 'Complete REST API with JWT authentication and middleware',
      language: 'typescript',
      category: 'api',
      icon: '🔐',
      complexity: 'intermediate'
    },
    {
      id: '2',
      name: 'React Dashboard Component',
      description: 'Modern dashboard with charts and real-time data',
      language: 'typescript',
      category: 'web',
      icon: '📊',
      complexity: 'intermediate'
    },
    {
      id: '3',
      name: 'Data Processing Pipeline',
      description: 'ETL pipeline with error handling and monitoring',
      language: 'python',
      category: 'data',
      icon: '⚡',
      complexity: 'advanced'
    },
    {
      id: '4',
      name: 'Machine Learning Model',
      description: 'Complete ML model with training and inference',
      language: 'python',
      category: 'ai',
      icon: '🤖',
      complexity: 'advanced'
    }
  ];

  const handleGenerate = async () => {
    if (!prompt.trim()) return;

    setIsGenerating(true);
    
    const newCode: GeneratedCode = {
      id: Math.random().toString(36).substring(7),
      code: '',
      language: selectedLanguage,
      description: prompt,
      timestamp: new Date(),
      status: 'generating'
    };

    setGeneratedCodes(prev => [newCode, ...prev]);

    try {
      const response = await fetch('/api/generate-code', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          description: prompt,
          language: selectedLanguage,
          framework: selectedFramework,
          template: selectedTemplate?.id
        })
      });

      const result = await response.json();
      
      if (result.success && result.data?.code) {
        setGeneratedCodes(prev => prev.map(item => 
          item.id === newCode.id 
            ? { 
                ...item, 
                code: result.data.code, 
                thoughts: result.data.thoughts,
                previewHtml: result.data.previewHtml,
                activeTab: result.data.previewHtml ? 'preview' : 'code',
                status: 'completed' 
              }
            : item
        ));
      } else {
        throw new Error(result.error || 'Failed to extract code from response');
      }
    } catch (error) {
      console.error('Generation failed:', error);
      setGeneratedCodes(prev => prev.map(code => 
        code.id === newCode.id 
          ? { ...code, status: 'error' }
          : code
      ));
    }

    setIsGenerating(false);
    setPrompt('');
  };

  const copyToClipboard = (code: string) => {
    navigator.clipboard.writeText(code);
  };

  const toggleThoughts = (id: string) => {
    setGeneratedCodes(prev => prev.map(item => 
      item.id === id ? { ...item, showThoughts: !item.showThoughts } : item
    ));
  };

  const setTab = (id: string, tab: 'code' | 'preview') => {
    setGeneratedCodes(prev => prev.map(item => 
      item.id === id ? { ...item, activeTab: tab } : item
    ));
  };

  const getComplexityColor = (complexity: string) => {
    switch (complexity) {
      case 'beginner': return 'text-green-400 bg-green-500/20';
      case 'intermediate': return 'text-yellow-400 bg-yellow-500/20';
      case 'advanced': return 'text-red-400 bg-red-500/20';
      default: return 'text-gray-400 bg-gray-500/20';
    }
  };

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
                <Code2 className="w-10 h-10 mr-4 text-purple-400" />
                AI Code Generator
              </h1>
              <p className="text-gray-400 text-lg">
                Transform your ideas into production-ready code with AI assistance
              </p>
            </div>
            <div className="flex items-center space-x-4">
              <div className="px-4 py-2 glass rounded-lg">
                <div className="flex items-center space-x-2">
                  <Cpu className="w-4 h-4 text-purple-400" />
                  <span className="text-white text-sm">GPT-4 Powered</span>
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Input Panel */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="lg:col-span-2 space-y-6"
          >
            {/* Code Generation Form */}
            <div className="glass rounded-2xl p-6">
              <h2 className="text-2xl font-bold text-white mb-6 flex items-center">
                <Sparkles className="w-6 h-6 mr-2 text-purple-400" />
                Generate Code
              </h2>

              {/* Language & Framework Selection */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                <div>
                  <label className="block text-white font-medium mb-2">Language</label>
                  <div className="grid grid-cols-3 gap-2">
                    {languages.map((lang) => (
                      <button
                        key={lang.id}
                        onClick={() => setSelectedLanguage(lang.id)}
                        className={`p-3 rounded-lg transition-all text-sm font-medium ${
                          selectedLanguage === lang.id
                            ? 'bg-purple-600 text-white'
                            : 'glass hover:bg-white/10 text-gray-300'
                        }`}
                      >
                        <span className={lang.color}>●</span> {lang.name}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-white font-medium mb-2">Framework</label>
                  <div className="grid grid-cols-2 gap-2">
                    {frameworks.map((fw) => (
                      <button
                        key={fw.id}
                        onClick={() => setSelectedFramework(fw.id)}
                        className={`p-3 rounded-lg transition-all text-sm font-medium ${
                          selectedFramework === fw.id
                            ? 'bg-purple-600 text-white'
                            : 'glass hover:bg-white/10 text-gray-300'
                        }`}
                      >
                        {fw.name}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Prompt Input */}
              <div className="mb-6">
                <label className="block text-white font-medium mb-2">
                  Describe what you want to build
                </label>
                <textarea
                  value={prompt}
                  onChange={(e) => setPrompt(e.target.value)}
                  placeholder="E.g., Create a user authentication system with login, registration, and password reset functionality..."
                  className="w-full h-32 bg-black/50 border border-gray-600 rounded-lg p-4 text-white placeholder-gray-400 focus:border-purple-500 focus:outline-none resize-none"
                />
              </div>

              {/* Generate Button */}
              <motion.button
                onClick={handleGenerate}
                disabled={!prompt.trim() || isGenerating}
                className="w-full py-4 bg-gradient-to-r from-purple-600 to-blue-600 rounded-lg font-semibold text-white disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                {isGenerating ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    <span>Generating...</span>
                  </>
                ) : (
                  <>
                    <Zap className="w-5 h-5" />
                    <span>Generate Code</span>
                  </>
                )}
              </motion.button>
            </div>

            {/* Generated Code Results */}
            <AnimatePresence>
              {generatedCodes.map((codeItem) => (
                <motion.div
                  key={codeItem.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  className="glass rounded-2xl p-6"
                >
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center space-x-3">
                      <FileCode className="w-5 h-5 text-purple-400" />
                      <h3 className="font-semibold text-white">{codeItem.description}</h3>
                      {codeItem.status === 'generating' && (
                        <Loader2 className="w-4 h-4 text-purple-400 animate-spin" />
                      )}
                      {codeItem.status === 'completed' && (
                        <CheckCircle className="w-4 h-4 text-green-400" />
                      )}
                      {codeItem.status === 'error' && (
                        <AlertCircle className="w-4 h-4 text-red-400" />
                      )}
                    </div>
                    <div className="flex items-center space-x-2">
                      <Clock className="w-4 h-4 text-gray-400" />
                      <span className="text-gray-400 text-sm">
                        {codeItem.timestamp.toLocaleTimeString()}
                      </span>
                    </div>
                  </div>

                  {codeItem.status === 'completed' && codeItem.code && (
                    <div className="space-y-4">
                      {/* Thought Section */}
                      {codeItem.thoughts && (
                        <div className="border-l-2 border-purple-500/30 pl-4 py-2 bg-purple-500/5 rounded-r-lg">
                          <button 
                            onClick={() => toggleThoughts(codeItem.id)}
                            className="flex items-center space-x-2 text-purple-400 hover:text-purple-300 transition-colors text-sm font-medium mb-2"
                          >
                            <Brain className="w-4 h-4" />
                            <span>{codeItem.showThoughts ? 'Hide' : 'Show'} Thinking Process</span>
                          </button>
                          
                          <AnimatePresence>
                            {codeItem.showThoughts && (
                              <motion.div
                                initial={{ opacity: 0, height: 0 }}
                                animate={{ opacity: 1, height: 'auto' }}
                                exit={{ opacity: 0, height: 0 }}
                                className="overflow-hidden"
                              >
                                <p className="text-gray-400 text-sm italic leading-relaxed whitespace-pre-wrap">
                                  {codeItem.thoughts}
                                </p>
                              </motion.div>
                            )}
                          </AnimatePresence>
                        </div>
                      )}

                      {/* Tabs */}
                      <div className="flex items-center space-x-1 border-b border-white/10 mb-4">
                        <button
                          onClick={() => setTab(codeItem.id, 'code')}
                          className={`px-4 py-2 text-sm font-medium transition-all ${
                            (codeItem.activeTab || 'code') === 'code'
                              ? 'text-purple-400 border-b-2 border-purple-400'
                              : 'text-gray-400 hover:text-gray-300'
                          }`}
                        >
                          Source Code
                        </button>
                        {codeItem.previewHtml && (
                          <button
                            onClick={() => setTab(codeItem.id, 'preview')}
                            className={`px-4 py-2 text-sm font-medium transition-all ${
                              codeItem.activeTab === 'preview'
                                ? 'text-purple-400 border-b-2 border-purple-400'
                                : 'text-gray-400 hover:text-gray-300'
                            }`}
                          >
                            Live Preview
                          </button>
                        )}
                      </div>

                      {/* Code Viewer or Preview */}
                      {(codeItem.activeTab || 'code') === 'code' ? (
                        <div className="relative group">
                          <div className="absolute -inset-0.5 bg-gradient-to-r from-purple-500 to-blue-500 rounded-lg blur opacity-25 group-hover:opacity-50 transition duration-1000 group-hover:duration-200"></div>
                          <div className="relative">
                            <pre className="bg-black/80 p-6 rounded-lg overflow-x-auto text-sm font-mono border border-white/10">
                              <code className="text-gray-100">{codeItem.code}</code>
                            </pre>
                            <div className="absolute top-4 right-4 flex space-x-2 opacity-0 group-hover:opacity-100 transition-opacity">
                              <button
                                onClick={() => copyToClipboard(codeItem.code)}
                                className="p-2 bg-white/10 hover:bg-white/20 rounded-lg backdrop-blur-md border border-white/20 transition-all"
                                title="Copy code"
                              >
                                <Copy className="w-4 h-4 text-white" />
                              </button>
                              <button
                                className="p-2 bg-white/10 hover:bg-white/20 rounded-lg backdrop-blur-md border border-white/20 transition-all"
                                title="Download code"
                              >
                                <Download className="w-4 h-4 text-white" />
                              </button>
                            </div>
                          </div>
                        </div>
                      ) : (
                        <div className="relative aspect-video bg-white rounded-lg overflow-hidden border border-white/10 shadow-2xl">
                          <iframe
                            srcDoc={codeItem.previewHtml}
                            className="w-full h-full border-none"
                            title="Preview"
                          />
                        </div>
                      )}
                    </div>
                  )}

                  {codeItem.status === 'generating' && (
                    <div className="bg-black/50 p-8 rounded-lg text-center">
                      <div className="animate-pulse text-gray-400">
                        AI is crafting your code...
                      </div>
                    </div>
                  )}

                  {codeItem.status === 'error' && (
                    <div className="bg-red-500/10 border border-red-500/20 p-4 rounded-lg text-center">
                      <p className="text-red-400">Failed to generate code. Please try again.</p>
                    </div>
                  )}
                </motion.div>
              ))}
            </AnimatePresence>
          </motion.div>

          {/* Templates Sidebar */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="space-y-6"
          >
            <div className="glass rounded-2xl p-6">
              <h2 className="text-xl font-bold text-white mb-4 flex items-center">
                <Lightbulb className="w-5 h-5 mr-2 text-purple-400" />
                Code Templates
              </h2>

              <div className="space-y-3">
                {templates.map((template) => (
                  <motion.button
                    key={template.id}
                    onClick={() => setSelectedTemplate(template)}
                    className={`w-full text-left p-4 rounded-lg transition-all ${
                      selectedTemplate?.id === template.id
                        ? 'bg-purple-600/20 border border-purple-500/30'
                        : 'glass hover:bg-white/10'
                    }`}
                    whileHover={{ scale: 1.02 }}
                  >
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex items-center space-x-2">
                        <span className="text-2xl">{template.icon}</span>
                        <h3 className="font-medium text-white text-sm">{template.name}</h3>
                      </div>
                      <ChevronRight className="w-4 h-4 text-gray-400" />
                    </div>
                    <p className="text-gray-400 text-xs mb-2">{template.description}</p>
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-purple-400">{template.language}</span>
                      <span className={`px-2 py-1 rounded text-xs ${getComplexityColor(template.complexity)}`}>
                        {template.complexity}
                      </span>
                    </div>
                  </motion.button>
                ))}
              </div>
            </div>

            {/* Quick Actions */}
            <div className="glass rounded-2xl p-6">
              <h3 className="font-semibold text-white mb-4">Quick Actions</h3>
              <div className="space-y-2">
                <button className="w-full p-3 glass rounded-lg hover:bg-white/10 transition-all text-left">
                  <div className="flex items-center space-x-3">
                    <Terminal className="w-4 h-4 text-purple-400" />
                    <span className="text-white text-sm">Run Code</span>
                  </div>
                </button>
                <button className="w-full p-3 glass rounded-lg hover:bg-white/10 transition-all text-left">
                  <div className="flex items-center space-x-3">
                    <Settings className="w-4 h-4 text-purple-400" />
                    <span className="text-white text-sm">Advanced Settings</span>
                  </div>
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
