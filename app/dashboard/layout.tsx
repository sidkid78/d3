import { ReactNode } from 'react';
import Link from 'next/link';
import { LayoutDashboard, FileText, Users, Landmark, Settings, ShieldCheck, Bell, User } from 'lucide-react';

export default function DashboardLayout({ children }: { children: ReactNode }) {
    return (
        <div className="min-h-screen bg-background text-white flex font-space selection:bg-primary">
            {/* Sidebar */}
            <aside className="w-64 bg-[#050505] border-r border-glass-border hidden md:flex flex-col sticky top-0 h-screen">
                <div className="p-6 border-b border-glass-border">
                    <Link href="/dashboard" className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center border border-primary/20">
                            <ShieldCheck className="text-primary w-6 h-6" />
                        </div>
                        <div className="flex flex-col">
                            <span className="text-lg font-bold leading-tight">Dwellingly</span>
                            <span className="text-[10px] uppercase tracking-widest text-text-secondary font-bold">Agent Portal</span>
                        </div>
                    </Link>
                </div>

                <nav className="flex-1 p-4 space-y-2 mt-4">
                    <Link href="/dashboard" className="flex items-center gap-3 p-3 rounded-xl bg-primary/10 text-primary border border-primary/20 font-bold transition-all shadow-[0_0_15px_rgba(48,136,117,0.1)]">
                        <LayoutDashboard size={20} />
                        Command Center
                    </Link>
                    <Link href="/dashboard/agreements/new" className="flex items-center gap-3 p-3 rounded-xl hover:bg-white/5 text-text-secondary hover:text-white transition-all font-medium">
                        <FileText size={20} />
                        Agreements
                    </Link>
                    <Link href="#" className="flex items-center gap-3 p-3 rounded-xl hover:bg-white/5 text-text-secondary hover:text-white transition-all font-medium">
                        <Users size={20} />
                        Contacts
                    </Link>
                    <Link href="#" className="flex items-center gap-3 p-3 rounded-xl hover:bg-white/5 text-text-secondary hover:text-white transition-all font-medium">
                        <Landmark size={20} />
                        Commissions
                    </Link>
                </nav>

                <div className="p-4 border-t border-glass-border space-y-4">
                    <Link href="/dashboard/settings" className="flex items-center gap-3 p-3 rounded-xl hover:bg-white/5 text-text-secondary hover:text-white transition-all font-medium">
                        <Settings size={20} />
                        Settings
                    </Link>
                    <div className="p-3 bg-white/5 rounded-xl border border-glass-border flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center text-primary">
                            <User size={16} />
                        </div>
                        <div className="flex flex-col min-w-0">
                            <span className="text-sm font-bold truncate">Alex Morgan</span>
                            <span className="text-[10px] text-text-secondary truncate">Top Agent</span>
                        </div>
                    </div>
                </div>
            </aside>

            {/* Main Content */}
            <main className="flex-1 flex flex-col relative min-w-0 h-screen overflow-y-auto">
                <header className="sticky top-0 z-40 bg-background/80 backdrop-blur-md border-b border-glass-border p-4 flex justify-between items-center md:justify-end gap-4">
                    <div className="md:hidden flex items-center gap-3">
                        <ShieldCheck className="text-primary w-6 h-6" />
                        <span className="font-bold">Dwellingly</span>
                    </div>
                    <div className="flex items-center gap-4">
                        <button aria-label="Notifications" className="p-2 rounded-full hover:bg-white/5 text-text-secondary transition-colors">
                            <Bell size={20} />
                        </button>
                        <div className="h-6 w-px bg-glass-border" />
                        <div className="flex items-center gap-2 px-3 py-1 bg-green-500/10 rounded-full border border-green-500/20">
                            <div className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
                            <span className="text-[10px] font-bold text-green-500 uppercase tracking-widest">System Operational</span>
                        </div>
                    </div>
                </header>
                <div className="flex-1 relative z-10">
                    {children}
                </div>
            </main>
        </div>
    );
}
