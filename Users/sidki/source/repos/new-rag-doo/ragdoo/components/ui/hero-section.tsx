// components/ui/hero-section.tsx - Absolutely Mind-Blowing Hero Section
'use client';

import { useState, useEffect } from 'react';
import { motion, useAnimation, useInView } from 'framer-motion';
import { useRef } from 'react';
import { 
  Brain, 
  Zap, 
  Database, 
  Code, 
  FileText, 
  Globe, 
  Cpu, 
  Sparkles,
  ArrowRight,
  Play,
  Download,
  Star,
  Users,
  TrendingUp,
  Shield
} from 'lucide-react';

export function HeroSection() {
  const [isMounted, setIsMounted] = useState(false);
  const [floatingOrbs, setFloatingOrbs] = useState<Array<{
    width: number;
    height: number;
    left: number;
    top: number;
    x: number[];
    y: number[];
    duration: number;
    color: string;
  }>>([]);
  const [networkLines, setNetworkLines] = useState<Array<{
    x1: number;
    y1: number;
    x2: number;
    y2: number;
    delay: number;
  }>>([]);
  const controls = useAnimation();
  const ref = useRef(null);
  const isInView = useInView(ref);

  useEffect(() => {
    setIsMounted(true);
    
    // Generate stable random values for floating orbs
    const colors = [
      'from-purple-500/30 to-blue-500/30',
      'from-blue-500/30 to-cyan-500/30', 
      'from-cyan-500/30 to-purple-500/30',
      'from-pink-500/30 to-purple-500/30',
      'from-purple-500/30 to-pink-500/30'
    ];
    const orbs = [...Array(15)].map((_, i) => ({
      width: Math.random() * 300 + 100,
      height: Math.random() * 300 + 100,
      left: Math.random() * 100,
      top: Math.random() * 100,
      x: [0, Math.random() * 200 - 100],
      y: [0, Math.random() * 200 - 100],
      duration: Math.random() * 10 + 10,
      color: colors[i % colors.length]
    }));
    setFloatingOrbs(orbs);

    // Generate stable random values for network lines
    const lines = [...Array(50)].map(() => ({
      x1: Math.random() * 100,
      y1: Math.random() * 100,
      x2: Math.random() * 100,
      y2: Math.random() * 100,
      delay: Math.random() * 3
    }));
    setNetworkLines(lines);
  }, []);

  useEffect(() => {
    if (isInView) {
      controls.start("visible");
    }
  }, [isInView, controls]);

  const features = [
    { icon: Brain, title: "Neural Processing", description: "Advanced AI algorithms" },
    { icon: Database, title: "Smart Storage", description: "Intelligent data management" },
    { icon: Zap, title: "Lightning Fast", description: "Millisecond response times" },
    { icon: Shield, title: "Enterprise Security", description: "Military-grade encryption" },
    { icon: Code, title: "Developer Friendly", description: "Easy integration with APIs" },
    { icon: Globe, title: "Global Scale", description: "Worldwide deployment ready" },
    { icon: Cpu, title: "High Performance", description: "Optimized processing power" }
  ];

  const stats = [
    { value: "99.9%", label: "Accuracy Rate", icon: TrendingUp },
    { value: "10M+", label: "Documents Processed", icon: FileText },
    { value: "500+", label: "Enterprise Clients", icon: Users },
    { value: "24/7", label: "Uptime", icon: Star }
  ];

  const demoSteps = [
    "Upload your documents",
    "AI processes and indexes",
    "Query with natural language",
    "Get intelligent answers"
  ];

  return (
    <div ref={ref} className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Dynamic Background Animations */}
      {isMounted && (
        <div className="absolute inset-0 z-0">
          {/* Floating Orbs */}
          {floatingOrbs.map((orb, i) => (
            <motion.div
              key={i}
              className={`absolute rounded-full bg-gradient-to-r ${orb.color} blur-xl`}
              style={{
                width: orb.width,
                height: orb.height,
                left: orb.left + '%',
                top: orb.top + '%',
              }}
              animate={{
                x: orb.x,
                y: orb.y,
                scale: [1, 1.2, 1],
                opacity: [0.4, 0.8, 0.4],
              }}
              transition={{
                duration: orb.duration,
                repeat: Infinity,
                repeatType: "reverse",
              }}
            />
          ))}

          {/* Neural Network Animation */}
          <div className="absolute inset-0 opacity-20">
            <svg className="w-full h-full">
              <defs>
                <linearGradient id="networkGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#8b5cf6" />
                  <stop offset="50%" stopColor="#3b82f6" />
                  <stop offset="100%" stopColor="#06b6d4" />
                </linearGradient>
              </defs>
              {networkLines.map((line, i) => (
                <motion.line
                  key={i}
                  x1={line.x1 + '%'}
                  y1={line.y1 + '%'}
                  x2={line.x2 + '%'}
                  y2={line.y2 + '%'}
                  stroke="url(#networkGradient)"
                  strokeWidth="1"
                  initial={{ pathLength: 0, opacity: 0 }}
                  animate={{ pathLength: 1, opacity: 0.5 }}
                  transition={{
                    duration: 2,
                    delay: line.delay,
                    repeat: Infinity,
                    repeatType: "reverse",
                  }}
                />
              ))}
            </svg>
          </div>
        </div>
      )}

      {/* Main Hero Content */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          {/* Main Headline */}
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, ease: "easeOut" }}
            className="mb-8"
          >
            <motion.div
              className="inline-flex items-center px-6 py-3 rounded-full glass mb-8"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Sparkles className="w-5 h-5 text-purple-400 mr-2" />
              <span className="text-sm font-medium bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">
                Powered by Next-Gen AI
              </span>
            </motion.div>

            <h1 className="text-6xl md:text-8xl lg:text-9xl font-black leading-none mb-6">
              <motion.span 
                className="block bg-gradient-to-r from-white via-purple-200 to-blue-200 bg-clip-text text-transparent"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 1.2, delay: 0.2 }}
              >
                RAG
              </motion.span>
              <motion.span 
                className="block bg-gradient-to-r from-purple-400 via-blue-400 to-cyan-400 bg-clip-text text-transparent"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 1.2, delay: 0.4 }}
              >
                DOO
              </motion.span>
            </h1>

            <motion.p
              className="text-xl md:text-2xl text-gray-300 max-w-4xl mx-auto leading-relaxed"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, delay: 0.6 }}
            >
              Revolutionary <span className="text-purple-400 font-semibold">Retrieval-Augmented Generation</span> system
              that transforms how you interact with your documents using cutting-edge AI technology
            </motion.p>
          </motion.div>

          {/* Action Buttons */}
          <motion.div
            className="flex flex-col sm:flex-row gap-6 justify-center mb-16"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.8 }}
          >
            <motion.button
              className="group relative px-8 py-4 bg-gradient-to-r from-purple-600 to-blue-600 rounded-full font-semibold text-lg shadow-2xl shadow-purple-500/25"
              whileHover={{ scale: 1.05, boxShadow: "0 25px 50px -12px rgba(139, 92, 246, 0.5)" }}
              whileTap={{ scale: 0.98 }}
            >
              <span className="relative z-10 flex items-center">
                <Play className="w-5 h-5 mr-2" />
                Start Building
                <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
              </span>
              <div className="absolute inset-0 bg-gradient-to-r from-purple-600 to-blue-600 rounded-full opacity-0 group-hover:opacity-100 blur transition-opacity" />
            </motion.button>

            <motion.button
              className="group px-8 py-4 glass rounded-full font-semibold text-lg hover:bg-white/10 transition-all"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.98 }}
            >
              <span className="flex items-center">
                <Download className="w-5 h-5 mr-2" />
                View Demo
              </span>
            </motion.button>
          </motion.div>

          {/* Stats Section */}
          <motion.div
            className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-16"
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 1 }}
          >
            {stats.map((stat, index) => (
              <motion.div
                key={index}
                className="text-center glass rounded-2xl p-6 hover:bg-white/10 transition-all"
                whileHover={{ scale: 1.05, y: -5 }}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 1.2 + index * 0.1 }}
              >
                <stat.icon className="w-8 h-8 mx-auto mb-3 text-purple-400" />
                <div className="text-3xl font-bold text-white mb-1">{stat.value}</div>
                <div className="text-gray-400 text-sm">{stat.label}</div>
              </motion.div>
            ))}
          </motion.div>

          {/* Features Preview */}
          <motion.div
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto"
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 1.4 }}
          >
            {features.map((feature, index) => (
              <motion.div
                key={index}
                className="group p-6 glass rounded-2xl hover:bg-white/10 transition-all cursor-pointer"
                whileHover={{ scale: 1.05, y: -10 }}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 1.6 + index * 0.1 }}
              >
                <motion.div
                  className="w-12 h-12 mx-auto mb-4 bg-gradient-to-r from-purple-500/20 to-blue-500/20 rounded-xl flex items-center justify-center group-hover:bg-gradient-to-r group-hover:from-purple-500/30 group-hover:to-blue-500/30 transition-all"
                  whileHover={{ rotate: 360 }}
                  transition={{ duration: 0.6 }}
                >
                  <feature.icon className="w-6 h-6 text-purple-400" />
                </motion.div>
                <h3 className="font-semibold text-white mb-2">{feature.title}</h3>
                <p className="text-gray-400 text-sm">{feature.description}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </div>

      {/* Scroll Indicator */}
      <motion.div
        className="absolute bottom-8 left-1/2 transform -translate-x-1/2"
        animate={{ y: [0, 10, 0] }}
        transition={{ duration: 2, repeat: Infinity }}
      >
        <div className="w-6 h-10 glass rounded-full flex justify-center">
          <div className="w-1 h-3 bg-purple-400 rounded-full mt-2 animate-pulse" />
        </div>
      </motion.div>
    </div>
  );
}
