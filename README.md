# Dwellingly - Commission Infrastructure™

**Dwellingly** is a premium "Commission Infrastructure" layer designed to protect real estate income in the post-NAR settlement era. It transitions agents from an implicit model to an explicit, verifiable digital standard for income protection.

## ✨ "Liquid Glass" Aesthetic

The platform features a state-of-the-art **Liquid Glass** theme, built with:

- **Glassmorphism**: Translucent panels with multi-layered backdrops.
- **Ambient Lighting**: Dynamic, blurred glows that follow the layout.
- **Space Grotesk Typography**: A clean, high-precision font for a professional "Infrastructure" feel.
- **Professional Accents**: A curated emerald primary color (`#308875`) representing security and growth.

## 🚀 Key Features

- **30-Second Handshake**: Initiate and sign representation agreements in under a minute, directly on mobile.
- **Commission Certificates**: Immutable PDF certificates generated via Gemini AI and jsPDF.
- **Public Verification**: A secure endpoint (`/verify/[id]`) for Title Companies and Listing Agents to validate agreements via QR/ID.
- **Premium Command Center**: A high-performance dashboard with real-time tracking (Sent | Signed | Pending).
- **Economic Shield**: Integrated billing and subscription management via Stripe.

## 🛠 Technical Stack

- **Framework**: [Next.js 16](https://nextjs.org/) (App Router)
- **Styling**: [Tailwind CSS v4](https://tailwindcss.com/) (Vanilla CSS + Modern Utilities)
- **Backend/Auth**: [Supabase](https://supabase.com/) (PostgreSQL + RLS + SSR Client)
- **AI/LLM**: [Google GenAI SDK](https://ai.google.dev/gemini-api/docs) (`gemini-3-flash-preview`)
- **PDF Generation**: [jsPDF](https://rawgit.com/MrRio/jsPDF/master/docs/index.html)
- **Payments**: [Stripe](https://stripe.com/)

## 🏗 Development Status

The project is currently in the late "UI Polish" phase.

- **Supabase Bypass**: For ease of local prototyping, a `SUPABASE_BYPASS` mode is active, allowing full UI development without a live backend.
- **Production Ready**: The architecture is set up for high performance, mobile-first responsiveness, and standard compliance.

## 📖 Getting Started

1. **Install Dependencies**:

   ```bash
   pnpm install
   ```

2. **Environment Variables**:
   Copy `.env.example` to `.env.local` and fill in your credentials (or keep bypass enabled).

3. **Run Development Server**:

   ```bash
   pnpm dev
   ```

Open [http://localhost:3000](http://localhost:3000) to view the platform.
