// components/ui/futuristic-footer.tsx - Ultra-Modern Footer

'use client';

import { motion } from 'framer-motion';
import { 
  Github, Twitter, Linkedin, Mail, Globe, 
  Zap, Brain, Code, Database, Star, Heart,
  ArrowUp, Send, MessageCircle, Shield
} from 'lucide-react';
import { useState } from 'react';

export function FuturisticFooter() {
  const [email, setEmail] = useState('');
  const [isSubscribed, setIsSubscribed] = useState(false);

  const socialLinks = [
    { icon: Github, href: '#', label: 'GitHub', color: 'hover:text-gray-300' },
    { icon: Twitter, href: '#', label: 'Twitter', color: 'hover:text-blue-400' },
    { icon: Linkedin, href: '#', label: 'LinkedIn', color: 'hover:text-blue-500' },
    { icon: Mail, href: '#', label: 'Email', color: 'hover:text-red-400' }
  ];

  const features = [
    { icon: Brain, title: 'Neural Research', description: 'AI-powered knowledge discovery' },
    { icon: Code, title: 'Code Genesis', description: 'Intelligent code generation' },
    { icon: Database, title: 'Data Alchemy', description: 'Smart data transformation' },
    { icon: Zap, title: 'Quantum Processing', description: 'Lightning-fast execution' }
  ];

  const handleSubscribe = () => {
    if (email) {
      setIsSubscribed(true);
      setEmail('');
      setTimeout(() => setIsSubscribed(false), 3000);
    }
  };

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="relative bg-black text-white overflow-hidden">
      {/* Animated Background */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-gradient-to-t from-purple-900/10 via-blue-900/10 to-transparent" />
        <motion.div 
          className="absolute inset-0 opacity-5"
          style={{
            backgroundImage: `
              radial-gradient(circle at 25% 75%, rgba(139, 92, 246, 0.3) 0%, transparent 50%),
              radial-gradient(circle at 75% 25%, rgba(59, 130, 246, 0.3) 0%, transparent 50%)
            `
          }}
          animate={{
            backgroundPosition: ['0% 0%', '100% 100%', '0% 0%']
          }}
          transition={{
            duration: 20,
            repeat: Infinity,
            ease: "linear"
          }}
        />
      </div>

      <div className="relative z-10">
        {/* Top Border Animation */}
        <motion.div
          className="h-1 bg-gradient-to-r from-purple-500 via-blue-500 to-cyan-500"
          initial={{ scaleX: 0 }}
          whileInView={{ scaleX: 1 }}
          transition={{ duration: 2, ease: "easeOut" }}
          viewport={{ once: true }}
        />

        <div className="container mx-auto px-8 py-16">
          {/* Main Footer Content */}
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-12 mb-16">
            {/* Brand Section */}
            <motion.div 
              className="lg:col-span-2 space-y-6"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
            >
              <motion.h2 
                className="text-4xl font-black"
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
              </motion.h2>
              
              <p className="text-gray-300 text-lg leading-relaxed max-w-md">
                Revolutionizing research and development with AI-powered tools that unlock the infinite potential of human knowledge and creativity.
              </p>

              {/* Feature Grid */}
              <div className="grid grid-cols-2 gap-4 mt-8">
                {features.map((feature, index) => (
                  <motion.div
                    key={index}
                    className="glass rounded-xl p-4 hover:bg-white/10 transition-colors cursor-pointer group"
                    whileHover={{ scale: 1.02, y: -2 }}
                    transition={{ type: "spring", bounce: 0.3 }}
                  >
                    <feature.icon className="w-6 h-6 text-cyan-400 mb-2 group-hover:scale-110 transition-transform" />
                    <h4 className="font-bold text-sm mb-1">{feature.title}</h4>
                    <p className="text-xs text-gray-400">{feature.description}</p>
                  </motion.div>
                ))}
              </div>
            </motion.div>

            {/* Newsletter Section */}
            <motion.div 
              className="space-y-6"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              viewport={{ once: true }}
            >
              <div>
                <h3 className="text-2xl font-bold mb-3 text-gradient">Stay Connected</h3>
                <p className="text-gray-400 text-sm">
                  Get the latest updates on AI breakthroughs and new features.
                </p>
              </div>

              <div className="space-y-4">
                <div className="relative">
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Enter your email"
                    className="w-full bg-white/5 border border-gray-600 rounded-xl px-4 py-3 pr-12 text-white placeholder-gray-400 focus:outline-none focus:border-cyan-400 focus:bg-white/10 transition-all duration-300"
                  />
                  <motion.button
                    onClick={handleSubscribe}
                    className="absolute right-2 top-1/2 transform -translate-y-1/2 p-2 bg-gradient-to-r from-purple-600 to-blue-600 rounded-lg hover:scale-105 transition-transform duration-300"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <Send className="w-4 h-4" />
                  </motion.button>
                </div>

                {isSubscribed && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.8 }}
                    className="text-green-400 text-sm flex items-center space-x-2"
                  >
                    <Heart className="w-4 h-4" />
                    <span>Thanks for subscribing!</span>
                  </motion.div>
                )}
              </div>
            </motion.div>

            {/* Links Section */}
            <motion.div 
              className="space-y-6"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              viewport={{ once: true }}
            >
              <h3 className="text-2xl font-bold text-gradient">Quick Links</h3>
              
              <div className="space-y-3">
                {[
                  { name: 'Research Hub', href: '/dashboard/research' },
                  { name: 'Code Generator', href: '/dashboard/code-gen' },
                  { name: 'Data Tools', href: '/dashboard/form-fill' },
                  { name: 'Documentation', href: '/dashboard/documents' },
                  { name: 'API Reference', href: '/api' },
                  { name: 'Support', href: '/support' }
                ].map((link, index) => (
                  <motion.a
                    key={index}
                    href={link.href}
                    className="block text-gray-400 hover:text-cyan-400 transition-colors duration-300 group flex items-center space-x-2"
                    whileHover={{ x: 5 }}
                  >
                    <span>{link.name}</span>
                    <motion.div
                      className="w-0 h-px bg-cyan-400 group-hover:w-4 transition-all duration-300"
                    />
                  </motion.a>
                ))}
              </div>
            </motion.div>
          </div>

          {/* Social Links */}
          <motion.div 
            className="flex justify-center space-x-8 mb-12"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.6 }}
            viewport={{ once: true }}
          >
            {socialLinks.map((social, index) => (
              <motion.a
                key={index}
                href={social.href}
                aria-label={social.label}
                className={`glass rounded-full p-4 text-gray-400 ${social.color} transition-colors duration-300 group`}
                whileHover={{ scale: 1.1, y: -5 }}
                whileTap={{ scale: 0.95 }}
              >
                <social.icon className="w-6 h-6 group-hover:scale-110 transition-transform duration-300" />
              </motion.a>
            ))}
          </motion.div>

          {/* Bottom Section */}
          <motion.div 
            className="border-t border-gray-800 pt-8"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.8 }}
            viewport={{ once: true }}
          >
            <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
              <div className="flex items-center space-x-6 text-sm text-gray-400">
                <span>© 2024 RAGDOO. All rights reserved.</span>
                <div className="flex items-center space-x-1">
                  <Shield className="w-4 h-4" />
                  <span>Privacy</span>
                </div>
                <div className="flex items-center space-x-1">
                  <MessageCircle className="w-4 h-4" />
                  <span>Terms</span>
                </div>
              </div>

              <div className="flex items-center space-x-4">
                <span className="text-sm text-gray-400">Made with</span>
                <motion.div
                  animate={{ scale: [1, 1.2, 1] }}
                  transition={{ duration: 1, repeat: Infinity }}
                >
                  <Heart className="w-4 h-4 text-red-400" />
                </motion.div>
                <span className="text-sm text-gray-400">& AI</span>
                
                <motion.button
                  onClick={scrollToTop}
                  className="ml-6 glass rounded-full p-3 hover:bg-white/10 transition-colors duration-300 group"
                  whileHover={{ scale: 1.1, y: -3 }}
                  whileTap={{ scale: 0.95 }}
                  aria-label="Scroll to top"
                >
                  <ArrowUp className="w-5 h-5 text-gray-400 group-hover:text-cyan-400 transition-colors duration-300" />
                </motion.button>
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Floating Action Elements */}
      <div className="absolute bottom-8 right-8">
        <motion.div
          className="flex flex-col space-y-4"
          initial={{ opacity: 0, x: 50 }}
          whileInView={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, delay: 1 }}
          viewport={{ once: true }}
        >
          <motion.button
            className="glass rounded-full p-4 hover:bg-white/10 transition-colors group"
            whileHover={{ scale: 1.1, rotate: 15 }}
            whileTap={{ scale: 0.95 }}
          >
            <Star className="w-6 h-6 text-yellow-400 group-hover:animate-spin" />
          </motion.button>
          
          <motion.button
            onClick={scrollToTop}
            className="glass rounded-full p-4 hover:bg-white/10 transition-colors group"
            whileHover={{ scale: 1.1, y: -5 }}
            whileTap={{ scale: 0.95 }}
          >
            <ArrowUp className="w-6 h-6 text-cyan-400 group-hover:translate-y-[-2px] transition-transform duration-300" />
          </motion.button>
        </motion.div>
      </div>

      {/* Animated Bottom Border */}
      <motion.div
        className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-cyan-500 to-transparent"
        animate={{
          x: ['-100%', '100%'],
          opacity: [0, 1, 0]
        }}
        transition={{
          duration: 4,
          repeat: Infinity,
          ease: "easeInOut"
        }}
      />
    </footer>
  );
}