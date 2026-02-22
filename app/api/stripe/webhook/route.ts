import { stripe } from '@/lib/stripe';
import { headers } from 'next/headers';
import { NextResponse } from 'next/server';

export async function POST(req: Request) {
    const body = await req.text();
    const signature = (await headers()).get('Stripe-Signature') as string;

    let event;

    try {
        event = stripe.webhooks.constructEvent(
            body,
            signature,
            process.env.STRIPE_WEBHOOK_SECRET!
        );
    } catch (err: any) {
        return NextResponse.json({ error: `Webhook Error: ${err.message}` }, { status: 400 });
    }

    const subscription = event.data.object as any;
    const supabaseUUID = subscription.metadata.supabaseUUID;

    switch (event.type) {
        case 'customer.subscription.created':
        case 'customer.subscription.updated':
            // Mock DB Update: subscription_status = subscription.status
            break;
        case 'customer.subscription.deleted':
            // Mock DB Update: subscription_status = 'canceled'
            break;
    }

    return NextResponse.json({ received: true });
}
