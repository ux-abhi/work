-- Profiles table
CREATE TABLE profiles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    slug VARCHAR(50) NOT NULL UNIQUE,
    display_name VARCHAR(100) NOT NULL,
    avatar_url TEXT,
    persona VARCHAR(20) NOT NULL CHECK (persona IN ('individual', 'business')),
    template_id VARCHAR(50) NOT NULL DEFAULT 'minimal-light',
    is_published BOOLEAN NOT NULL DEFAULT false,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    CONSTRAINT slug_format CHECK (slug ~ '^[a-z0-9][a-z0-9-]{2,48}[a-z0-9]$')
);

CREATE UNIQUE INDEX idx_profiles_user_id ON profiles(user_id);
CREATE INDEX idx_profiles_slug ON profiles(slug);

-- Blocks table
CREATE TABLE blocks (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    profile_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
    type VARCHAR(30) NOT NULL CHECK (type IN (
        'link', 'text', 'social', 'contact',
        'product', 'testimonial', 'resume', 'portfolio'
    )),
    position INTEGER NOT NULL DEFAULT 0,
    is_active BOOLEAN NOT NULL DEFAULT true,
    props JSONB NOT NULL DEFAULT '{}',
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_blocks_profile_id ON blocks(profile_id);
CREATE INDEX idx_blocks_profile_position ON blocks(profile_id, position);

-- Events table (analytics)
CREATE TABLE events (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    profile_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
    type VARCHAR(30) NOT NULL CHECK (type IN ('page_view', 'link_click', 'qr_scan')),
    block_id UUID REFERENCES blocks(id) ON DELETE SET NULL,
    metadata JSONB DEFAULT '{}',
    ip_hash VARCHAR(64),
    user_agent TEXT,
    referrer TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_events_profile_created ON events(profile_id, created_at DESC);
CREATE INDEX idx_events_type ON events(type);

-- Templates table
CREATE TABLE templates (
    id VARCHAR(50) PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    styles JSONB NOT NULL DEFAULT '{}'
);

INSERT INTO templates (id, name, styles) VALUES
('minimal-light', 'Minimal Light', '{"background":"#ffffff","text":"#1a1a1a","accent":"#0066cc","cardBg":"#f5f5f5","radius":"8px"}'),
('minimal-dark', 'Minimal Dark', '{"background":"#1a1a1a","text":"#ffffff","accent":"#66b3ff","cardBg":"#2d2d2d","radius":"8px"}');

-- Reserved slugs
CREATE TABLE reserved_slugs (
    slug VARCHAR(50) PRIMARY KEY
);

INSERT INTO reserved_slugs (slug) VALUES
('admin'),('api'),('app'),('dashboard'),('login'),('signup'),
('settings'),('help'),('support'),('about'),('pricing'),
('terms'),('privacy'),('qr'),('u'),('q');

-- Row Level Security
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE blocks ENABLE ROW LEVEL SECURITY;
ALTER TABLE events ENABLE ROW LEVEL SECURITY;

-- Profiles policies
CREATE POLICY "Public profiles are viewable" ON profiles FOR SELECT USING (is_published = true);
CREATE POLICY "Users can view own profile" ON profiles FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own profile" ON profiles FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own profile" ON profiles FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete own profile" ON profiles FOR DELETE USING (auth.uid() = user_id);

-- Blocks policies
CREATE POLICY "Public blocks are viewable" ON blocks FOR SELECT USING (
    EXISTS (SELECT 1 FROM profiles WHERE profiles.id = blocks.profile_id AND profiles.is_published = true)
);
CREATE POLICY "Users can view own blocks" ON blocks FOR SELECT USING (
    EXISTS (SELECT 1 FROM profiles WHERE profiles.id = blocks.profile_id AND profiles.user_id = auth.uid())
);
CREATE POLICY "Users can insert own blocks" ON blocks FOR INSERT WITH CHECK (
    EXISTS (SELECT 1 FROM profiles WHERE profiles.id = blocks.profile_id AND profiles.user_id = auth.uid())
);
CREATE POLICY "Users can update own blocks" ON blocks FOR UPDATE USING (
    EXISTS (SELECT 1 FROM profiles WHERE profiles.id = blocks.profile_id AND profiles.user_id = auth.uid())
);
CREATE POLICY "Users can delete own blocks" ON blocks FOR DELETE USING (
    EXISTS (SELECT 1 FROM profiles WHERE profiles.id = blocks.profile_id AND profiles.user_id = auth.uid())
);

-- Events policies
CREATE POLICY "Anyone can insert events" ON events FOR INSERT WITH CHECK (true);
CREATE POLICY "Users can view own events" ON events FOR SELECT USING (
    EXISTS (SELECT 1 FROM profiles WHERE profiles.id = events.profile_id AND profiles.user_id = auth.uid())
);

-- Updated_at trigger
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER profiles_updated_at BEFORE UPDATE ON profiles FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER blocks_updated_at BEFORE UPDATE ON blocks FOR EACH ROW EXECUTE FUNCTION update_updated_at();
