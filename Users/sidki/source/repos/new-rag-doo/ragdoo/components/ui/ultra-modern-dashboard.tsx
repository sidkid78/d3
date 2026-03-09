// components/ui/ultra-modern-dashboard.tsx - The Most Stunning Dashboard Ever Created

'use client';

import { useState, useEffect, useRef } from 'react';
import { motion, useAnimation, useInView } from 'framer-motion';
import { 
  Search, Code, Database, FileText, Image, Activity, 
  Zap, Brain, Sparkles, Rocket, Star, Cpu, Globe,
  ChevronRight, Play, Pause, Volume2, Settings,
  ArrowUp, TrendingUp, BarChart3, PieChart
} from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

interface Tool {
  id: string;
  name: string;
  description: string;
  href: string;
  icon: any;
  gradient: string;
  stats: { value: string; label: string; trend?: number };
  isNew?: boolean;
  isHot?: boolean;
}

const tools: Tool[] = [
  {
    id: 'research',
    name: 'Neural Research',
    description: 'AI-powered research across infinite knowledge domains with quantum-speed processing',
    href: '/dashboard/research',
    icon: Brain,
    gradient: 'from-purple-600 via-blue-600 to-cyan-500',
    stats: { value: '2.4M', label: 'Papers Analyzed', trend: 23 },
    isNew: true
  },
  {
    id: 'code',
    name: 'Code Genesis',
    description: 'Generate flawless, production-ready code with AI that thinks like a senior architect',
    href: '/dashboard/code-gen',
    icon: Code,
    gradient: 'from-green-500 via-emerald-500 to-teal-500',
    stats: { value: '847K', label: 'Lines Generated', trend: 45 },
    isHot: true
  },
  {
    id: 'form',
    name: 'Data Alchemist',
    description: 'Transform incomplete datasets into perfect, enriched data with intelligent gap filling',
    href: '/dashboard/form-fill',
    icon: Database,
    gradient: 'from-violet-600 via-purple-600 to-fuchsia-600',
    stats: { value: '99.2%', label: 'Accuracy Rate', trend: 12 }
  },
  {
    id: 'docs',
    name: 'Document Forge',
    description: 'Craft beautiful, interactive documents that adapt and evolve with your content',
    href: '/dashboard/documents',
    icon: FileText,
    gradient: 'from-orange-500 via-red-500 to-pink-500',
    stats: { value: '12.7K', label: 'Docs Created', trend: 34 }
  },
  {
    id: 'images',
    name: 'Visual Dreams',
    description: 'Manifest imagination into stunning visuals with AI that paints like a master',
    href: '/dashboard/images',
    icon: Sparkles,
    gradient: 'from-pink-500 via-rose-500 to-red-500',
    stats: { value: '89.3K', label: 'Images Crafted', trend: 67 }
  },
  {
    id: 'agent',
    name: 'Omni Agent',
    description: 'The ultimate AI orchestrator that combines all tools in perfect symphony',
    href: '/dashboard/agent',
    icon: Cpu,
    gradient: 'from-indigo-600 via-purple-600 to-pink-600',
    stats: { value: '∞', label: 'Possibilities', trend: 100 },
    isNew: true,
    isHot: true
  }
];

export function UltraModernDashboard() {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [currentTime, setCurrentTime] = useState(new Date());
  const [selectedTool, setSelectedTool] = useState<Tool | null>(null);
  const [particles, setParticles] = useState<any[]>([]);
  const containerRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

  // Mouse tracking for interactive effects
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  // Time updates
  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  // Particle system
  useEffect(() => {
    const generateParticles = () => {
      const newParticles = Array.from({ length: 20 }, (_, i) => ({
        id: i,
        x: Math.random() * window.innerWidth,
        y: Math.random() * window.innerHeight,
        size: Math.random() * 4 + 1,
        speed: Math.random() * 2 + 0.5,
        opacity: Math.random() * 0.5 + 0.1
      }));
      setParticles(newParticles);
    };

    generateParticles();
    const interval = setInterval(() => {
      setParticles(prev => 
        prev.map(particle => ({
          ...particle,
          y: particle.y - particle.speed,
          x: particle.x + Math.sin(Date.now() * 0.001 + particle.id) * 0.5
        })).filter(p => p.y > -10)
      );
    }, 50);

    return () => clearInterval(interval);
  }, []);

  const toolVariants = {
    hidden: { opacity: 0, y: 50, scale: 0.8 },
    visible: (i: number) => ({
      opacity: 1,
      y: 0,
      scale: 1,
      transition: {
        delay: i * 0.1,
        duration: 0.6,
        bounce: 0.3
      }
    }),
    hover: {
      y: -10,
      scale: 1.05,
      rotateY: 5,
      transition: {
        duration: 0.3,
        bounce: 0.4
      }
    }
  };

  return (
    <div ref={containerRef} className="min-h-screen bg-black text-white overflow-hidden relative">
      {/* Animated Background */}
      <div className="fixed inset-0 z-0">
        <div className="absolute inset-0 bg-gradient-to-br from-purple-900/20 via-blue-900/20 to-teal-900/20" />
        <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-10" />
        
        {/* Floating Particles */}
        {particles.map(particle => (
          <motion.div
            key={particle.id}
            className="absolute rounded-full bg-cyan-400"
            style={{
              left: particle.x,
              top: particle.y,
              width: particle.size,
              height: particle.size,
              opacity: particle.opacity
            }}
            animate={{
              y: particle.y,
              x: particle.x
            }}
          />
        ))}

        {/* Interactive Light Following Mouse */}
        <motion.div
          className="absolute w-96 h-96 rounded-full opacity-20"
          style={{
            background: 'radial-gradient(circle, rgba(59,130,246,0.3) 0%, transparent 70%)',
            left: mousePosition.x - 192,
            top: mousePosition.y - 192,
          }}
          animate={{
            x: mousePosition.x - 192,
            y: mousePosition.y - 192
          }}
          transition={{ type: "spring", damping: 30, stiffness: 100 }}
        />
      </div>

      {/* Header */}
      <motion.header 
        className="relative z-10 p-8"
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
      >
        <div className="flex justify-between items-start">
          <div className="space-y-2">
            <motion.h1 
              className="text-6xl md:text-8xl font-black tracking-tight"
              animate={{ 
                backgroundPosition: ['0% 50%', '100% 50%', '0% 50%']
              }}
              transition={{ 
                duration: 8, 
                repeat: Infinity, 
                ease: "linear" 
              }}
              style={{
                background: 'linear-gradient(90deg, #fff, #64b5f6, #e1bee7, #fff)',
                backgroundSize: '200% 200%',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text'
              }}
            >
              RAGDOO
            </motion.h1>
            <motion.p 
              className="text-2xl text-gray-300 font-light"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5, duration: 0.8 }}
            >
              The Future of AI-Powered Research & Development
            </motion.p>
          </div>

          <div className="flex items-center space-x-6">
            <motion.div 
              className="glass rounded-2xl px-6 py-3 font-mono text-cyan-400"
              whileHover={{ scale: 1.05 }}
            >
              {currentTime.toLocaleTimeString()}
            </motion.div>
            
            <Link href="/settings">
              <motion.div 
                className="glass rounded-2xl p-3 cursor-pointer group"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
              >
                <Settings className="w-6 h-6 group-hover:rotate-90 transition-transform duration-300" />
              </motion.div>
            </Link>
          </div>
        </div>

        {/* Stats Bar */}
        <motion.div 
          className="mt-8 flex justify-center space-x-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1, duration: 0.6 }}
        >
          {[
            { icon: Activity, value: '2.8M', label: 'Queries Processed', color: 'text-green-400' },
            { icon: Zap, value: '847ms', label: 'Avg Response', color: 'text-yellow-400' },
            { icon: Globe, value: '24/7', label: 'Uptime', color: 'text-blue-400' },
            { icon: Star, value: '99.9%', label: 'Satisfaction', color: 'text-purple-400' }
          ].map((stat, i) => (
            <motion.div
              key={i}
              className="glass rounded-xl p-4 text-center group cursor-pointer"
              whileHover={{ y: -5, scale: 1.05 }}
              transition={{ bounce: 0.3 }}
            >
              <stat.icon className={`w-6 h-6 ${stat.color} mx-auto mb-2 group-hover:scale-110 transition-transform`} />
              <div className={`text-xl font-bold ${stat.color}`}>{stat.value}</div>
              <div className="text-xs text-gray-400">{stat.label}</div>
            </motion.div>
          ))}
        </motion.div>
      </motion.header>

      {/* Main Content */}
      <main className="relative z-10 px-8 pb-8">
        {/* Tool Grid */}
        <motion.div 
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
          initial="hidden"
          animate="visible"
        >
          {tools.map((tool, i) => (
            <motion.div
              key={tool.id}
              custom={i}
              variants={toolVariants}
              whileHover="hover"
              onHoverStart={() => setSelectedTool(tool)}
              onHoverEnd={() => setSelectedTool(null)}
              className="relative group cursor-pointer"
              onClick={() => router.push(tool.href)}
            >
              {/* Tool Card */}
              <div className="glass rounded-3xl p-8 h-full relative overflow-hidden">
                {/* Background Gradient */}
                <div className={`absolute inset-0 bg-gradient-to-br ${tool.gradient} opacity-10 group-hover:opacity-20 transition-opacity duration-500`} />
                
                {/* Badges */}
                <div className="absolute top-4 right-4 flex space-x-2">
                  {tool.isNew && (
                    <motion.div 
                      className="bg-green-500 text-black px-2 py-1 rounded-full text-xs font-bold"
                      animate={{ scale: [1, 1.1, 1] }}
                      transition={{ duration: 2, repeat: Infinity }}
                    >
                      NEW
                    </motion.div>
                  )}
                  {tool.isHot && (
                    <motion.div 
                      className="bg-red-500 text-white px-2 py-1 rounded-full text-xs font-bold"
                      animate={{ rotate: [0, 5, -5, 0] }}
                      transition={{ duration: 2, repeat: Infinity }}
                    >
                      🔥 HOT
                    </motion.div>
                  )}
                </div>

                {/* Icon */}
                <motion.div 
                  className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${tool.gradient} flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300`}
                  whileHover={{ rotate: 360 }}
                  transition={{ duration: 0.6 }}
                >
                  <tool.icon className="w-8 h-8 text-white" />
                </motion.div>

                {/* Content */}
                <div className="space-y-4">
                  <h3 className="text-2xl font-bold group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-white group-hover:to-cyan-400 transition-all duration-300">
                    {tool.name}
                  </h3>
                  
                  <p className="text-gray-400 leading-relaxed group-hover:text-gray-300 transition-colors duration-300">
                    {tool.description}
                  </p>

                  {/* Stats */}
                  <div className="flex justify-between items-end pt-4 border-t border-gray-700">
                    <div>
                      <div className="text-3xl font-bold text-white">{tool.stats.value}</div>
                      <div className="text-sm text-gray-400">{tool.stats.label}</div>
                    </div>
                    
                    {tool.stats.trend && (
                      <div className="flex items-center space-x-1">
                        <TrendingUp className="w-4 h-4 text-green-400" />
                        <span className="text-green-400 font-bold">+{tool.stats.trend}%</span>
                      </div>
                    )}
                  </div>

                  {/* Launch Button */}
                  <motion.div
                    className="flex items-center justify-center space-x-2 mt-6 py-3 px-6 rounded-2xl bg-gradient-to-r from-gray-800 to-gray-900 group-hover:from-purple-600 group-hover:to-blue-600 transition-all duration-500"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <Rocket className="w-5 h-5" />
                    <span className="font-semibold">Launch Tool</span>
                    <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-300" />
                  </motion.div>
                </div>

                {/* Hover Effect Overlay */}
                <div className="absolute inset-0 rounded-3xl bg-gradient-to-br from-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
              </div>

              {/* Glow Effect */}
              <div className={`absolute inset-0 rounded-3xl bg-gradient-to-br ${tool.gradient} opacity-0 group-hover:opacity-20 blur-xl transition-opacity duration-500 -z-10`} />
            </motion.div>
          ))}
        </motion.div>

        {/* Bottom Action Bar */}
        <motion.div 
          className="fixed bottom-8 left-1/2 transform -translate-x-1/2 z-20"
          initial={{ opacity: 0, y: 100 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 2, duration: 0.8 }}
        >
          <div className="glass rounded-full px-8 py-4 flex items-center space-x-6">
            <motion.button
              className="p-3 rounded-full bg-gradient-to-r from-purple-600 to-blue-600 text-white hover:scale-110 transition-transform duration-300"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
            >
              <Play className="w-6 h-6" />
            </motion.button>
            
            <div className="text-sm font-medium text-gray-300">
              Ready to revolutionize your workflow?
            </div>
            
            <motion.button
              className="px-6 py-2 bg-gradient-to-r from-green-500 to-teal-500 rounded-full text-white font-bold hover:scale-105 transition-transform duration-300"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Get Started
            </motion.button>
          </div>
        </motion.div>
      </main>

      {/* Tool Preview Sidebar */}
      {selectedTool && (
        <motion.div
          className="fixed right-8 top-1/2 transform -translate-y-1/2 z-30 w-80"
          initial={{ opacity: 0, x: 100 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: 100 }}
          transition={{ duration: 0.3 }}
        >
          <div className="glass rounded-3xl p-6 space-y-4">
            <div className="flex items-center space-x-3">
              <selectedTool.icon className="w-8 h-8 text-cyan-400" />
              <h4 className="text-xl font-bold">{selectedTool.name}</h4>
            </div>
            <p className="text-gray-300 text-sm">{selectedTool.description}</p>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-gray-400">Status</span>
                <span className="text-green-400 font-bold">Active</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-400">Performance</span>
                <span className="text-cyan-400 font-bold">Optimal</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-400">Usage</span>
                <span className="text-purple-400 font-bold">{selectedTool.stats.value}</span>
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </div>
  );
}
