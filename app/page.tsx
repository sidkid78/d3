import Link from 'next/link';
import { ShieldCheck, ArrowRight, PlayCircle, Star, Verified, CheckCircle, TrendingUp, Lock } from 'lucide-react';

export default function HomePage() {
  return (
    <div className="min-h-screen bg-background text-white selection:bg-primary">
      {/* Ambient Background Glows */}
      <div className="fixed top-[-20%] left-[-10%] w-[50vw] h-[50vw] rounded-full bg-primary/10 blur-[120px] pointer-events-none z-0"></div>
      <div className="fixed bottom-[-10%] right-[-5%] w-[40vw] h-[40vw] rounded-full bg-primary/10 blur-[100px] pointer-events-none z-0"></div>

      {/* Navigation */}
      <header className="sticky top-0 z-50 w-full glass-panel border-b-0">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <ShieldCheck className="text-primary w-8 h-8" />
            <span className="text-xl font-bold tracking-tight">Dwellingly</span>
          </div>
          <nav className="hidden md:flex items-center gap-8">
            <a className="text-sm font-medium text-text-secondary hover:text-white transition-colors" href="#solutions">Solutions</a>
            <a className="text-sm font-medium text-text-secondary hover:text-white transition-colors" href="#calculator">ROI Calculator</a>
            <a className="text-sm font-medium text-text-secondary hover:text-white transition-colors" href="/verify/example">Verification</a>
          </nav>
          <div className="flex items-center gap-4">
            <Link href="/login" className="hidden sm:block text-sm font-medium text-text-secondary hover:text-white transition-colors">Login</Link>
            <Link href="/login" className="bg-primary hover:bg-primary-hover text-white text-sm font-bold px-5 py-2.5 rounded-lg transition-all shadow-[0_0_15px_rgba(48,136,117,0.4)]">
              Join the Pilot
            </Link>
          </div>
        </div>
      </header>

      <main className="relative z-10">
        {/* Hero Section */}
        <section className="w-full max-w-7xl mx-auto px-6 py-20 lg:py-32 flex flex-col items-center text-center relative">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full bg-glow-gradient pointer-events-none"></div>

          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 mb-8 backdrop-blur-sm">
            <span className="flex h-2 w-2 rounded-full bg-primary animate-pulse"></span>
            <span className="text-xs font-medium text-primary tracking-wide uppercase">New: Post-Settlement Framework</span>
          </div>

          <h1 className="text-5xl md:text-7xl font-bold tracking-tighter leading-[1.1] mb-6 max-w-4xl text-glow">
            Your Income, Protected by <span className="text-transparent bg-clip-text bg-linear-to-r from-white via-primary to-white animate-pulse">Infrastructure™</span>
          </h1>

          <p className="text-lg md:text-xl text-text-secondary max-w-2xl mb-10 font-light leading-relaxed">
            The MLS commission guarantee is gone. Dwellingly replaces it with a legally binding buyer representation framework. Secure your future revenue today.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
            <Link href="/login" className="bg-primary hover:bg-primary-hover text-white text-lg font-bold px-8 py-4 rounded-xl transition-all shadow-[0_0_20px_rgba(48,136,117,0.5)] flex items-center justify-center gap-2">
              Join the Pilot
              <ArrowRight size={20} />
            </Link>
            <button className="glass-panel hover:bg-white/5 text-white text-lg font-bold px-8 py-4 rounded-xl transition-all border border-white/20 flex items-center justify-center gap-2">
              <PlayCircle size={20} />
              Watch 2-Min Demo
            </button>
          </div>

          {/* Stats Strip */}
          <div className="mt-20 grid grid-cols-1 sm:grid-cols-3 gap-6 w-full max-w-4xl">
            <div className="glass-panel p-6 rounded-xl flex flex-col items-center justify-center gap-1">
              <span className="text-3xl font-bold text-white tracking-tight">$15M+</span>
              <span className="text-sm text-text-secondary uppercase tracking-wider">Commissions Secured</span>
            </div>
            <div className="glass-panel p-6 rounded-xl flex flex-col items-center justify-center gap-1">
              <span className="text-3xl font-bold text-white tracking-tight">500+</span>
              <span className="text-sm text-text-secondary uppercase tracking-wider">Pilot Agents</span>
            </div>
            <div className="glass-panel p-6 rounded-xl flex flex-col items-center justify-center gap-1">
              <span className="text-3xl font-bold text-primary tracking-tight">300x</span>
              <span className="text-sm text-text-secondary uppercase tracking-wider">Projected ROI</span>
            </div>
          </div>
        </section>

        {/* Comparison Section */}
        <section id="solutions" className="w-full max-w-7xl mx-auto px-6 py-20">
          <div className="flex flex-col gap-4 mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-white">Systemic Risk vs. Dwellingly Solution</h2>
            <p className="text-text-secondary max-w-2xl text-lg">The post-NAR settlement landscape exposes agents to unprecedented income volatility. Compare the old verbal agreements with our guaranteed infrastructure.</p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Risk Card */}
            <div className="relative group rounded-2xl p-px bg-linear-to-b from-red-500/20 to-transparent">
              <div className="bg-[#141414] h-full rounded-2xl p-8 relative overflow-hidden">
                <div className="flex items-center gap-3 mb-6">
                  <div className="p-2 rounded-lg bg-red-500/10 text-red-400">
                    <ShieldCheck size={24} />
                  </div>
                  <h3 className="text-xl font-bold text-white">The Old Way (Risk)</h3>
                </div>
                <ul className="space-y-6 text-text-secondary">
                  <li className="flex gap-4 items-start">
                    <span className="text-red-400 mt-1">✕</span>
                    <div>
                      <h4 className="text-white font-medium text-lg">Unsecured Commissions</h4>
                      <p className="text-sm mt-1">Reliance on verbal trust with no legal recourse if a buyer bypasses you.</p>
                    </div>
                  </li>
                  <li className="flex gap-4 items-start">
                    <span className="text-red-400 mt-1">✕</span>
                    <div>
                      <h4 className="text-white font-medium text-lg">Income Volatility</h4>
                      <p className="text-sm mt-1">Unpredictable revenue streams dependent on seller concessions.</p>
                    </div>
                  </li>
                </ul>
              </div>
            </div>

            {/* Solution Card */}
            <div className="relative group rounded-2xl p-px bg-linear-to-b from-primary to-transparent shadow-[0_0_40px_-10px_rgba(48,136,117,0.3)]">
              <div className="bg-[#141e1c] h-full rounded-2xl p-8 relative overflow-hidden backdrop-blur-xl">
                <div className="flex items-center gap-3 mb-6">
                  <div className="p-2 rounded-lg bg-primary/20 text-primary">
                    <Verified size={24} />
                  </div>
                  <h3 className="text-xl font-bold text-white">Dwellingly Infrastructure</h3>
                </div>
                <ul className="space-y-6">
                  <li className="flex gap-4 items-start">
                    <CheckCircle className="text-primary mt-1 shrink-0" size={20} />
                    <div>
                      <h4 className="text-white font-medium text-lg">Guaranteed Payouts</h4>
                      <p className="text-text-secondary text-sm mt-1">Smart contracts lock in your commission before you show the first home.</p>
                    </div>
                  </li>
                  <li className="flex gap-4 items-start">
                    <CheckCircle className="text-primary mt-1 shrink-0" size={20} />
                    <div>
                      <h4 className="text-white font-medium text-lg">Digital Buyer Agreements</h4>
                      <p className="text-text-secondary text-sm mt-1">One-click, legally binding agreements compliant with new NAR rules.</p>
                    </div>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </section>

        {/* Calculator Section */}
        <section id="calculator" className="w-full max-w-7xl mx-auto px-6 py-20">
          <div className="glass-panel rounded-2xl p-8 md:p-12 relative overflow-hidden border border-primary/20">
            <div className="flex flex-col lg:flex-row gap-12 items-center">
              <div className="flex-1 space-y-8 w-full">
                <div className="space-y-2">
                  <div className="inline-block px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-bold uppercase tracking-widest border border-primary/20 mb-2">Calculator</div>
                  <h2 className="text-3xl md:text-4xl font-bold text-white">Project Your Protected Revenue</h2>
                  <p className="text-text-secondary">Visualizing the value of secured commission infrastructure.</p>
                </div>
                <div className="space-y-6">
                  <div className="space-y-4">
                    <div className="flex justify-between text-sm font-medium">
                      <span className="text-white">Annual Deal Volume</span>
                      <span className="text-primary font-bold">24 Deals</span>
                    </div>
                    <input className="w-full h-2 bg-white/10 rounded-lg appearance-none cursor-pointer accent-primary" type="range" defaultValue="24" title="Deal Volume" placeholder="24" />
                  </div>
                </div>
              </div>
              <div className="flex-1 w-full">
                <div className="bg-black/40 backdrop-blur-md rounded-xl p-8 border border-white/10 flex flex-col items-center justify-center text-center space-y-6 shadow-2xl relative">
                  <p className="text-text-secondary text-sm font-medium uppercase tracking-wider">Total Commission Protected</p>
                  <p className="text-5xl md:text-6xl font-bold text-white tracking-tight">$324,000</p>
                  <div className="flex justify-between w-full px-4">
                    <div className="text-center">
                      <p className="text-text-secondary text-xs mb-1">Risk Reduction</p>
                      <p className="text-emerald-400 font-bold text-xl flex items-center justify-center gap-1">
                        <TrendingUp size={16} /> 98%
                      </p>
                    </div>
                    <div className="text-center">
                      <p className="text-text-secondary text-xs mb-1">Platform ROI</p>
                      <p className="text-primary font-bold text-xl">300x</p>
                    </div>
                  </div>
                  <Link href="/login" className="w-full mt-4 bg-white text-black hover:bg-gray-200 font-bold py-3 rounded-lg transition-colors flex justify-center items-center gap-2">
                    Lock in These Rates
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="w-full max-w-4xl mx-auto px-6 py-20 text-center">
          <div className="glass-panel p-12 rounded-3xl border border-white/10 space-y-8 relative overflow-hidden">
            <div className="absolute top-0 right-1/2 translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-primary/20 blur-[100px] pointer-events-none"></div>

            <div className="space-y-4 relative z-10">
              <h2 className="text-3xl md:text-5xl font-bold text-white tracking-tight">Ready to Protect Your Income?</h2>
              <p className="text-text-secondary text-lg max-w-xl mx-auto">Join the premium infrastructure for professional real estate representation.</p>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto relative z-10">
              <label htmlFor="agent-email-cta" className="sr-only">Email Address</label>
              <input
                id="agent-email-cta"
                type="email"
                placeholder="Enter your professional email"
                className="flex-1 bg-white/5 border border-white/10 p-4 rounded-xl focus:outline-none focus:ring-1 focus:ring-primary/50 text-white placeholder:text-white/20"
              />
              <button className="bg-primary hover:bg-primary-hover text-white font-bold px-8 py-4 rounded-xl transition-all shadow-[0_0_20px_rgba(48,136,117,0.3)] whitespace-nowrap">
                Join Pilot
              </button>
            </div>
          </div>
        </section>

        {/* Footer */}
        <footer className="w-full border-t border-glass-border bg-[#050505] py-12 mt-20">
          <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-8">
            <div className="flex flex-col gap-2 items-center md:items-start">
              <div className="flex items-center gap-2 text-white">
                <ShieldCheck className="text-primary" />
                <span className="font-bold text-xl">Dwellingly</span>
              </div>
              <p className="text-text-secondary text-sm">Commission Infrastructure for the Modern Agent.</p>
            </div>
            <div className="flex gap-8 flex-wrap justify-center text-sm text-text-secondary">
              <a className="hover:text-white transition-colors" href="#">Privacy Policy</a>
              <a className="hover:text-white transition-colors" href="#">Terms of Service</a>
              <a className="hover:text-white transition-colors" href="#">Contact Support</a>
            </div>
          </div>
          <div className="max-w-7xl mx-auto px-6 mt-8 pt-8 border-t border-white/5 text-center md:text-left">
            <p className="text-xs text-text-secondary/50">© 2024 Dwellingly Inc. All rights reserved.</p>
          </div>
        </footer>
      </main>
    </div>
  );
}
