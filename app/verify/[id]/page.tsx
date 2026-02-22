import { ShieldCheck, Download, Verified, FileText, Calendar, User, ExternalLink } from 'lucide-react';
import Link from 'next/link';

export default async function VerifyPage({ params }: { params: Promise<{ id: string }> }) {
    const unwrappedParams = await params;

    // Mock verification
    const cert = {
        verification_code: unwrappedParams.id,
        agent_name: 'Agent Smith',
        buyer_name: 'John Doe',
        created_at: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
        professional_summary: 'This representation agreement confirms that Agent Smith will represent John Doe, ensuring a mutually beneficial relationship compliant with all relevant real estate regulations and ensuring a 2.5% commission is handled transparently.',
    };

    return (
        <div className="min-h-screen bg-background text-white font-space selection:bg-primary p-6 flex flex-col items-center justify-center relative overflow-hidden">
            {/* Ambient Glows */}
            <div className="fixed top-[-10%] left-[-10%] w-[40vw] h-[40vw] rounded-full bg-primary/10 blur-[100px] pointer-events-none"></div>
            <div className="fixed bottom-[-10%] right-[-10%] w-[40vw] h-[40vw] rounded-full bg-primary/10 blur-[100px] pointer-events-none"></div>

            <div className="w-full max-w-lg space-y-8 relative z-10 animate-fade-in">
                {/* ID Card / Header */}
                <div className="text-center space-y-4">
                    <div className="inline-flex items-center gap-2 px-3 py-1 bg-primary/10 rounded-full border border-primary/20 text-primary text-[10px] font-bold uppercase tracking-widest mb-2 shadow-[0_0_20px_rgba(48,136,117,0.2)]">
                        <Verified size={12} />
                        Verified Infrastructure™
                    </div>
                    <h1 className="text-4xl font-bold tracking-tighter text-glow">Certificate Valid</h1>
                    <p className="text-text-secondary text-sm max-w-xs mx-auto">This commission protection framework is legally binding and cryptographically secure.</p>
                </div>

                {/* Main Identity Panel */}
                <div className="glass-panel p-8 rounded-[2.5rem] border border-white/10 space-y-8 shadow-2xl relative overflow-hidden group">
                    <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:opacity-10 transition-opacity pointer-events-none">
                        <ShieldCheck size={160} />
                    </div>

                    <div className="space-y-6 relative z-10 text-center">
                        <div className="space-y-1">
                            <p className="text-[10px] text-text-secondary uppercase tracking-[0.2em] font-bold">Certificate Tracking ID</p>
                            <p className="text-2xl font-mono font-bold text-white tracking-widest">{cert.verification_code}</p>
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-8 relative z-10 pt-4">
                        <div className="space-y-1">
                            <div className="flex items-center gap-2 text-text-secondary mb-1">
                                <User size={12} />
                                <span className="text-[10px] uppercase tracking-widest font-bold">Agent</span>
                            </div>
                            <p className="font-bold text-white text-lg">{cert.agent_name}</p>
                        </div>
                        <div className="space-y-1">
                            <div className="flex items-center gap-2 text-text-secondary mb-1">
                                <User size={12} className="text-primary" />
                                <span className="text-[10px] uppercase tracking-widest font-bold">Buyer</span>
                            </div>
                            <p className="font-bold text-white text-lg">{cert.buyer_name}</p>
                        </div>
                        <div className="space-y-1">
                            <div className="flex items-center gap-2 text-text-secondary mb-1">
                                <Calendar size={12} />
                                <span className="text-[10px] uppercase tracking-widest font-bold">Execution Date</span>
                            </div>
                            <p className="font-bold text-white text-lg">{cert.created_at}</p>
                        </div>
                        <div className="space-y-1">
                            <div className="flex items-center gap-2 text-text-secondary mb-1">
                                <ShieldCheck size={12} className="text-primary" />
                                <span className="text-[10px] uppercase tracking-widest font-bold">Protocol</span>
                            </div>
                            <p className="font-bold text-white text-lg italic">Dwellingly v1.2</p>
                        </div>
                    </div>

                    <div className="glass-card p-6 rounded-3xl border border-white/5 space-y-3 relative z-10">
                        <div className="flex items-center gap-2 text-text-secondary">
                            <FileText size={14} />
                            <span className="text-[10px] uppercase tracking-widest font-bold">Professional Summary</span>
                        </div>
                        <p className="text-xs text-text-secondary leading-relaxed font-medium">
                            {cert.professional_summary}
                        </p>
                    </div>

                    <button className="w-full bg-white text-black font-bold h-16 rounded-2xl flex items-center justify-center gap-3 transition-all hover:bg-gray-200 active:scale-[0.98] group shadow-2xl relative z-10">
                        <Download size={20} className="group-hover:translate-y-0.5 transition-transform" />
                        Download PDF Certificate
                    </button>
                </div>

                {/* Footer Links */}
                <div className="flex flex-col items-center gap-6 pt-4">
                    <Link href="/" className="text-text-secondary hover:text-white transition-colors text-xs font-bold flex items-center gap-2 py-2 px-4 rounded-full bg-white/5 border border-white/10">
                        Verify Another Certificate <ExternalLink size={12} />
                    </Link>
                    <p className="text-[10px] text-text-secondary/50 text-center leading-relaxed">
                        Dwellingly Commission Infrastructure™ Layer <br />
                        Validated for Post-NAR Settlement Compliance
                    </p>
                </div>
            </div>
        </div>
    );
}
