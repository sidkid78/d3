import { User, Bell, Briefcase, Lock, ArrowRight, ShieldCheck, Mail, Percent } from 'lucide-react';
import Link from 'next/link';

export default function SettingsPage() {
    return (
        <div className="p-6 lg:p-10 max-w-5xl mx-auto w-full space-y-10">
            <header className="space-y-2">
                <Link href="/dashboard" className="text-xs font-bold text-text-secondary hover:text-primary transition-colors flex items-center gap-1 uppercase tracking-widest">
                    <ArrowRight className="rotate-180" size={14} /> Back to Dashboard
                </Link>
                <h1 className="text-4xl font-bold tracking-tight text-white">Account Settings</h1>
                <p className="text-text-secondary">Manage your agent profile and global preferences.</p>
            </header>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
                {/* Main Settings Area */}
                <div className="lg:col-span-2 space-y-8">
                    {/* Personal Info */}
                    <div className="glass-panel rounded-3xl p-8 space-y-8 border border-white/5">
                        <h2 className="text-xl font-bold text-white flex items-center gap-2">
                            <User className="text-primary" size={20} />
                            Personal Information
                        </h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-2">
                                <label htmlFor="firstName" className="text-[10px] uppercase tracking-widest text-text-secondary font-bold">First Name</label>
                                <input
                                    id="firstName"
                                    type="text"
                                    defaultValue="Agent"
                                    placeholder="Your first name"
                                    className="w-full bg-white/5 border border-glass-border p-3 rounded-xl focus:outline-none focus:ring-1 focus:ring-primary/50 text-white placeholder:text-white/20"
                                />
                            </div>
                            <div className="space-y-2">
                                <label htmlFor="lastName" className="text-[10px] uppercase tracking-widest text-text-secondary font-bold">Last Name</label>
                                <input
                                    id="lastName"
                                    type="text"
                                    defaultValue="Smith"
                                    placeholder="Your last name"
                                    className="w-full bg-white/5 border border-glass-border p-3 rounded-xl focus:outline-none focus:ring-1 focus:ring-primary/50 text-white placeholder:text-white/20"
                                />
                            </div>
                            <div className="md:col-span-2 space-y-2">
                                <label htmlFor="email" className="text-[10px] uppercase tracking-widest text-text-secondary font-bold">Email Address (Primary)</label>
                                <div className="relative">
                                    <input
                                        id="email"
                                        type="email"
                                        defaultValue="agent@example.com"
                                        disabled
                                        placeholder="agent@example.com"
                                        className="w-full bg-white/5 border border-glass-border p-3 rounded-xl text-white/40 cursor-not-allowed pl-10"
                                    />
                                    <Mail className="absolute left-3 top-3.5 text-white/20" size={16} />
                                </div>
                                <p className="text-[10px] text-text-secondary italic">Contact support to change your primary account email.</p>
                            </div>
                        </div>
                        <button className="bg-primary hover:bg-primary-hover text-white font-bold px-8 py-3 rounded-xl transition-all shadow-[0_0_15px_rgba(48,136,117,0.3)]">
                            Save Profile
                        </button>
                    </div>

                    {/* Professional Details */}
                    <div className="glass-panel rounded-3xl p-8 space-y-8 border border-white/5">
                        <h2 className="text-xl font-bold text-white flex items-center gap-2">
                            <Briefcase className="text-primary" size={20} />
                            Professional Infrastructure
                        </h2>
                        <div className="space-y-6">
                            <div className="space-y-2">
                                <label htmlFor="brokerage" className="text-[10px] uppercase tracking-widest text-text-secondary font-bold">Brokerage / Firm Name</label>
                                <input
                                    id="brokerage"
                                    type="text"
                                    defaultValue="Modern Realty Group"
                                    placeholder="e.g. Compass, Keller Williams"
                                    className="w-full bg-white/5 border border-glass-border p-3 rounded-xl focus:outline-none focus:ring-1 focus:ring-primary/50 text-white placeholder:text-white/20"
                                />
                            </div>
                            <div className="space-y-2">
                                <label htmlFor="defaultCommission" className="text-[10px] uppercase tracking-widest text-text-secondary font-bold">Default Commission Protocol (%)</label>
                                <div className="relative">
                                    <input
                                        id="defaultCommission"
                                        type="number"
                                        step="0.1"
                                        defaultValue="2.5"
                                        placeholder="2.5"
                                        className="w-full bg-white/5 border border-glass-border p-3 rounded-xl focus:outline-none focus:ring-1 focus:ring-primary/50 text-white placeholder:text-white/20 pl-10"
                                    />
                                    <Percent className="absolute left-3 top-3.5 text-text-secondary" size={16} />
                                </div>
                                <p className="text-[10px] text-text-secondary italic">This will be the default rate for new agreements.</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Sidebar Controls */}
                <div className="space-y-6">
                    <div className="glass-panel p-6 rounded-3xl border border-white/5 space-y-6">
                        <h3 className="text-sm font-bold text-white flex items-center gap-2">
                            <Bell size={18} className="text-primary" />
                            Notifications
                        </h3>
                        <div className="space-y-4">
                            {[
                                { label: "Agreement Signed", desc: "When a buyer executes a certificate" },
                                { label: "Security Alerts", desc: "Critical account security events" }
                            ].map((item, i) => (
                                <div key={i} className="flex items-start justify-between">
                                    <div className="space-y-0.5">
                                        <p className="text-xs font-bold text-white">{item.label}</p>
                                        <p className="text-[10px] text-text-secondary leading-tight">{item.desc}</p>
                                    </div>
                                    <div className="w-8 h-4 bg-primary/20 rounded-full relative border border-primary/40">
                                        <div className="absolute right-0.5 top-0.5 w-2.5 h-2.5 bg-primary rounded-full"></div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="glass-panel p-6 rounded-3xl border border-white/5 space-y-6">
                        <h3 className="text-sm font-bold text-white flex items-center gap-2">
                            <Lock size={18} className="text-primary" />
                            Account Security
                        </h3>
                        <div className="space-y-4">
                            <button className="w-full text-left p-4 rounded-2xl bg-white/5 border border-white/10 hover:bg-white/10 transition-colors text-xs font-bold text-white">
                                Update Password
                            </button>
                            <div className="p-4 bg-emerald-500/5 rounded-2xl border border-emerald-500/20 flex items-center gap-3">
                                <ShieldCheck className="text-emerald-500" size={16} />
                                <span className="text-[10px] font-bold text-emerald-500 uppercase tracking-widest">2FA Enabled</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
