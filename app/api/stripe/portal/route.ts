import { stripe } from '@/lib/stripe';
import { NextResponse } from 'next/server';

export async function POST() {
    // Mock user for Supabase bypass
    const mockCustomerId = 'cus_mock123';

    try {
        const session = await stripe.billingPortal.sessions.create({
            customer: mockCustomerId,
            return_url: `${process.env.NEXT_PUBLIC_SITE_URL}/billing`,
        });

        return NextResponse.json({ url: session.url });
    } catch (e: any) {
        return NextResponse.json({ error: e.message }, { status: 400 });
    }
}
