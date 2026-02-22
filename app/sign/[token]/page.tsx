'use client';

import { useRef, useState, useEffect, use } from 'react';
import SignatureCanvas from 'react-signature-canvas';
import { ShieldCheck, Lock, FileText, CheckCircle, Info, Calendar, User, Zap } from 'lucide-react';

export default function BuyerSigningPage({ params }: { params: Promise<{ token: string }> }) {
    const unwrappedParams = use(params);
    const sigCanvas = useRef<SignatureCanvas>(null);
    const [agreement, setAgreement] = useState<any>(null);
    const [signed, setSigned] = useState(false);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Mock API call
        setTimeout(() => {
            setAgreement({
                buyer_name: 'John Doe',
                commission_percentage: 2.5,
                agent_name: 'Agent Smith',
                expiration_date: 'Dec 31, 2024',
                certificate_id: `DWL-${Math.random().toString(36).toUpperCase().substring(2, 10)}`
            });
            setLoading(false);
        }, 1000);
    }, [unwrappedParams.token]);

    const handleSign = async () => {
        if (sigCanvas.current?.isEmpty()) return;

        // Mock save delay
        await new Promise(resolve => setTimeout(resolve, 800));
        setSigned(true);
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-background text-white flex flex-col items-center justify-center p-6 text-center space-y-6">
                <div className="w-16 h-16 border-4 border-primary/20 border-t-primary rounded-full animate-spin"></div>
                <p className="text-text-secondary font-medium animate-pulse">Establishing Secure Connection...</p>
            </div>
        );
    }

    if (signed) {
        return (
            <div className="min-h-screen bg-background text-white flex flex-col items-center justify-center p-6 text-center space-y-8">
                {/* Ambient Glow */}
                <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[60vw] h-[60vw] bg-primary/10 blur-[120px] pointer-events-none"></div>

                <div className="relative">
                    <div className="w-24 h-24 bg-primary/10 rounded-full flex items-center justify-center text-primary border border-primary/20 animate-bounce">
                        <CheckCircle size={48} />
                    </div>
                    <div className="absolute -top-2 -right-2 bg-emerald-500 text-white p-1 rounded-full shadow-lg">
                        <ShieldCheck size={20} />
                    </div>
                </div>

                <div className="space-y-3 relative z-10">
                    <h1 className="text-4xl font-bold tracking-tight text-glow">Status: Protected</h1>
                    <p className="text-text-secondary max-w-sm mx-auto">
                        Your Commission Certificate has been successfully generated and recorded.
                    </p>
                </div>

                <div className="glass-panel p-8 rounded-3xl border border-primary/20 w-full max-w-sm space-y-4 relative z-10 shadow-2xl">
                    <div className="space-y-1">
                        <p className="text-[10px] text-text-secondary uppercase tracking-[0.2em] font-bold">Certificate Hash</p>
                        <p className="text-lg font-mono font-bold text-white tracking-widest">{agreement?.certificate_id}</p>
                    </div>
                    <div className="h-px bg-glass-border w-full"></div>
                    <p className="text-xs text-text-secondary leading-relaxed">
                        This digital framework is now legally binding and accessible to your title and escrow company for post-settlement verification.
                    </p>
                </div>

                <button
                    onClick={() => { if (typeof window !== 'undefined') window.close(); }}
                    className="text-text-secondary hover:text-white transition-colors text-sm font-medium flex items-center gap-2"
                >
                    Return to Experience
                    <Zap size={14} className="text-primary fill-primary" />
                </button>
            </div>
        );
    }

    if (!agreement) {
        return (
            <div className="min-h-screen bg-background text-white flex flex-col items-center justify-center p-6 text-center space-y-4">
                <div className="w-16 h-16 bg-red-500/10 rounded-full flex items-center justify-center text-red-500 border border-red-500/20">
                    <Info size={32} />
                </div>
                <h1 className="text-2xl font-bold">Link Expired</h1>
                <p className="text-text-secondary">Please contact your agent for a fresh security token.</p>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-background text-white font-space selection:bg-primary selection:text-white">
            {/* Nav Header */}
            <header className="sticky top-0 z-50 glass-panel border-b-0 backdrop-blur-xl">
                <div className="max-w-xl mx-auto px-6 h-20 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center border border-primary/20 shadow-[0_0_15px_rgba(48,136,117,0.2)]">
                            <ShieldCheck className="text-primary w-6 h-6" />
                        </div>
                        <div className="flex flex-col">
                            <span className="text-lg font-bold leading-tight">Dwellingly</span>
                            <div className="flex items-center gap-1.5">
                                <span className="flex h-1.5 w-1.5 rounded-full bg-primary animate-pulse"></span>
                                <span className="text-[10px] uppercase tracking-widest text-text-secondary font-bold">Secure Verification</span>
                            </div>
                        </div>
                    </div>
                    <div className="hidden sm:flex items-center gap-2 px-3 py-1 bg-white/5 rounded-full border border-white/10">
                        <Lock size={12} className="text-text-secondary" />
                        <span className="text-[10px] font-bold text-text-secondary uppercase tracking-widest select-none">E2EE Protocol</span>
                    </div>
                </div>
            </header>

            <main className="max-w-xl mx-auto p-6 space-y-8 pb-32">
                <div className="space-y-4">
                    <h2 className="text-2xl font-bold tracking-tight">Review & Sign</h2>
                    <p className="text-text-secondary text-sm">Review your representation terms below and provide your digital signature to confirm.</p>
                </div>

                {/* Terms Card */}
                <div className="glass-panel p-6 rounded-3xl border border-white/5 space-y-6 relative overflow-hidden group">
                    <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity pointer-events-none">
                        <FileText size={100} />
                    </div>

                    <div className="grid grid-cols-2 gap-6">
                        <div className="space-y-1">
                            <div className="flex items-center gap-2 text-text-secondary mb-1">
                                <User size={12} />
                                <span className="text-[10px] uppercase tracking-widest font-bold">Your Agent</span>
                            </div>
                            <p className="font-bold text-white">{agreement.agent_name}</p>
                        </div>
                        <div className="space-y-1">
                            <div className="flex items-center gap-2 text-text-secondary mb-1">
                                <Calendar size={12} />
                                <span className="text-[10px] uppercase tracking-widest font-bold">Expiration</span>
                            </div>
                            <p className="font-bold text-white">{agreement.expiration_date}</p>
                        </div>
                    </div>

                    <div className="p-4 bg-primary/5 rounded-2xl border border-primary/20 flex items-center justify-between">
                        <div className="space-y-0.5">
                            <p className="text-[10px] text-primary uppercase tracking-widest font-bold">Agreed Compensation</p>
                            <p className="text-2xl font-bold text-white">{agreement.commission_percentage}%</p>
                        </div>
                        <div className="text-right">
                            <div className="inline-block px-2 py-1 bg-primary text-white text-[8px] font-bold rounded uppercase tracking-widest">NAR Compliant</div>
                        </div>
                    </div>
                </div>

                {/* Signature View */}
                <div className="space-y-4">
                    <div className="flex items-center justify-between">
                        <label className="text-[10px] uppercase tracking-widest text-text-secondary font-bold">Draw Signature Below</label>
                        <button
                            onClick={() => sigCanvas.current?.clear()}
                            className="text-[10px] uppercase tracking-widest text-primary font-bold hover:text-primary-hover transition-colors"
                        >
                            Clear Pad
                        </button>
                    </div>
                    <div className="bg-white/3 border-2 border-dashed border-white/10 rounded-3xl overflow-hidden touch-none relative h-64 shadow-inner">
                        <SignatureCanvas
                            ref={sigCanvas}
                            penColor="#308875"
                            canvasProps={{
                                className: "w-full h-full cursor-crosshair"
                            }}
                        />
                        <div className="absolute bottom-6 left-0 right-0 flex justify-center pointer-events-none">
                            <div className="w-48 h-px bg-white/5"></div>
                        </div>
                    </div>
                    <p className="text-[10px] text-text-secondary text-center leading-relaxed italic">
                        By signing, you acknowledge this is a legally binding buyer representation agreement protected by the Dwellingly framework.
                    </p>
                </div>
            </main>

            {/* Sticky Action */}
            <div className="fixed bottom-0 left-0 right-0 p-6 glass-panel border-t-0 border-x-0 rounded-none bg-background/80 backdrop-blur-xl z-50">
                <div className="max-w-xl mx-auto">
                    <button
                        onClick={handleSign}
                        className="w-full bg-primary hover:bg-primary-hover text-white font-bold h-16 rounded-2xl flex items-center justify-center gap-3 transition-all shadow-[0_-8px_30px_rgba(48,136,117,0.3)] group"
                    >
                        <ShieldCheck size={24} className="group-hover:scale-110 transition-transform" />
                        Execute Security Agreement
                    </button>
                </div>
            </div>
        </div>
    );
}
