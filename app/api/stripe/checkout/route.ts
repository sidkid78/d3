import { stripe } from '@/lib/stripe';
import { NextResponse } from 'next/server';

export async function POST(request: Request) {
    // Mock user for Supabase bypass
    const user = {
        id: 'mock-uuid-1234',
        email: 'agent@example.com'
    };

    // Create a new customer for the mock flow
    let customerId;
    const customer = await stripe.customers.create({
        email: user.email,
        metadata: { supabaseUUID: user.id },
    });
    customerId = customer.id;

    try {
        const session = await stripe.checkout.sessions.create({
            customer: customerId,
            billing_address_collection: 'auto',
            line_items: [
                {
                    price: process.env.STRIPE_PRICE_ID_AGENT_MONTHLY, // $29/mo Price ID
                    quantity: 1,
                },
            ],
            mode: 'subscription',
            success_url: `${process.env.NEXT_PUBLIC_SITE_URL}/dashboard?session_id={CHECKOUT_SESSION_ID}`,
            cancel_url: `${process.env.NEXT_PUBLIC_SITE_URL}/billing`,
            subscription_data: {
                metadata: { supabaseUUID: user.id },
            },
        });

        return NextResponse.json({ url: session.url });
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
