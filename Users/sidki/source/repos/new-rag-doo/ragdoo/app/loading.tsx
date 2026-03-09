// app/loading.tsx - The Most Spectacular Loading Experience Ever Created

'use client';

import { useState, useEffect, createElement } from 'react';
import { motion } from 'framer-motion';
import { Brain, Zap, Sparkles, Cpu, Database, Globe, Code, FileText } from 'lucide-react';

const loadingSteps = [
  { id: 1, text: 'Initializing Neural Networks...', icon: Brain, color: 'from-purple-500 to-blue-500' },
  { id: 2, text: 'Connecting to Knowledge Base...', icon: Database, color: 'from-blue-500 to-cyan-500' },
  { id: 3, text: 'Calibrating AI Processors...', icon: Cpu, color: 'from-cyan-500 to-green-500' },
  { id: 4, text: 'Synchronizing Reality Matrix...', icon: Sparkles, color: 'from-green-500 to-yellow-500' },
  { id: 5, text: 'Loading Quantum Interface...', icon: Zap, color: 'from-yellow-500 to-orange-500' },
  { id: 6, text: 'Welcome to the Future...', icon: Globe, color: 'from-orange-500 to-red-500' }
];

export default function Loading() {
  const [currentStep, setCurrentStep] = useState(0);
  const [progress, setProgress] = useState(0);
  const [particles, setParticles] = useState<Array<{id: number, x: number, y: number, size: number}>>([]);

  useEffect(() => {
    // Generate floating particles
    const generateParticles = () => {
      const newParticles = Array.from({ length: 50 }, (_, i) => ({
        id: i,
        x: Math.random() * window.innerWidth,
        y: Math.random() * window.innerHeight,
        size: Math.random() * 4 + 2
      }));
      setParticles(newParticles);
    };

    generateParticles();
    window.addEventListener('resize', generateParticles);
    return () => window.removeEventListener('resize', generateParticles);
  }, []);

  useEffect(() => {
    const progressTimer = setInterval(() => {
      setProgress(prev => {
        const newProgress = prev + Math.random() * 3 + 1;
        
        // Update current step based on progress
        const stepProgress = Math.floor((newProgress / 100) * loadingSteps.length);
        if (stepProgress < loadingSteps.length) {
          setCurrentStep(stepProgress);
        }
        
        return Math.min(newProgress, 100);
      });
    }, 150);

    return () => clearInterval(progressTimer);
  }, []);

  return (
    <div className="min-h-screen bg-black text-white flex items-center justify-center relative overflow-hidden">
      {/* Animated Background */}
      <div className="absolute inset-0">
        {/* Gradient Background */}
        <motion.div
          className="absolute inset-0 bg-gradient-to-br from-purple-900/20 via-blue-900/20 to-cyan-900/20"
          animate={{
            background: [
              'radial-gradient(circle at 20% 80%, rgba(120, 119, 198, 0.2) 0%, transparent 50%), radial-gradient(circle at 80% 20%, rgba(255, 119, 198, 0.2) 0%, transparent 50%)',
              'radial-gradient(circle at 40% 40%, rgba(120, 119, 198, 0.2) 0%, transparent 50%), radial-gradient(circle at 80% 80%, rgba(255, 119, 198, 0.2) 0%, transparent 50%)',
              'radial-gradient(circle at 80% 80%, rgba(120, 119, 198, 0.2) 0%, transparent 50%), radial-gradient(circle at 20% 20%, rgba(255, 119, 198, 0.2) 0%, transparent 50%)'
            ]
          }}
          transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
        />

        {/* Floating Particles */}
        {particles.map(particle => (
          <motion.div
            key={particle.id}
            className="absolute rounded-full bg-cyan-400/30"
            style={{
              width: particle.size,
              height: particle.size,
              left: particle.x,
              top: particle.y
            }}
            animate={{
              y: [particle.y, particle.y - 100],
              opacity: [0, 1, 0],
              scale: [0.5, 1, 0.5]
            }}
            transition={{
              duration: Math.random() * 3 + 2,
              repeat: Infinity,
              delay: Math.random() * 2
            }}
          />
        ))}

        {/* Grid Pattern */}
        <motion.div 
          className="absolute inset-0 opacity-10"
          style={{
            backgroundImage: `
              linear-gradient(rgba(59, 130, 246, 0.1) 1px, transparent 1px),
              linear-gradient(90deg, rgba(59, 130, 246, 0.1) 1px, transparent 1px)
            `,
            backgroundSize: '60px 60px'
          }}
          animate={{
            backgroundPosition: ['0px 0px', '60px 60px']
          }}
          transition={{
            duration: 10,
            repeat: Infinity,
            ease: "linear"
          }}
        />
      </div>

      {/* Main Loading Content */}
      <div className="relative z-10 text-center space-y-12">
        {/* Logo Animation */}
        <motion.div
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 1, ease: "easeOut" }}
        >
          <motion.h1 
            className="text-8xl md:text-9xl font-black mb-4"
            animate={{ 
              backgroundPosition: ['0% 50%', '100% 50%', '0% 50%']
            }}
            transition={{ 
              duration: 4, 
              repeat: Infinity, 
              ease: "linear" 
            }}
            style={{
              background: 'linear-gradient(90deg, #60a5fa, #a855f7, #ec4899, #f59e0b, #60a5fa)',
              backgroundSize: '300% 300%',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text'
            }}
          >
            RAGDOO
          </motion.h1>
          <motion.p 
            className="text-2xl text-gray-300 font-light"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.8 }}
          >
            Entering the Neural Dimension
          </motion.p>
        </motion.div>

        {/* Central Loading Animation */}
        <motion.div 
          className="relative w-80 h-80 mx-auto"
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.8, duration: 0.8, type: "spring", bounce: 0.3 }}
        >
          {/* Outer Rotating Ring */}
          <motion.div
            className="absolute inset-0 rounded-full border-4 border-transparent bg-gradient-to-r from-purple-500 via-blue-500 to-cyan-500"
            style={{
              mask: 'linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)',
              maskComposite: 'xor'
            }}
            animate={{ rotate: 360 }}
            transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
          />

          {/* Middle Rotating Ring */}
          <motion.div
            className="absolute inset-4 rounded-full border-2 border-transparent bg-gradient-to-r from-cyan-500 via-green-500 to-yellow-500"
            style={{
              mask: 'linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)',
              maskComposite: 'xor'
            }}
            animate={{ rotate: -360 }}
            transition={{ duration: 6, repeat: Infinity, ease: "linear" }}
          />

          {/* Inner Pulsing Core */}
          <motion.div
            className="absolute inset-16 rounded-full bg-gradient-to-br from-purple-600 via-blue-600 to-cyan-500 flex items-center justify-center"
            animate={{ 
              scale: [1, 1.1, 1],
              boxShadow: [
                '0 0 20px rgba(139, 92, 246, 0.5)',
                '0 0 40px rgba(139, 92, 246, 0.8)',
                '0 0 20px rgba(139, 92, 246, 0.5)'
              ]
            }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            {currentStep < loadingSteps.length && (
              <motion.div
                key={currentStep}
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0, opacity: 0 }}
                transition={{ duration: 0.5 }}
              >
                {createElement(loadingSteps[currentStep].icon, {
                  className: "w-12 h-12 text-white",
                  style: { filter: 'drop-shadow(0 0 10px rgba(255, 255, 255, 0.8))' }
                })}
              </motion.div>
            )}
          </motion.div>

          {/* Orbiting Elements */}
          {[0, 1, 2, 3].map(i => (
            <motion.div
              key={i}
              className="absolute w-4 h-4 bg-gradient-to-br from-white to-cyan-400 rounded-full"
              style={{
                top: '50%',
                left: '50%',
                transformOrigin: `${120 + i * 10}px 0px`
              }}
              animate={{ rotate: 360 }}
              transition={{ 
                duration: 4 + i * 0.5, 
                repeat: Infinity, 
                ease: "linear",
                delay: i * 0.2
              }}
            />
          ))}
        </motion.div>

        {/* Progress Bar */}
        <motion.div 
          className="w-96 mx-auto space-y-4"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.2, duration: 0.8 }}
        >
          <div className="glass rounded-full h-3 overflow-hidden">
            <motion.div
              className="h-full bg-gradient-to-r from-purple-500 via-blue-500 to-cyan-500 rounded-full"
              initial={{ width: 0 }}
              animate={{ width: `${progress}%` }}
              transition={{ duration: 0.3 }}
            />
          </div>
          
          <div className="flex justify-between text-sm text-gray-400">
            <span>{Math.round(progress)}%</span>
            <span>Loading Neural Interface</span>
          </div>
        </motion.div>

        {/* Loading Steps */}
        <motion.div 
          className="space-y-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.5, duration: 0.8 }}
        >
          {currentStep < loadingSteps.length && (
            <motion.div
              key={currentStep}
              className="flex items-center justify-center space-x-4"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5 }}
            >
              <motion.div
                className={`w-8 h-8 rounded-full bg-gradient-to-r ${loadingSteps[currentStep].color} flex items-center justify-center`}
                animate={{ rotate: 360 }}
                transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
              >
                {createElement(loadingSteps[currentStep].icon, {
                  className: "w-4 h-4 text-white"
                })}
              </motion.div>
              
              <motion.span 
                className="text-lg text-gray-300 font-medium"
                animate={{ opacity: [0.7, 1, 0.7] }}
                transition={{ duration: 1.5, repeat: Infinity }}
              >
                {loadingSteps[currentStep].text}
              </motion.span>
            </motion.div>
          )}
          
          {progress >= 100 && (
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, delay: 0.5 }}
              className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-cyan-400"
            >
              Welcome to the Future ✨
            </motion.div>
          )}
        </motion.div>

        {/* Loading Dots */}
        <motion.div 
          className="flex justify-center space-x-2"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 2, duration: 0.8 }}
        >
          {[...Array(3)].map((_, i) => (
            <motion.div
              key={i}
              className="w-3 h-3 bg-cyan-400 rounded-full"
              animate={{
                scale: [1, 1.5, 1],
                opacity: [0.3, 1, 0.3]
              }}
              transition={{
                duration: 1.5,
                repeat: Infinity,
                delay: i * 0.2
              }}
            />
          ))}
        </motion.div>
      </div>

      {/* Corner Decorations */}
      <motion.div
        className="absolute top-8 left-8 w-32 h-32 rounded-full bg-gradient-to-br from-purple-500/20 to-transparent"
        animate={{ 
          rotate: 360,
          scale: [1, 1.2, 1]
        }}
        transition={{ 
          rotate: { duration: 20, repeat: Infinity, ease: "linear" },
          scale: { duration: 4, repeat: Infinity }
        }}
      />
      
      <motion.div
        className="absolute bottom-8 right-8 w-24 h-24 rounded-full bg-gradient-to-br from-cyan-500/20 to-transparent"
        animate={{ 
          rotate: -360,
          scale: [1, 0.8, 1]
        }}
        transition={{ 
          rotate: { duration: 15, repeat: Infinity, ease: "linear" },
          scale: { duration: 3, repeat: Infinity }
        }}
      />
    </div>
  );
}