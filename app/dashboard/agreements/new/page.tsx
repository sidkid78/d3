'use client';
import { useState } from 'react';
import { ShieldCheck, ArrowRight, User, Mail, DollarSign, Calendar, Info, FileText, CheckCircle } from 'lucide-react';
import Link from 'next/link';

export default function NewAgreementPage() {
    const [step, setStep] = useState(1);
    const [formData, setFormData] = useState({
        buyerName: '',
        buyerEmail: '',
        commissionRate: '2.5',
        expirationDate: '',
        propertyType: 'residential'
    });

    const [isSuccess, setIsSuccess] = useState(false);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setIsSuccess(true);
    };

    if (isSuccess) {
        return (
            <div className="p-6 lg:p-10 max-w-2xl mx-auto w-full h-full flex flex-col items-center justify-center text-center space-y-6">
                <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center text-primary border border-primary/20 animate-bounce">
                    <CheckCircle size={40} />
                </div>
                <h1 className="text-3xl font-bold text-white tracking-tight">Agreement Sent!</h1>
                <p className="text-text-secondary leading-relaxed">
                    We've sent a secure, legally-binding representation link to <span className="text-white font-bold">{formData.buyerEmail}</span>.
                    You'll be notified as soon as they sign.
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 w-full pt-6">
                    <Link href="/dashboard" className="glass-panel p-4 rounded-xl font-bold text-white hover:bg-white/5 transition-all flex items-center justify-center gap-2">
                        Back to Dashboard
                    </Link>
                    <button onClick={() => setIsSuccess(false)} className="bg-primary p-4 rounded-xl font-bold text-white hover:bg-primary-hover transition-all flex items-center justify-center gap-2">
                        Create Another
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="p-6 lg:p-10 max-w-4xl mx-auto w-full space-y-10">
            <header className="space-y-4">
                <Link href="/dashboard" className="text-xs font-bold text-text-secondary hover:text-primary transition-colors flex items-center gap-1 uppercase tracking-widest">
                    <ArrowRight className="rotate-180" size={14} /> Back to Dashboard
                </Link>
                <h1 className="text-4xl font-bold tracking-tight text-white">Create Commission Certificate™</h1>
                <p className="text-text-secondary">Securing your representation in the post-settlement landscape.</p>
            </header>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
                <div className="lg:col-span-2 space-y-8">
                    <form onSubmit={handleSubmit} className="glass-panel rounded-2xl p-8 space-y-8 border-l-4 border-l-primary">
                        {/* Process Indicator */}
                        <div className="flex items-center gap-4">
                            <div className="w-8 h-8 rounded-full bg-primary/20 border border-primary/40 flex items-center justify-center text-primary font-bold text-sm">1</div>
                            <div className="h-px flex-1 bg-glass-border"></div>
                            <div className="w-8 h-8 rounded-full bg-white/5 border border-glass-border flex items-center justify-center text-text-secondary font-bold text-sm">2</div>
                        </div>

                        <div className="space-y-6">
                            <h2 className="text-xl font-bold text-white flex items-center gap-2">
                                <User className="text-primary" size={20} />
                                Buyer Information
                            </h2>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <label htmlFor="buyerName" className="text-[10px] uppercase tracking-widest text-text-secondary font-bold">Legal Name</label>
                                    <div className="relative">
                                        <input
                                            id="buyerName"
                                            required
                                            type="text"
                                            value={formData.buyerName}
                                            onChange={(e) => setFormData({ ...formData, buyerName: e.target.value })}
                                            placeholder="John Q. Client"
                                            className="w-full bg-white/5 border border-glass-border p-3 rounded-xl focus:outline-none focus:ring-1 focus:ring-primary/50 text-white placeholder:text-white/20 pl-10"
                                        />
                                        <User className="absolute left-3 top-3.5 text-text-secondary" size={16} />
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <label htmlFor="buyerEmail" className="text-[10px] uppercase tracking-widest text-text-secondary font-bold">Email Address</label>
                                    <div className="relative">
                                        <input
                                            id="buyerEmail"
                                            required
                                            type="email"
                                            value={formData.buyerEmail}
                                            onChange={(e) => setFormData({ ...formData, buyerEmail: e.target.value })}
                                            placeholder="client@email.com"
                                            className="w-full bg-white/5 border border-glass-border p-3 rounded-xl focus:outline-none focus:ring-1 focus:ring-primary/50 text-white placeholder:text-white/20 pl-10"
                                        />
                                        <Mail className="absolute left-3 top-3.5 text-text-secondary" size={16} />
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="space-y-6">
                            <h2 className="text-xl font-bold text-white flex items-center gap-2">
                                <FileText className="text-primary" size={20} />
                                representation Terms
                            </h2>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <label htmlFor="commissionRate" className="text-[10px] uppercase tracking-widest text-text-secondary font-bold">Buyer Broker Commission (%)</label>
                                    <div className="relative">
                                        <input
                                            id="commissionRate"
                                            required
                                            type="number"
                                            step="0.1"
                                            value={formData.commissionRate}
                                            onChange={(e) => setFormData({ ...formData, commissionRate: e.target.value })}
                                            className="w-full bg-white/5 border border-glass-border p-3 rounded-xl focus:outline-none focus:ring-1 focus:ring-primary/50 text-white placeholder:text-white/20 pl-10"
                                        />
                                        <DollarSign className="absolute left-3 top-3.5 text-text-secondary" size={16} />
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <label htmlFor="expirationDate" className="text-[10px] uppercase tracking-widest text-text-secondary font-bold">Agreement Expiration</label>
                                    <div className="relative">
                                        <input
                                            id="expirationDate"
                                            required
                                            type="date"
                                            value={formData.expirationDate}
                                            onChange={(e) => setFormData({ ...formData, expirationDate: e.target.value })}
                                            className="w-full bg-white/5 border border-glass-border p-3 rounded-xl focus:outline-none focus:ring-1 focus:ring-primary/50 text-white placeholder:text-white/20 pl-10"
                                        />
                                        <Calendar className="absolute left-3 top-3.5 text-text-secondary" size={16} />
                                    </div>
                                </div>
                            </div>
                        </div>

                        <button
                            type="submit"
                            className="w-full bg-primary hover:bg-primary-hover text-white font-bold h-14 rounded-xl flex items-center justify-center gap-2 transition-all shadow-[0_0_20px_rgba(48,136,117,0.3)] mt-8"
                        >
                            <ShieldCheck size={20} />
                            Generate & Send Agreement
                        </button>
                    </form>
                </div>

                <div className="space-y-6">
                    <div className="glass-panel p-8 rounded-[2.5rem] border border-white/10 space-y-8 shadow-2xl relative overflow-hidden group bg-linear-to-br from-primary/5 to-transparent">
                        <h3 className="text-sm font-bold text-white mb-4 flex items-center gap-2">
                            <Info size={16} className="text-primary" />
                            Why this matters
                        </h3>
                        <p className="text-xs text-text-secondary leading-relaxed mb-4">
                            Per the NAR settlement, buyer agents MUST have a written agreement before showing any properties.
                        </p>
                        <div className="p-3 bg-white/5 rounded-xl border border-glass-border">
                            <p className="text-[10px] text-text-secondary italic uppercase tracking-wider font-bold mb-1">Key Compliance Point:</p>
                            <p className="text-[10px] text-white/50 leading-tight">Agreements must be objectively ascertainable and not open-ended (e.g. "whatever seller pays").</p>
                        </div>
                    </div>

                    <div className="p-6 rounded-2xl bg-gradient-to-br from-primary/10 to-transparent border border-primary/20">
                        <h3 className="text-sm font-bold text-white mb-2">Immutable Verification</h3>
                        <p className="text-xs text-text-secondary leading-relaxed">
                            Every signature generates a unique cryptographic hash that is recorded in our infrastructure, making it indisputable during closing.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}
