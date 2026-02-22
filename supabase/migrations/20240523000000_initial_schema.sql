-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. ENUMS FOR STATE MANAGEMENT
CREATE TYPE agreement_status AS ENUM ('sent', 'signed', 'pending', 'expired');
CREATE TYPE subscription_status AS ENUM ('trialing', 'active', 'canceled', 'incomplete');

-- 2. PROFILES (AGENTS)
-- Extends Supabase Auth.users
CREATE TABLE profiles (
    id UUID REFERENCES auth.users ON DELETE CASCADE PRIMARY KEY,
    full_name TEXT NOT NULL,
    email TEXT UNIQUE NOT NULL,
    brokerage_name TEXT,
    license_number TEXT,
    stripe_customer_id TEXT,
    subscription_status subscription_status DEFAULT 'trialing',
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. AGREEMENTS (THE CORE TRANSACTION)
CREATE TABLE agreements (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    agent_id UUID REFERENCES profiles(id) NOT NULL,
    
    -- Buyer Info (Ephemeral/Lightweight)
    buyer_name TEXT NOT NULL,
    buyer_email TEXT NOT NULL,
    buyer_phone TEXT,
    
    -- Terms (TREC 1501 Alignment)
    commission_percentage DECIMAL(5,2),
    commission_flat_fee DECIMAL(12,2),
    duration_months INTEGER DEFAULT 6,
    terms_accepted_at TIMESTAMPTZ,
    
    -- State Machine
    status agreement_status DEFAULT 'sent',
    
    -- Security: Unique token for the mobile signing link (No account required)
    signing_token UUID DEFAULT uuid_generate_v4() UNIQUE,
    
    created_at TIMESTAMPTZ DEFAULT NOW(),
    signed_at TIMESTAMPTZ,
    expires_at TIMESTAMPTZ
);

-- 4. CERTIFICATES (THE VERIFICATION LAYER)
CREATE TABLE certificates (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    agreement_id UUID REFERENCES agreements(id) ON DELETE CASCADE UNIQUE,
    
    -- Unique ID for Title Company Verification (Human Readable)
    verification_code TEXT UNIQUE NOT NULL, -- e.g., DW-XXXX-XXXX
    
    pdf_storage_path TEXT, -- Path in Supabase Storage
    blockchain_hash TEXT,   -- Optional: For future proof of immutability
    
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexing for Dashboard Performance
CREATE INDEX idx_agreements_agent_status ON agreements(agent_id, status);
CREATE INDEX idx_agreements_signing_token ON agreements(signing_token);
CREATE INDEX idx_certificates_verification_code ON certificates(verification_code);

-- Enable RLS
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE agreements ENABLE ROW LEVEL SECURITY;
ALTER TABLE certificates ENABLE ROW LEVEL SECURITY;

-- PROFILES: Agents can only view/edit their own profile
CREATE POLICY "Agents can manage own profile" 
ON profiles FOR ALL 
USING (auth.uid() = id);

-- AGREEMENTS: 
-- 1. Agents can manage their own agreements
CREATE POLICY "Agents manage own agreements" 
ON agreements FOR ALL 
USING (auth.uid() = agent_id);

-- 2. Buyers can view/update via signing_token (The "Handshake" bypass)
CREATE POLICY "Buyers can view agreement via token" 
ON agreements FOR SELECT 
USING (true); -- Filtered in application logic by signing_token

CREATE POLICY "Buyers can sign agreement via token" 
ON agreements FOR UPDATE 
USING (true)
WITH CHECK (status = 'sent');

-- CERTIFICATES:
-- 1. Agents can view their certificates
CREATE POLICY "Agents view own certificates" 
ON certificates FOR SELECT 
USING (EXISTS (
    SELECT 1 FROM agreements 
    WHERE agreements.id = certificates.agreement_id 
    AND agreements.agent_id = auth.uid()
));

-- 2. Public/Title Verification (Read-only via verification_code)
CREATE POLICY "Public verification access" 
ON certificates FOR SELECT 
USING (true);

-- Automation: Profile Creation
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger AS $$
BEGIN
  INSERT INTO public.profiles (id, full_name, email)
  VALUES (new.id, new.raw_user_meta_data->>'full_name', new.email);
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();

-- Supabase Storage Setup insert
INSERT INTO storage.buckets (id, name, public) VALUES ('commission-certificates', 'commission-certificates', false) ON CONFLICT DO NOTHING;

-- RLS Policy for Storage
CREATE POLICY "Agents can access own certificate PDFs"
ON storage.objects FOR SELECT
USING (
    bucket_id = 'commission-certificates' 
    AND (storage.foldername(name))[1] = auth.uid()::text
);
