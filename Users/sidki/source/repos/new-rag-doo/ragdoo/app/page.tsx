// app/page.tsx - Enhanced Main Page with Spectacular Hero
import { HeroSection } from '@/components/ui/hero-section';
import { DocumentUpload } from '@/components/ui/document-upload';
import { QueryInterface } from '@/components/ui/query-interface';
import { ResultsDisplay } from '@/components/ui/results-display';

export default function HomePage() {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <HeroSection />

      {/* Main Application Interface */}
      <div className="relative py-24">
        {/* Background Decoration */}
        <div className="absolute inset-0 bg-gradient-to-b from-black via-purple-950/10 to-black" />
        
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Section Header */}
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-6xl font-black mb-6">
              <span className="bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">
                Experience the Future
              </span>
            </h2>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              Upload your documents, ask questions in natural language, and get intelligent, 
              context-aware answers powered by state-of-the-art AI technology.
            </p>
          </div>

          {/* Application Interface Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-24">
            {/* Document Upload Section */}
            <div className="space-y-8">
              <div className="text-center lg:text-left">
                <h3 className="text-2xl font-bold text-white mb-4">
                  Smart Document Processing
                </h3>
                <p className="text-gray-400">
                  Upload PDFs, documents, and files. Our AI instantly processes and indexes 
                  them for lightning-fast retrieval and analysis.
                </p>
              </div>
              <DocumentUpload />
            </div>

            {/* Query Interface Section */}
            <div className="space-y-8">
              <div className="text-center lg:text-left">
                <h3 className="text-2xl font-bold text-white mb-4">
                  Natural Language Queries
                </h3>
                <p className="text-gray-400">
                  Ask questions in plain English. Our advanced RAG system understands 
                  context and provides accurate, source-backed answers.
                </p>
              </div>
              <QueryInterface />
            </div>
          </div>

          {/* Results Section */}
          <div className="mb-24">
            <div className="text-center mb-12">
              <h3 className="text-3xl font-bold text-white mb-4">
                Intelligent Results
              </h3>
              <p className="text-gray-400 max-w-2xl mx-auto">
                Get comprehensive answers with source citations, confidence scores, 
                and related information to make informed decisions.
              </p>
            </div>
            <ResultsDisplay />
          </div>

          {/* Feature Showcase */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-24">
            <div className="text-center p-8 glass rounded-2xl hover:bg-white/5 transition-all">
              <div className="w-16 h-16 mx-auto mb-6 bg-gradient-to-r from-purple-500/20 to-blue-500/20 rounded-2xl flex items-center justify-center">
                <svg className="w-8 h-8 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <h4 className="text-xl font-semibold text-white mb-3">Lightning Fast</h4>
              <p className="text-gray-400">
                Sub-second query processing with optimized vector search and caching
              </p>
            </div>

            <div className="text-center p-8 glass rounded-2xl hover:bg-white/5 transition-all">
              <div className="w-16 h-16 mx-auto mb-6 bg-gradient-to-r from-purple-500/20 to-blue-500/20 rounded-2xl flex items-center justify-center">
                <svg className="w-8 h-8 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
              </div>
              <h4 className="text-xl font-semibold text-white mb-3">Secure & Private</h4>
              <p className="text-gray-400">
                Enterprise-grade security with encrypted storage and private processing
              </p>
            </div>

            <div className="text-center p-8 glass rounded-2xl hover:bg-white/5 transition-all">
              <div className="w-16 h-16 mx-auto mb-6 bg-gradient-to-r from-purple-500/20 to-blue-500/20 rounded-2xl flex items-center justify-center">
                <svg className="w-8 h-8 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                </svg>
              </div>
              <h4 className="text-xl font-semibold text-white mb-3">Smart Architecture</h4>
              <p className="text-gray-400">
                Advanced RAG pipeline with semantic search and context understanding
              </p>
            </div>
          </div>

          {/* Call to Action */}
          <div className="text-center">
            <div className="inline-flex items-center px-8 py-4 bg-gradient-to-r from-purple-600 to-blue-600 rounded-full font-semibold text-lg shadow-2xl shadow-purple-500/25 hover:shadow-purple-500/40 transition-all cursor-pointer">
              Ready to Get Started?
              <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
