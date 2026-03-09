// components/ui/cosmic-navigation.tsx - Mind-bending Navigation Experience

'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Menu, X, Home, Brain, Code, Database, FileText, 
  Sparkles, Cpu, Settings, User, Search, Bell,
  ChevronDown, Zap, ArrowRight
} from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

interface NavItem {
  id: string;
  name: string;
  href: string;
  icon: React.ElementType;
  description: string;
  gradient: string;
  isNew?: boolean;
  hasSubmenu?: boolean;
  submenu?: Array<{
    name: string;
    href: string;
    icon: React.ElementType;
    description: string;
  }>;
}

const navigationItems: NavItem[] = [
  {
    id: 'dashboard',
    name: 'Dashboard',
    href: '/dashboard',
    icon: Home,
    description: 'Mission Control Center',
    gradient: 'from-blue-500 to-purple-600'
  },
  {
    id: 'research',
    name: 'Neural Research',
    href: '/dashboard/research',
    icon: Brain,
    description: 'AI-Powered Knowledge Discovery',
    gradient: 'from-purple-500 to-pink-600',
    isNew: true
  },
  {
    id: 'code',
    name: 'Code Genesis',
    href: '/dashboard/code-gen',
    icon: Code,
    description: 'Intelligent Code Creation',
    gradient: 'from-green-500 to-teal-600',
    hasSubmenu: true,
    submenu: [
      { name: 'React Components', href: '/dashboard/code-gen/react', icon: Code, description: 'Generate React components' },
      { name: 'API Endpoints', href: '/dashboard/code-gen/api', icon: Database, description: 'Create API routes' },
      { name: 'Database Schemas', href: '/dashboard/code-gen/db', icon: Database, description: 'Design database structures' }
    ]
  },
  {
    id: 'data',
    name: 'Data Alchemy',
    href: '/dashboard/form-fill',
    icon: Database,
    description: 'Smart Data Transformation',
    gradient: 'from-violet-500 to-purple-600'
  },
  {
    id: 'docs',
    name: 'Document Forge',
    href: '/dashboard/documents',
    icon: FileText,
    description: 'Intelligent Document Creation',
    gradient: 'from-orange-500 to-red-600'
  },
  {
    id: 'visuals',
    name: 'Visual Dreams',
    href: '/dashboard/images',
    icon: Sparkles,
    description: 'AI-Generated Imagery',
    gradient: 'from-pink-500 to-rose-600'
  },
  {
    id: 'agent',
    name: 'Omni Agent',
    href: '/dashboard/agent',
    icon: Cpu,
    description: 'Ultimate AI Orchestrator',
    gradient: 'from-indigo-500 to-purple-600',
    isNew: true
  }
];

export function CosmicNavigation() {
  const [isOpen, setIsOpen] = useState(false);
  const [hoveredItem, setHoveredItem] = useState<string | null>(null);
  const [scrolled, setScrolled] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const isActive = (href: string) => pathname === href;

  return (
    <>
      {/* Main Navigation Bar */}
      <motion.nav
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          scrolled ? 'glass backdrop-blur-xl border-b border-white/20' : 'bg-transparent'
        }`}
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.8, ease: 'easeOut' }}
      >
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            {/* Logo */}
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Link href="/dashboard" className="flex items-center space-x-3">
                <motion.div
                  className="w-10 h-10 bg-gradient-to-br from-purple-600 to-blue-600 rounded-xl flex items-center justify-center"
                  animate={{ rotate: [0, 360] }}
                  transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
                >
                  <Zap className="w-6 h-6 text-white" />
                </motion.div>
                <motion.span
                  className="text-2xl font-black text-white"
                  animate={{
                    backgroundPosition: ['0% 50%', '100% 50%', '0% 50%']
                  }}
                  transition={{ duration: 6, repeat: Infinity, ease: 'linear' }}
                  style={{
                    background: 'linear-gradient(90deg, #fff, #64b5f6, #e1bee7, #fff)',
                    backgroundSize: '200% 200%',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                    backgroundClip: 'text'
                  }}
                >
                  RAGDOO
                </motion.span>
              </Link>
            </motion.div>

            {/* Desktop Navigation */}
            <div className="hidden lg:flex items-center space-x-1">
              {navigationItems.map((item) => (
                <div
                  key={item.id}
                  className="relative"
                  onMouseEnter={() => setHoveredItem(item.id)}
                  onMouseLeave={() => setHoveredItem(null)}
                >
                  <motion.div
                    className="relative"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <Link
                      href={item.href}
                      className={`flex items-center space-x-2 px-4 py-3 rounded-2xl transition-all duration-300 group ${
                        isActive(item.href)
                          ? `bg-gradient-to-r ${item.gradient} text-white shadow-lg`
                          : 'text-gray-300 hover:text-white hover:bg-white/10'
                      }`}
                    >
                      <item.icon className={`w-5 h-5 ${
                        isActive(item.href) ? 'text-white' : 'text-gray-400 group-hover:text-white'
                      } transition-colors duration-300`} />
                      <span className="font-medium">{item.name}</span>
                      
                      {item.isNew && (
                        <motion.div
                          className="px-2 py-0.5 bg-green-500 text-white rounded-full text-xs font-bold"
                          animate={{ scale: [1, 1.1, 1] }}
                          transition={{ duration: 2, repeat: Infinity }}
                        >
                          NEW
                        </motion.div>
                      )}
                      
                      {item.hasSubmenu && (
                        <ChevronDown className="w-4 h-4 transition-transform duration-300 group-hover:rotate-180" />
                      )}
                    </Link>

                    {/* Submenu */}
                    {item.hasSubmenu && hoveredItem === item.id && (
                      <motion.div
                        className="absolute top-full left-0 mt-2 w-64 glass rounded-2xl p-4 shadow-2xl border border-white/20"
                        initial={{ opacity: 0, y: 10, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 10, scale: 0.95 }}
                        transition={{ duration: 0.2 }}
                      >
                        {item.submenu?.map((subitem, index) => (
                          <motion.div
                            key={index}
                            initial={{ opacity: 0, x: -10 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: index * 0.1 }}
                          >
                            <Link
                              href={subitem.href}
                              className="flex items-center space-x-3 p-3 rounded-xl hover:bg-white/10 transition-colors duration-300 group"
                            >
                              <subitem.icon className="w-5 h-5 text-gray-400 group-hover:text-cyan-400 transition-colors" />
                              <div>
                                <div className="font-medium text-white group-hover:text-cyan-400 transition-colors">
                                  {subitem.name}
                                </div>
                                <div className="text-xs text-gray-400">
                                  {subitem.description}
                                </div>
                              </div>
                            </Link>
                          </motion.div>
                        ))}
                      </motion.div>
                    )}
                  </motion.div>
                </div>
              ))}
            </div>

            {/* Right Side Actions */}
            <div className="flex items-center space-x-4">
              {/* Search Button */}
              <motion.button
                className="glass rounded-full p-3 hover:bg-white/10 transition-colors duration-300 group hidden md:block"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
              >
                <Search className="w-5 h-5 text-gray-400 group-hover:text-cyan-400 transition-colors duration-300" />
              </motion.button>

              {/* Notifications */}
              <motion.button
                className="glass rounded-full p-3 hover:bg-white/10 transition-colors duration-300 group relative hidden md:block"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
              >
                <Bell className="w-5 h-5 text-gray-400 group-hover:text-yellow-400 transition-colors duration-300" />
                <motion.div
                  className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full"
                  animate={{ scale: [1, 1.2, 1] }}
                  transition={{ duration: 2, repeat: Infinity }}
                />
              </motion.button>

              {/* Settings */}
              <motion.button
                className="glass rounded-full p-3 hover:bg-white/10 transition-colors duration-300 group hidden md:block"
                whileHover={{ scale: 1.1, rotate: 90 }}
                whileTap={{ scale: 0.95 }}
              >
                <Settings className="w-5 h-5 text-gray-400 group-hover:text-purple-400 transition-colors duration-300" />
              </motion.button>

              {/* Profile */}
              <motion.button
                className="glass rounded-full p-3 hover:bg-white/10 transition-colors duration-300 group hidden md:block"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
              >
                <User className="w-5 h-5 text-gray-400 group-hover:text-green-400 transition-colors duration-300" />
              </motion.button>

              {/* Mobile Menu Button */}
              <motion.button
                onClick={() => setIsOpen(!isOpen)}
                className="lg:hidden glass rounded-2xl p-3 hover:bg-white/10 transition-colors duration-300"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
              >
                <AnimatePresence>
                  {isOpen ? (
                    <motion.div
                      key="close"
                      initial={{ rotate: 0 }}
                      animate={{ rotate: 90 }}
                      exit={{ rotate: 0 }}
                      title="Close"
                    >
                      <X className="w-6 h-6 text-white" />
                    </motion.div>
                  ) : (
                    <motion.div
                      key="menu"
                      initial={{ rotate: 0 }}
                      animate={{ rotate: 0 }}
                      exit={{ rotate: -90 }}
                      title="Menu"
                    >
                      <Menu className="w-6 h-6 text-white" />
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.button>
            </div>
          </div>
        </div>

        {/* Active Item Indicator */}
        {navigationItems.find(item => isActive(item.href)) && (
          <motion.div
            className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-purple-500 via-blue-500 to-cyan-500"
            layoutId="activeIndicator"
            transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
          />
        )}
      </motion.nav>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {isOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 lg:hidden"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsOpen(false)}
            />

            {/* Mobile Menu */}
            <motion.div
              className="fixed top-20 left-4 right-4 glass rounded-3xl p-6 z-50 lg:hidden border border-white/20"
              initial={{ opacity: 0, y: -20, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -20, scale: 0.95 }}
              transition={{ duration: 0.3 }}
              title="Mobile Menu"
            >
              <div className="space-y-4">
                {navigationItems.map((item, index) => (
                  <motion.div
                    key={item.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <Link
                      href={item.href}
                      onClick={() => setIsOpen(false)}
                      className={`flex items-center space-x-4 p-4 rounded-2xl transition-all duration-300 group ${
                        isActive(item.href)
                          ? `bg-gradient-to-r ${item.gradient} text-white`
                          : 'text-gray-300 hover:text-white hover:bg-white/10'
                      }`}
                    >
                      <motion.div
                        className={`p-2 rounded-xl ${
                          isActive(item.href) ? 'bg-white/20' : 'bg-gray-700 group-hover:bg-white/10'
                        }`}
                        whileHover={{ scale: 1.1, rotate: 5 }}
                        title="Icon"
                      >
                        <item.icon className="w-5 h-5" />
                      </motion.div>
                      
                      <div className="flex-1">
                        <div className="flex items-center space-x-2">
                          <span className="font-bold">{item.name}</span>
                          {item.isNew && (
                            <span className="px-2 py-0.5 bg-green-500 text-white rounded-full text-xs font-bold">
                              NEW
                            </span>
                          )}
                        </div>
                        <div className="text-sm opacity-70">{item.description}</div>
                      </div>
                      
                      <ArrowRight className={`w-5 h-5 transition-transform duration-300 ${
                        isActive(item.href) ? 'translate-x-1' : 'group-hover:translate-x-1'
                      }`} />
                    </Link>
                  </motion.div>
                ))}

                {/* Mobile Action Buttons */}
                <motion.div
                  className="flex items-center justify-center space-x-4 pt-6 border-t border-gray-700"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.5 }}
                >
                  {[
                    { icon: Search, color: 'hover:text-cyan-400', href: '/search' },
                    { icon: Bell, color: 'hover:text-yellow-400', href: '/notifications' },
                    { icon: Settings, color: 'hover:text-purple-400', href: '/settings' },
                    { icon: User, color: 'hover:text-green-400', href: '/profile' }
                  ].map((action, index) => (
                    <Link key={index} href={action.href}>
                      <motion.button
                        className={`glass rounded-full p-4 text-gray-400 ${action.color} transition-colors duration-300`}
                        whileHover={{ scale: 1.1, y: -2 }}
                        whileTap={{ scale: 0.95 }}
                        title="Action"
                      >
                        <action.icon className="w-5 h-5" />
                      </motion.button>
                    </Link>
                  ))}
                </motion.div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Spacer for fixed navigation */}
      <div className="h-20" />
    </>
  );
}