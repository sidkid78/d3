// app/dashboard/agent/page.tsx - AI Agent Orchestrator Interface
'use client';

import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Bot, 
  Send, 
  Mic, 
  MicOff, 
  Brain, 
  Zap,
  Clock,
  CheckCircle,
  AlertCircle,
  Loader2,
  Settings,
  Play,
  Pause,
  Square,
  RotateCcw,
  Sparkles,
  MessageSquare,
  FileText,
  Code,
  Image,
  Search,
  Database,
  Users,
  Activity,
  TrendingUp,
  Cpu,
  Network
} from 'lucide-react';

interface AgentMessage {
  id: string;
  type: 'user' | 'agent' | 'system';
  content: string;
  timestamp: Date;
  toolsUsed?: string[];
  processingTime?: number;
  confidence?: number;
}

interface Agent {
  id: string;
  name: string;
  description: string;
  status: 'idle' | 'active' | 'thinking' | 'error';
  capabilities: string[];
  icon: string;
  lastUsed?: Date;
  successRate: number;
}

interface Task {
  id: string;
  description: string;
  status: 'pending' | 'running' | 'completed' | 'failed';
  assignedAgent: string;
  startTime: Date;
  endTime?: Date;
  result?: string;
}

export default function AgentPage() {
  const [messages, setMessages] = useState<AgentMessage[]>([
    {
      id: '1',
      type: 'system',
      content: 'AI Agent Orchestrator initialized. Ready to assist with complex multi-step tasks.',
      timestamp: new Date(Date.now() - 60000)
    }
  ]);
  const [currentMessage, setCurrentMessage] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [selectedAgents, setSelectedAgents] = useState<string[]>(['researcher', 'coder', 'analyst']);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [showAgentPanel, setShowAgentPanel] = useState(true);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const agents: Agent[] = [
    {
      id: 'researcher',
      name: 'Research Agent',
      description: 'Searches academic papers, web sources, and knowledge bases',
      status: 'idle',
      capabilities: ['web-search', 'academic-search', 'fact-checking'],
      icon: '🔍',
      successRate: 0.94
    },
    {
      id: 'coder',
      name: 'Code Agent',
      description: 'Generates, analyzes, and debugs code in multiple languages',
      status: 'idle',
      capabilities: ['code-generation', 'debugging', 'code-review'],
      icon: '💻',
      successRate: 0.89
    },
    {
      id: 'analyst',
      name: 'Data Analyst',
      description: 'Processes data, creates visualizations, and generates insights',
      status: 'idle',
      capabilities: ['data-analysis', 'visualization', 'statistics'],
      icon: '📊',
      successRate: 0.92
    },
    {
      id: 'writer',
      name: 'Content Writer',
      description: 'Creates documents, reports, and written content',
      status: 'idle',
      capabilities: ['document-generation', 'summarization', 'editing'],
      icon: '✍️',
      successRate: 0.96
    },
    {
      id: 'designer',
      name: 'Visual Designer',
      description: 'Generates images, designs, and visual content',
      status: 'idle',
      capabilities: ['image-generation', 'design', 'visual-analysis'],
      icon: '🎨',
      successRate: 0.87
    }
  ];

  const quickPrompts = [
    'Research the latest developments in AI and create a comprehensive report',
    'Analyze this dataset and create visualizations with insights',
    'Build a full-stack web application with authentication',
    'Generate marketing content for a new product launch',
    'Create technical documentation for an API'
  ];

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSendMessage = async () => {
    if (!currentMessage.trim() || isProcessing) return;

    const userMessage: AgentMessage = {
      id: Math.random().toString(36).substring(7),
      type: 'user',
      content: currentMessage,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setCurrentMessage('');
    setIsProcessing(true);

    // Create a new task
    const newTask: Task = {
      id: Math.random().toString(36).substring(7),
      description: currentMessage,
      status: 'running',
      assignedAgent: selectedAgents[0] || 'researcher',
      startTime: new Date()
    };

    setTasks(prev => [newTask, ...prev]);

    try {
      // Simulate agent processing
      await new Promise(resolve => setTimeout(resolve, 2000));

      const agentResponse: AgentMessage = {
        id: Math.random().toString(36).substring(7),
        type: 'agent',
        content: `I've analyzed your request and coordinated with the selected agents. Here's what I found:\n\n${getSimulatedResponse(currentMessage)}`,
        timestamp: new Date(),
        toolsUsed: selectedAgents,
        processingTime: 2.1,
        confidence: 0.91
      };

      setMessages(prev => [...prev, agentResponse]);
      
      // Update task
      setTasks(prev => prev.map(task => 
        task.id === newTask.id 
          ? { ...task, status: 'completed', endTime: new Date(), result: 'Task completed successfully' }
          : task
      ));
    } catch (error) {
      const errorMessage: AgentMessage = {
        id: Math.random().toString(36).substring(7),
        type: 'system',
        content: 'An error occurred while processing your request. Please try again.',
        timestamp: new Date()
      };

      setMessages(prev => [...prev, errorMessage]);
      
      setTasks(prev => prev.map(task => 
        task.id === newTask.id 
          ? { ...task, status: 'failed', endTime: new Date() }
          : task
      ));
    }

    setIsProcessing(false);
  };

  const getSimulatedResponse = (prompt: string) => {
    if (prompt.toLowerCase().includes('research')) {
      return 'I\'ve conducted comprehensive research using multiple sources:\n\n• Found 15 relevant academic papers\n• Analyzed current market trends\n• Compiled key insights and recommendations\n\nThe research indicates significant growth in the field with emerging opportunities in automation and AI integration.';
    }
    if (prompt.toLowerCase().includes('code') || prompt.toLowerCase().includes('app')) {
      return 'I\'ve generated a complete solution:\n\n• Created project structure with best practices\n• Implemented authentication and security features\n• Added comprehensive error handling\n• Included unit tests and documentation\n\nThe application is ready for deployment with scalable architecture.';
    }
    return 'I\'ve processed your request using advanced AI capabilities and coordinated with specialized agents to provide you with accurate, comprehensive results tailored to your specific needs.';
  };

  const toggleAgent = (agentId: string) => {
    setSelectedAgents(prev => 
      prev.includes(agentId) 
        ? prev.filter(id => id !== agentId)
        : [...prev, agentId]
    );
  };

  const toggleVoiceInput = () => {
    setIsListening(!isListening);
    // Voice input implementation would go here
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'text-green-400 bg-green-500/20';
      case 'running': return 'text-yellow-400 bg-yellow-500/20';
      case 'failed': return 'text-red-400 bg-red-500/20';
      case 'pending': return 'text-blue-400 bg-blue-500/20';
      default: return 'text-gray-400 bg-gray-500/20';
    }
  };

  const getAgentStatusColor = (status: Agent['status']) => {
    switch (status) {
      case 'active': return 'text-green-400';
      case 'thinking': return 'text-yellow-400';
      case 'error': return 'text-red-400';
      default: return 'text-gray-400';
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
                <Bot className="w-10 h-10 mr-4 text-purple-400" />
                AI Agent Orchestrator
              </h1>
              <p className="text-gray-400 text-lg">
                Coordinate multiple AI agents for complex multi-step tasks
              </p>
            </div>
            <div className="flex items-center space-x-4">
              <button
                onClick={() => setShowAgentPanel(!showAgentPanel)}
                className="px-4 py-2 glass rounded-lg hover:bg-white/10 transition-all"
              >
                <div className="flex items-center space-x-2">
                  <Users className="w-4 h-4 text-purple-400" />
                  <span className="text-white text-sm">
                    {showAgentPanel ? 'Hide' : 'Show'} Agents
                  </span>
                </div>
              </button>
            </div>
          </div>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Chat Interface */}
          <div className="lg:col-span-3 space-y-6">
            {/* Messages */}
            <div className="glass rounded-xl p-6 h-[600px] flex flex-col">
              <div className="flex-1 overflow-y-auto space-y-4 mb-4">
                {messages.map((message) => (
                  <motion.div
                    key={message.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
                  >
                    <div className={`max-w-[80%] ${
                      message.type === 'user' 
                        ? 'bg-purple-600 text-white' 
                        : message.type === 'system'
                        ? 'bg-gray-700 text-gray-300'
                        : 'bg-black/50 text-white border border-gray-600'
                    } rounded-xl p-4`}>
                      {message.type !== 'user' && (
                        <div className="flex items-center space-x-2 mb-2">
                          <div className={`w-2 h-2 rounded-full ${
                            message.type === 'agent' ? 'bg-purple-400' : 'bg-gray-400'
                          }`} />
                          <span className="text-xs font-medium">
                            {message.type === 'agent' ? 'AI Agent' : 'System'}
                          </span>
                          {message.timestamp && (
                            <span className="text-xs text-gray-400">
                              {message.timestamp.toLocaleTimeString()}
                            </span>
                          )}
                        </div>
                      )}
                      
                      <p className="whitespace-pre-line">{message.content}</p>
                      
                      {message.toolsUsed && (
                        <div className="mt-3 pt-3 border-t border-gray-600">
                          <div className="flex items-center space-x-2 text-xs">
                            <Zap className="w-3 h-3 text-purple-400" />
                            <span className="text-gray-400">Tools used:</span>
                            {message.toolsUsed.map((tool, index) => (
                              <span key={index} className="px-2 py-1 bg-purple-500/20 text-purple-400 rounded">
                                {tool}
                              </span>
                            ))}
                          </div>
                          {message.processingTime && (
                            <div className="flex items-center space-x-2 text-xs mt-2">
                              <Clock className="w-3 h-3 text-gray-400" />
                              <span className="text-gray-400">
                                Processed in {message.processingTime}s
                              </span>
                              {message.confidence && (
                                <>
                                  <span className="text-gray-400">•</span>
                                  <span className="text-green-400">
                                    {Math.round(message.confidence * 100)}% confidence
                                  </span>
                                </>
                              )}
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  </motion.div>
                ))}
                
                {isProcessing && (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex justify-start"
                  >
                    <div className="bg-black/50 border border-gray-600 rounded-xl p-4">
                      <div className="flex items-center space-x-3">
                        <Loader2 className="w-5 h-5 text-purple-400 animate-spin" />
                        <span className="text-white">AI agents are thinking...</span>
                      </div>
                    </div>
                  </motion.div>
                )}
                
                <div ref={messagesEndRef} />
              </div>

              {/* Quick Prompts */}
              <div className="mb-4">
                <div className="flex flex-wrap gap-2">
                  {quickPrompts.slice(0, 3).map((prompt, index) => (
                    <button
                      key={index}
                      onClick={() => setCurrentMessage(prompt)}
                      className="px-3 py-1 glass rounded-full text-xs text-gray-400 hover:text-white hover:bg-white/10 transition-all"
                    >
                      {prompt.length > 50 ? `${prompt.substring(0, 47)}...` : prompt}
                    </button>
                  ))}
                </div>
              </div>

              {/* Input */}
              <div className="flex items-center space-x-3">
                <div className="flex-1 relative">
                  <input
                    type="text"
                    value={currentMessage}
                    onChange={(e) => setCurrentMessage(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                    placeholder="Describe a complex task for the AI agents to handle..."
                    className="w-full py-3 px-4 bg-black/50 border border-gray-600 rounded-xl text-white placeholder-gray-400 focus:border-purple-500 focus:outline-none"
                  />
                  <button
                    onClick={toggleVoiceInput}
                    className={`absolute right-3 top-1/2 transform -translate-y-1/2 p-1 rounded-lg transition-all ${
                      isListening 
                        ? 'text-red-400 bg-red-500/20' 
                        : 'text-gray-400 hover:text-white hover:bg-white/10'
                    }`}
                  >
                    {isListening ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
                  </button>
                </div>
                
                <motion.button
                  onClick={handleSendMessage}
                  disabled={!currentMessage.trim() || isProcessing}
                  className="px-6 py-3 bg-gradient-to-r from-purple-600 to-blue-600 rounded-xl font-semibold text-white disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Send className="w-4 h-4" />
                  <span>Send</span>
                </motion.button>
              </div>
            </div>

            {/* Recent Tasks */}
            <div className="glass rounded-xl p-6">
              <h3 className="text-xl font-bold text-white mb-4 flex items-center">
                <Activity className="w-5 h-5 mr-2 text-purple-400" />
                Recent Tasks
              </h3>
              
              <div className="space-y-3">
                {tasks.slice(0, 5).map((task) => (
                  <motion.div
                    key={task.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="flex items-center justify-between p-3 bg-black/30 rounded-lg"
                  >
                    <div className="flex-1">
                      <p className="text-white font-medium text-sm mb-1">
                        {task.description.length > 60 
                          ? `${task.description.substring(0, 57)}...`
                          : task.description
                        }
                      </p>
                      <div className="flex items-center space-x-3 text-xs text-gray-400">
                        <span>Agent: {task.assignedAgent}</span>
                        <span>Started: {task.startTime.toLocaleTimeString()}</span>
                        {task.endTime && (
                          <span>
                            Duration: {Math.round((task.endTime.getTime() - task.startTime.getTime()) / 1000)}s
                          </span>
                        )}
                      </div>
                    </div>
                    
                    <span className={`px-2 py-1 rounded text-xs ${getStatusColor(task.status)}`}>
                      {task.status}
                    </span>
                  </motion.div>
                ))}
              </div>
            </div>
          </div>

          {/* Agent Panel */}
          <AnimatePresence>
            {showAgentPanel && (
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                className="space-y-6"
              >
                {/* Active Agents */}
                <div className="glass rounded-xl p-6">
                  <h3 className="text-xl font-bold text-white mb-4 flex items-center">
                    <Brain className="w-5 h-5 mr-2 text-purple-400" />
                    AI Agents
                  </h3>
                  
                  <div className="space-y-3">
                    {agents.map((agent) => (
                      <motion.div
                        key={agent.id}
                        className={`p-4 rounded-lg cursor-pointer transition-all ${
                          selectedAgents.includes(agent.id)
                            ? 'bg-purple-600/20 border border-purple-500/30'
                            : 'bg-black/30 hover:bg-white/5'
                        }`}
                        onClick={() => toggleAgent(agent.id)}
                        whileHover={{ scale: 1.02 }}
                      >
                        <div className="flex items-start justify-between mb-2">
                          <div className="flex items-center space-x-3">
                            <span className="text-2xl">{agent.icon}</span>
                            <div>
                              <h4 className="font-medium text-white text-sm">{agent.name}</h4>
                              <p className="text-gray-400 text-xs">{agent.description}</p>
                            </div>
                          </div>
                          <div className={`w-2 h-2 rounded-full ${getAgentStatusColor(agent.status)}`} />
                        </div>
                        
                        <div className="flex items-center justify-between">
                          <div className="flex flex-wrap gap-1">
                            {agent.capabilities.slice(0, 2).map((cap) => (
                              <span key={cap} className="px-2 py-1 bg-gray-600/50 text-gray-300 rounded text-xs">
                                {cap}
                              </span>
                            ))}
                          </div>
                          <span className="text-green-400 text-xs">
                            {Math.round(agent.successRate * 100)}%
                          </span>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </div>

                {/* System Stats */}
                <div className="glass rounded-xl p-6">
                  <h3 className="font-semibold text-white mb-4 flex items-center">
                    <TrendingUp className="w-4 h-4 mr-2 text-purple-400" />
                    System Stats
                  </h3>
                  
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-gray-400">Active Agents</span>
                      <span className="text-white font-medium">{selectedAgents.length}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-gray-400">Tasks Completed</span>
                      <span className="text-green-400 font-medium">
                        {tasks.filter(t => t.status === 'completed').length}
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-gray-400">Success Rate</span>
                      <span className="text-purple-400 font-medium">94%</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-gray-400">Avg Response Time</span>
                      <span className="text-blue-400 font-medium">2.3s</span>
                    </div>
                  </div>
                </div>

                {/* Quick Actions */}
                <div className="glass rounded-xl p-6">
                  <h3 className="font-semibold text-white mb-4">Quick Actions</h3>
                  <div className="space-y-2">
                    <button className="w-full p-3 glass rounded-lg hover:bg-white/10 transition-all text-left">
                      <div className="flex items-center space-x-3">
                        <Settings className="w-4 h-4 text-purple-400" />
                        <span className="text-white text-sm">Configure Agents</span>
                      </div>
                    </button>
                    <button className="w-full p-3 glass rounded-lg hover:bg-white/10 transition-all text-left">
                      <div className="flex items-center space-x-3">
                        <RotateCcw className="w-4 h-4 text-purple-400" />
                        <span className="text-white text-sm">Reset Session</span>
                      </div>
                    </button>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
