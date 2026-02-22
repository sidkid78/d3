import { Zap, ShieldCheck, Package, Users, Info, ChevronRight, Download, Filter, FileText, TrendingUp } from 'lucide-react';
import Link from 'next/link';

// Mock Data
const MOCK_STATS = {
    protected: 82500,
    uncertain: 145000,
    trend: 12
}

const MOCK_AGREEMENTS = [
    { id: '1', buyer_name: 'Jane Doe', type: 'Residential Buyer', date: 'Oct 24, 2023', commission: 12500, status: 'signed' },
    { id: '2', buyer_name: 'Michael Smith', type: 'Investor', date: 'Oct 22, 2023', commission: 18000, status: 'sent' },
    { id: '3', buyer_name: 'Emily White', type: 'First-time Buyer', date: 'Oct 20, 2023', commission: 9500, status: 'pending' },
    { id: '4', buyer_name: 'Robert Johnson', type: 'Luxury Buyer', date: 'Oct 15, 2023', commission: 45000, status: 'signed' },
]

export default function DashboardPage() {
    return (
        <div className="p-6 lg:p-10 max-w-[1600px] mx-auto w-full space-y-10">
            <header>
                <h1 className="text-4xl font-bold tracking-tight text-white mb-2">Command Center</h1>
                <p className="text-text-secondary">Manage your buyer agreements and commission status.</p>
            </header>

            <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
                {/* Quick Action Card */}
                <div className="xl:col-span-2 glass-panel rounded-2xl overflow-hidden flex flex-col md:flex-row">
                    <div className="flex-1 p-8 space-y-6">
                        <div className="flex items-center gap-2 text-primary">
                            <Zap className="fill-primary" size={20} />
                            <h2 className="text-lg font-bold text-white">Quick Action: Secure a Buyer</h2>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <label htmlFor="buyer-name" className="text-[10px] uppercase tracking-widest text-text-secondary font-bold">Buyer Name</label>
                                <input id="buyer-name" type="text" placeholder="Full Name" className="w-full bg-white/5 border border-glass-border p-3 rounded-xl focus:outline-none focus:ring-1 focus:ring-primary/50 text-white placeholder:text-white/20" />
                            </div>
                            <div className="space-y-2">
                                <label htmlFor="buyer-email" className="text-[10px] uppercase tracking-widest text-text-secondary font-bold">Email Address</label>
                                <input id="buyer-email" type="email" placeholder="client@example.com" className="w-full bg-white/5 border border-glass-border p-3 rounded-xl focus:outline-none focus:ring-1 focus:ring-primary/50 text-white placeholder:text-white/20" />
                            </div>
                        </div>
                        <Link href="/dashboard/agreements/new" className="bg-primary hover:bg-primary-hover text-white font-bold h-14 rounded-xl flex items-center justify-center gap-2 transition-all shadow-[0_0_20px_rgba(48,136,117,0.3)]">
                            <ShieldCheck size={20} />
                            Send Agreement Link
                        </Link>
                    </div>
                    <div className="w-full md:w-64 bg-white/2 border-l border-glass-border p-8 flex flex-col items-center justify-center text-center space-y-4">
                        <div className="w-14 h-14 bg-primary/10 rounded-full flex items-center justify-center text-primary border border-primary/20">
                            <ShieldCheck size={28} />
                        </div>
                        <h3 className="font-bold text-white">Compliance Ready</h3>
                        <p className="text-xs text-text-secondary leading-relaxed">All agreements are automatically updated to reflect the latest NAR settlement guidelines.</p>
                    </div>
                </div>

                {/* Stats Cards */}
                <div className="space-y-4">
                    <div className="glass-panel p-6 rounded-2xl border-l-4 border-l-primary relative overflow-hidden group">
                        <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity pointer-events-none">
                            <ShieldCheck size={80} />
                        </div>
                        <div className="flex items-center gap-2 text-text-secondary text-xs font-bold uppercase tracking-widest mb-4">
                            <Package size={14} className="text-primary" />
                            Protected Commission
                        </div>
                        <div className="text-4xl font-bold text-white mb-1">${MOCK_STATS.protected.toLocaleString()}</div>
                        <div className="text-xs text-emerald-400 font-bold flex items-center gap-1">
                            <TrendingUp size={12} /> +{MOCK_STATS.trend}% this month
                        </div>
                    </div>

                    <div className="glass-panel p-6 rounded-2xl border-l-4 border-l-orange-500/50 relative overflow-hidden group">
                        <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity pointer-events-none">
                            <Info size={80} />
                        </div>
                        <div className="flex items-center gap-2 text-text-secondary text-xs font-bold uppercase tracking-widest mb-4">
                            <Users size={14} className="text-orange-500" />
                            Uncertain Commission
                        </div>
                        <div className="text-4xl font-bold text-white mb-1">${MOCK_STATS.uncertain.toLocaleString()}</div>
                        <div className="text-xs text-text-secondary font-medium">Pending signatures</div>
                    </div>
                </div>
            </div>

            {/* Pipeline Table */}
            <div className="space-y-6">
                <div className="flex justify-between items-center">
                    <h2 className="text-2xl font-bold text-white">Transaction Pipeline</h2>
                    <div className="flex gap-2">
                        <button className="flex items-center gap-2 px-4 py-2 rounded-lg bg-white/5 border border-glass-border text-sm font-medium hover:bg-white/10 transition-colors">
                            <Filter size={16} /> Filter
                        </button>
                        <button className="flex items-center gap-2 px-4 py-2 rounded-lg bg-white/5 border border-glass-border text-sm font-medium hover:bg-white/10 transition-colors">
                            <Download size={16} /> Export
                        </button>
                    </div>
                </div>

                <div className="glass-panel rounded-2xl overflow-hidden border border-glass-border">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left">
                            <thead>
                                <tr className="bg-white/2 text-[10px] uppercase tracking-widest text-text-secondary font-bold">
                                    <th className="px-6 py-4">Buyer Name</th>
                                    <th className="px-6 py-4">Agreement Status</th>
                                    <th className="px-6 py-4">Date Sent</th>
                                    <th className="px-6 py-4">Est. Commission</th>
                                    <th className="px-6 py-4">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-glass-border">
                                {MOCK_AGREEMENTS.map((ag) => (
                                    <tr key={ag.id} className="hover:bg-white/2 transition-colors group">
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-3">
                                                <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold text-xs">
                                                    {ag.buyer_name.split(' ').map(n => n[0]).join('')}
                                                </div>
                                                <div className="flex flex-col">
                                                    <span className="text-white font-bold">{ag.buyer_name}</span>
                                                    <span className="text-xs text-text-secondary">{ag.type}</span>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${ag.status === 'signed' ? 'bg-green-500/10 text-green-500 border border-green-500/20' :
                                                ag.status === 'sent' ? 'bg-orange-500/10 text-orange-500 border border-orange-500/20' :
                                                    'bg-white/5 text-text-secondary border border-glass-border'
                                                }`}>
                                                <div className={`w-1.5 h-1.5 rounded-full ${ag.status === 'signed' ? 'bg-green-500' :
                                                    ag.status === 'sent' ? 'bg-orange-500' :
                                                        'bg-text-secondary'
                                                    }`} />
                                                {ag.status}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-sm text-text-secondary">{ag.date}</td>
                                        <td className="px-6 py-4 font-bold text-white">${ag.commission.toLocaleString()}</td>
                                        <td className="px-6 py-4 text-right">
                                            {ag.status === 'signed' ? (
                                                <Link href={`/verify/${ag.id}`} className="inline-flex items-center gap-2 text-xs font-bold text-primary hover:text-primary-hover">
                                                    <ShieldCheck size={14} /> View Certificate
                                                </Link>
                                            ) : ag.status === 'sent' ? (
                                                <button className="inline-flex items-center gap-2 text-xs font-bold text-text-secondary hover:text-white">
                                                    <FileText size={14} /> Resend Link
                                                </button>
                                            ) : (
                                                <button className="inline-flex items-center gap-2 text-xs font-bold text-text-secondary hover:text-white">
                                                    <Download size={14} /> Edit Draft
                                                </button>
                                            )}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    );
}
