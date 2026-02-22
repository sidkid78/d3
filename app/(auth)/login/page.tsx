'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';

export default function LoginPage() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const router = useRouter();

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        // Mock login
        await new Promise(resolve => setTimeout(resolve, 500));
        router.push('/dashboard');
        setLoading(false);
    };

    const handleSignUp = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        // Mock sign up
        await new Promise(resolve => setTimeout(resolve, 500));
        alert('Check your email for the confirmation link!');
        setLoading(false);
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
            <div className="max-w-md w-full bg-white rounded-xl shadow-lg p-8">
                <h2 className="text-2xl font-bold text-center mb-6">Agent Login</h2>
                <form className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Email</label>
                        <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm border p-2 focus:border-blue-500 focus:ring-blue-500"
                            required
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Password</label>
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm border p-2 focus:border-blue-500 focus:ring-blue-500"
                            required
                        />
                    </div>
                    <div className="flex gap-4 pt-4">
                        <button
                            onClick={handleLogin}
                            disabled={loading}
                            className="w-full bg-blue-600 text-white rounded-md p-2 font-semibold hover:bg-blue-700 transition"
                        >
                            Sign In
                        </button>
                        <button
                            onClick={handleSignUp}
                            disabled={loading}
                            className="w-full bg-gray-200 text-gray-900 rounded-md p-2 font-semibold hover:bg-gray-300 transition"
                        >
                            Sign Up
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
