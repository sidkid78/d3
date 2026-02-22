import { CheckCircle2, ShieldCheck, CreditCard, Clock, ArrowRight } from 'lucide-react';
import Link from 'next/link';

export default function BillingPage() {
    return (
        <div className="p-6 lg:p-10 max-w-4xl mx-auto w-full space-y-10">
            <header className="space-y-2">
                <Link href="/dashboard" className="text-xs font-bold text-text-secondary hover:text-primary transition-colors flex items-center gap-1 uppercase tracking-widest">
                    <ArrowRight className="rotate-180" size={14} /> Back to Dashboard
                </Link>
                <h1 className="text-4xl font-bold tracking-tight text-white">Billing & Subscription</h1>
                <p className="text-text-secondary">Manage your professional commission protection plan.</p>
            </header>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
                {/* Active Plan */}
                <div className="glass-panel rounded-3xl p-8 space-y-8 border-l-4 border-l-primary relative overflow-hidden">
                    <div className="absolute top-0 right-0 p-8 opacity-5 pointer-events-none">
                        <ShieldCheck size={120} />
                    </div>

                    <div className="space-y-4 relative z-10">
                        <div className="inline-flex items-center gap-2 px-3 py-1 bg-primary/10 rounded-full border border-primary/20 text-primary text-[10px] font-bold uppercase tracking-widest">
                            Current Plan
                        </div>
                        <h2 className="text-3xl font-bold text-white">Standard Agent</h2>
                        <div className="flex items-baseline gap-1">
                            <span className="text-4xl font-bold text-white">$49</span>
                            <span className="text-text-secondary">/month</span>
                        </div>
                    </div>

                    <div className="space-y-4 relative z-10">
                        {[
                            "Unlimited Representation Certificates",
                            "E2EE Immutable Storage",
                            "Real-time Buyer Verification",
                            "Professional Compliance Support"
                        ].map((feature, i) => (
                            <div key={i} className="flex items-center gap-3 text-sm text-text-secondary">
                                <CheckCircle2 size={18} className="text-primary shrink-0" />
                                {feature}
                            </div>
                        ))}
                    </div>

                    <button className="w-full glass-panel hover:bg-white/5 text-white font-bold h-14 rounded-xl transition-all relative z-10">
                        Manage Plan
                    </button>
                </div>

                {/* Billing Details */}
                <div className="space-y-6">
                    <div className="glass-panel p-6 rounded-3xl border border-white/5 space-y-6">
                        <h3 className="text-sm font-bold text-white flex items-center gap-2">
                            <CreditCard size={18} className="text-primary" />
                            Payment Method
                        </h3>
                        <div className="flex items-center justify-between p-4 bg-white/5 rounded-2xl border border-glass-border">
                            <div className="flex items-center gap-4">
                                <div className="w-12 h-8 bg-white/10 rounded border border-white/20 flex items-center justify-center">
                                    <span className="text-[10px] font-bold text-white">VISA</span>
                                </div>
                                <div>
                                    <p className="text-sm font-bold text-white">•••• 4242</p>
                                    <p className="text-[10px] text-text-secondary">Expires 12/26</p>
                                </div>
                            </div>
                            <button className="text-xs font-bold text-primary hover:underline">Edit</button>
                        </div>
                    </div>

                    <div className="glass-panel p-6 rounded-3xl border border-white/5 space-y-6">
                        <h3 className="text-sm font-bold text-white flex items-center gap-2">
                            <Clock size={18} className="text-primary" />
                            Recent Invoices
                        </h3>
                        <div className="space-y-4">
                            {[
                                { date: "Oct 1, 2024", amount: "$49.00", status: "Paid" },
                                { date: "Sep 1, 2024", amount: "$49.00", status: "Paid" }
                            ].map((invoice, i) => (
                                <div key={i} className="flex items-center justify-between py-2 border-b border-white/5 last:border-0">
                                    <div>
                                        <p className="text-sm font-bold text-white">{invoice.date}</p>
                                        <p className="text-[10px] text-text-secondary">{invoice.status}</p>
                                    </div>
                                    <p className="text-sm font-bold text-white">{invoice.amount}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
