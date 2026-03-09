// app/layout.tsx - Enhanced Root Layout with Animated Background
import type { Metadata } from 'next';
import { Inter, JetBrains_Mono } from 'next/font/google';
import './globals.css';
import { CosmicNavigation } from '@/components/ui/cosmic-navigation';
import { FuturisticFooter } from '@/components/ui/futuristic-footer';
import { AnimatedBackground } from '@/components/ui/animated-background';
import { CustomCursor } from '@/components/ui/custom-cursor';
import { ScrollToTop } from '@/components/ui/scroll-to-top';

const inter = Inter({ 
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
});

const jetbrainsMono = JetBrains_Mono({ 
  subsets: ['latin'],
  variable: '--font-jetbrains-mono',
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'RAGDoo - Next-Gen AI Document Intelligence',
  description: 'Revolutionary RAG system powered by cutting-edge AI technology for intelligent document processing and analysis.',
  keywords: ['AI', 'RAG', 'Document Processing', 'Machine Learning', 'Intelligence'],
  authors: [{ name: 'RAGDoo Team' }],
  robots: 'index, follow',
  openGraph: {
    title: 'RAGDoo - Next-Gen AI Document Intelligence',
    description: 'Revolutionary RAG system powered by cutting-edge AI technology',
    type: 'website',
    images: ['/og-image.jpg'],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'RAGDoo - Next-Gen AI Document Intelligence',
    description: 'Revolutionary RAG system powered by cutting-edge AI technology',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark scroll-smooth">
      <head>
        <meta name="theme-color" content="#0a0a0a" />
        <meta name="color-scheme" content="dark" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      </head>
      <body className={`${inter.variable} ${jetbrainsMono.variable} font-sans antialiased bg-black text-white overflow-x-hidden`}>
        {/* Animated Background System */}
        <AnimatedBackground />
        
        {/* Static Background Effects */}
        <div className="fixed inset-0 -z-5">
          {/* Base Gradient */}
          <div className="absolute inset-0 bg-gradient-to-br from-purple-900/20 via-black to-blue-900/20" />
          
          {/* Grid Pattern */}
          <div 
            className="absolute inset-0 opacity-5"
            style={{
              backgroundImage: `
                linear-gradient(rgba(139, 92, 246, 0.1) 1px, transparent 1px),
                linear-gradient(90deg, rgba(139, 92, 246, 0.1) 1px, transparent 1px)
              `,
              backgroundSize: '50px 50px'
            }}
          />

          {/* Radial Gradients */}
          <div className="absolute top-0 left-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl" />
          <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl" />
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-cyan-500/5 rounded-full blur-3xl" />
        </div>

        {/* Main Application Structure */}
        <div className="relative flex flex-col min-h-screen">
          {/* Navigation */}
          <CosmicNavigation />
          
          {/* Main Content */}
          <main className="flex-1 relative z-10">
            {children}
          </main>
          
                  {/* Footer */}
        <FuturisticFooter />
      </div>

      {/* Custom Cursor */}
      <CustomCursor />

        {/* Global Loading Overlay */}
        <div id="global-loading" className="hidden fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center">
          <div className="text-center">
            <div className="w-16 h-16 border-4 border-purple-500/30 border-t-purple-500 rounded-full animate-spin mx-auto mb-4" />
            <p className="text-purple-400 font-mono">Processing...</p>
          </div>
        </div>

        {/* Scroll to Top Button */}
        <ScrollToTop />

        {/* Global JavaScript for interactions */}
        <script dangerouslySetInnerHTML={{
          __html: `
            // Global loading utility
            window.showGlobalLoading = function() {
              document.getElementById('global-loading').classList.remove('hidden');
            };

            window.hideGlobalLoading = function() {
              document.getElementById('global-loading').classList.add('hidden');
            };

            // Performance monitoring
            if (typeof window !== 'undefined' && 'performance' in window) {
              window.addEventListener('load', function() {
                setTimeout(function() {
                  const perfData = window.performance.timing;
                  const pageLoadTime = perfData.loadEventEnd - perfData.navigationStart;
                  console.log('RAGDoo loaded in', pageLoadTime, 'ms');
                }, 0);
              });
            }
          `
        }} />


      </body>
    </html>
  );
}
