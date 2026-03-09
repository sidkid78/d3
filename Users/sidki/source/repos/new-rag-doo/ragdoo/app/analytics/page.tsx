// app/analytics/page.tsx - Spectacular Analytics Dashboard
'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  BarChart3, 
  TrendingUp, 
  Users, 
  FileText, 
  Zap,
  Activity,
  Target,
  ArrowUp,
  ArrowDown,
  Download,
  RefreshCw,
  Eye,
  MessageSquare,
  Star
} from 'lucide-react';

export default function AnalyticsPage() {
  const [timeRange, setTimeRange] = useState('7d');
  const [activeMetric, setActiveMetric] = useState('queries');
  const [isLoading, setIsLoading] = useState(false);

  // Mock data - replace with real analytics data
  const metrics = {
    totalQueries: { value: '124.5K', change: 12.5, trend: 'up' },
    avgResponseTime: { value: '0.8s', change: -15.2, trend: 'down' },
    documentsProcessed: { value: '2.1K', change: 8.3, trend: 'up' },
    accuracy: { value: '97.8%', change: 2.1, trend: 'up' },
    activeUsers: { value: '3.2K', change: 18.7, trend: 'up' },
    satisfaction: { value: '4.8/5', change: 0.3, trend: 'up' }
  };

  const chartData = {
    queries: [
      { time: '00:00', value: 120 },
      { time: '04:00', value: 80 },
      { time: '08:00', value: 200 },
      { time: '12:00', value: 350 },
      { time: '16:00', value: 420 },
      { time: '20:00', value: 300 },
      { time: '23:59', value: 180 }
    ],
    accuracy: [
      { time: '00:00', value: 96.5 },
      { time: '04:00', value: 97.1 },
      { time: '08:00', value: 97.8 },
      { time: '12:00', value: 98.2 },
      { time: '16:00', value: 97.9 },
      { time: '20:00', value: 98.1 },
      { time: '23:59', value: 97.8 }
    ]
  };

  const topQueries = [
    { query: "What are the key features of AI models?", count: 45, trend: 'up' },
    { query: "How does machine learning work?", count: 38, trend: 'up' },
    { query: "Explain neural networks", count: 32, trend: 'stable' },
    { query: "Benefits of cloud computing", count: 28, trend: 'down' },
    { query: "Data science best practices", count: 24, trend: 'up' }
  ];

  const recentActivity = [
    { type: 'query', content: 'New query processed successfully', time: '2 min ago', status: 'success' },
    { type: 'document', content: 'Document uploaded and indexed', time: '5 min ago', status: 'success' },
    { type: 'user', content: 'New user registered', time: '12 min ago', status: 'info' },
    { type: 'error', content: 'Rate limit exceeded for user', time: '18 min ago', status: 'warning' },
    { type: 'query', content: 'Complex query completed', time: '25 min ago', status: 'success' }
  ];

  const StatCard = ({ 
    title, 
    value, 
    change, 
    trend, 
    icon: Icon, 
    gradient 
  }: {
    title: string;
    value: string;
    change: number;
    trend: 'up' | 'down';
    icon: React.ElementType;
    gradient: string;
  }) => (
    <motion.div
      className="glass rounded-2xl p-6 hover:bg-white/5 transition-all cursor-pointer"
      whileHover={{ scale: 1.02, y: -5 }}
      whileTap={{ scale: 0.98 }}
    >
      <div className="flex items-center justify-between mb-4">
        <div className={`p-3 rounded-xl ${gradient}`}>
          <Icon className="w-6 h-6 text-white" />
        </div>
        <div className={`flex items-center text-sm font-medium ${
          trend === 'up' ? 'text-green-400' : 'text-red-400'
        }`}>
          {trend === 'up' ? <ArrowUp className="w-4 h-4 mr-1" /> : <ArrowDown className="w-4 h-4 mr-1" />}
          {Math.abs(change)}%
        </div>
      </div>
      <div className="text-3xl font-bold text-white mb-1">{value}</div>
      <div className="text-gray-400 text-sm">{title}</div>
    </motion.div>
  );

    const MiniChart = ({ data, color = '#8b5cf6' }: { data: { value: number }[]; color?: string }) => (
    <div className="h-20 flex items-end justify-between">
      {data.map((point, index) => (
        <motion.div
          key={index}
          className="w-2 bg-gradient-to-t from-purple-600 to-purple-400 rounded-t"
          style={{ height: `${(point.value / Math.max(...data.map(d => d.value))) * 100}%` }}
          initial={{ height: 0 }}
          animate={{ height: `${(point.value / Math.max(...data.map(d => d.value))) * 100}%` }}
          transition={{ duration: 0.5, delay: index * 0.1 }}
        />
      ))}
    </div>
  );

  const refreshData = () => {
    setIsLoading(true);
    setTimeout(() => setIsLoading(false), 1500);
  };

  return (
    <div className="min-h-screen bg-black pt-20">
      {/* Header */}
      <div className="relative py-16 overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-gradient-to-r from-purple-900/20 via-black to-blue-900/20" />
          {[...Array(20)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-1 h-1 bg-purple-400/30 rounded-full"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
              }}
              animate={{
                opacity: [0.3, 1, 0.3],
                scale: [1, 2, 1],
              }}
              transition={{
                duration: 3 + Math.random() * 2,
                repeat: Infinity,
                delay: Math.random() * 2,
              }}
            />
          ))}
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-8"
          >
            <div>
              <div className="inline-flex items-center px-6 py-3 rounded-full glass mb-6">
                <BarChart3 className="w-5 h-5 text-purple-400 mr-2" />
                <span className="text-sm font-medium text-purple-400">
                  Real-time Analytics
                </span>
              </div>

              <h1 className="text-5xl md:text-7xl font-black mb-4">
                <span className="bg-gradient-to-r from-white via-purple-200 to-blue-200 bg-clip-text text-transparent">
                  Analytics
                </span>
              </h1>
              <p className="text-xl text-gray-300 max-w-2xl">
                Monitor your RAG system performance with real-time insights and comprehensive metrics
              </p>
            </div>

            <div className="flex items-center gap-4">
              <div className="flex glass rounded-xl p-1">
                {['24h', '7d', '30d', '90d'].map((range) => (
                  <motion.button
                    key={range}
                    onClick={() => setTimeRange(range)}
                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                      timeRange === range
                        ? 'bg-purple-600 text-white'
                        : 'text-gray-400 hover:text-white'
                    }`}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    title="Time Range"
                  >
                    {range}
                  </motion.button>
                ))}
              </div>

              <motion.button
                onClick={refreshData}
                className="p-3 glass rounded-xl hover:bg-white/10 transition-all"
                whileHover={{ scale: 1.1, rotate: 180 }}
                whileTap={{ scale: 0.9 }}
                disabled={isLoading}
              >
                <RefreshCw className={`w-5 h-5 text-gray-400 ${isLoading ? 'animate-spin' : ''}`} />
              </motion.button>

              <motion.button
                className="px-6 py-3 bg-gradient-to-r from-purple-600 to-blue-600 rounded-xl font-semibold hover:shadow-lg transition-all"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Download className="w-5 h-5 mr-2 inline" />
                Export
              </motion.button>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Main Dashboard */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-24">
        {/* Key Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-6 mb-12">
          <StatCard
            title="Total Queries"
            value={metrics.totalQueries.value}
            change={metrics.totalQueries.change}
            trend={metrics.totalQueries.trend as 'up' | 'down'}
            icon={MessageSquare}
            gradient="bg-gradient-to-r from-purple-600 to-purple-500"
          />
          <StatCard
            title="Avg Response Time"
            value={metrics.avgResponseTime.value}
            change={metrics.avgResponseTime.change}
            trend={metrics.avgResponseTime.trend as 'up' | 'down'}
            icon={Zap}
            gradient="bg-gradient-to-r from-blue-600 to-blue-500"
          />
          <StatCard
            title="Documents Processed"
            value={metrics.documentsProcessed.value}
            change={metrics.documentsProcessed.change}
            trend={metrics.documentsProcessed.trend as 'up' | 'down'}
            icon={FileText}
            gradient="bg-gradient-to-r from-cyan-600 to-cyan-500"
          />
          <StatCard
            title="Accuracy Rate"
            value={metrics.accuracy.value}
            change={metrics.accuracy.change}
            trend={metrics.accuracy.trend as 'up' | 'down'}
            icon={Target}
            gradient="bg-gradient-to-r from-green-600 to-green-500"
          />
          <StatCard
            title="Active Users"
            value={metrics.activeUsers.value}
            change={metrics.activeUsers.change}
            trend={metrics.activeUsers.trend as 'up' | 'down'}
            icon={Users}
            gradient="bg-gradient-to-r from-orange-600 to-orange-500"
          />
          <StatCard
            title="User Satisfaction"
            value={metrics.satisfaction.value}
            change={metrics.satisfaction.change}
            trend={metrics.satisfaction.trend as 'up' | 'down'}
            icon={Star}
            gradient="bg-gradient-to-r from-pink-600 to-pink-500"
          />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Chart */}
          <div className="lg:col-span-2">
            <motion.div
              className="glass rounded-2xl p-8"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
            >
              <div className="flex items-center justify-between mb-8">
                <h3 className="text-2xl font-bold text-white">Query Performance</h3>
                <div className="flex gap-2">
                  {['queries', 'accuracy'].map((metric) => (
                    <motion.button
                      key={metric}
                      onClick={() => setActiveMetric(metric)}
                      className={`px-4 py-2 rounded-lg text-sm font-medium transition-all capitalize ${
                        activeMetric === metric
                          ? 'bg-purple-600 text-white'
                          : 'text-gray-400 hover:text-white hover:bg-white/10'
                      }`}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      {metric}
                    </motion.button>
                  ))}
                </div>
              </div>

              <div className="h-80 relative">
                <div className="absolute inset-0 flex items-end justify-between px-4">
                  {chartData[activeMetric as keyof typeof chartData].map((point, index) => (
                    <motion.div
                      key={index}
                      className="w-8 bg-gradient-to-t from-purple-600 to-purple-400 rounded-t relative group cursor-pointer"
                      style={{ 
                        height: `${(point.value / Math.max(...chartData[activeMetric as keyof typeof chartData].map(d => d.value))) * 100}%`
                      }}
                      initial={{ height: 0 }}
                      animate={{ 
                        height: `${(point.value / Math.max(...chartData[activeMetric as keyof typeof chartData].map(d => d.value))) * 100}%`
                      }}
                      transition={{ duration: 0.5, delay: index * 0.1 }}
                      whileHover={{ scale: 1.1, y: -5 }}
                    >
                      <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-3 py-1 bg-gray-900 rounded-lg text-white text-sm opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-10">
                        {point.time}: {point.value}{activeMetric === 'accuracy' ? '%' : ''}
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>

              <div className="flex items-center justify-between mt-6 pt-6 border-t border-gray-800">
                <div className="flex items-center gap-6">
                  <div className="flex items-center">
                    <div className="w-3 h-3 bg-purple-500 rounded-full mr-2" />
                    <span className="text-gray-400 text-sm">Current Period</span>
                  </div>
                  <div className="flex items-center">
                    <div className="w-3 h-3 bg-blue-500 rounded-full mr-2" />
                    <span className="text-gray-400 text-sm">Previous Period</span>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-2xl font-bold text-white">+15.3%</div>
                  <div className="text-green-400 text-sm">vs last period</div>
                </div>
              </div>
            </motion.div>
          </div>

          {/* Side Panels */}
          <div className="space-y-8">
            {/* Top Queries */}
            <motion.div
              className="glass rounded-2xl p-6"
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
            >
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-bold text-white">Top Queries</h3>
                <Eye className="w-5 h-5 text-gray-400" />
              </div>

              <div className="space-y-4">
                {topQueries.map((query, index) => (
                  <motion.div
                    key={index}
                    className="flex items-center justify-between p-3 hover:bg-white/5 rounded-lg transition-all cursor-pointer"
                    whileHover={{ x: 4 }}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.6 + index * 0.1 }}
                  >
                    <div className="flex-1 min-w-0">
                      <div className="text-white text-sm font-medium truncate">
                        {query.query}
                      </div>
                      <div className="text-gray-400 text-xs">
                        {query.count} queries
                      </div>
                    </div>
                    <div className={`ml-3 ${
                      query.trend === 'up' ? 'text-green-400' : 
                      query.trend === 'down' ? 'text-red-400' : 'text-gray-400'
                    }`}>
                      {query.trend === 'up' ? <TrendingUp className="w-4 h-4" /> :
                       query.trend === 'down' ? <ArrowDown className="w-4 h-4" /> : 
                       <div className="w-4 h-4" />}
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>

            {/* Recent Activity */}
            <motion.div
              className="glass rounded-2xl p-6"
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.6 }}
            >
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-bold text-white">Recent Activity</h3>
                <Activity className="w-5 h-5 text-gray-400" />
              </div>

              <div className="space-y-4">
                {recentActivity.map((activity, index) => (
                  <motion.div
                    key={index}
                    className="flex items-start gap-3 p-3 hover:bg-white/5 rounded-lg transition-all"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.8 + index * 0.1 }}
                  >
                    <div className={`w-2 h-2 rounded-full mt-2 ${
                      activity.status === 'success' ? 'bg-green-400' :
                      activity.status === 'warning' ? 'bg-yellow-400' :
                      activity.status === 'error' ? 'bg-red-400' :
                      'bg-blue-400'
                    }`} />
                    <div className="flex-1 min-w-0">
                      <div className="text-white text-sm">{activity.content}</div>
                      <div className="text-gray-400 text-xs">{activity.time}</div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
}
