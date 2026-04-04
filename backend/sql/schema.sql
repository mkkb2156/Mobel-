-- MOBEL Database Schema
-- European Antique Furniture Proxy Purchasing Platform
-- Designed for Supabase (PostgreSQL with extensions)

-- Enable required extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "vector";
CREATE EXTENSION IF NOT EXISTS "pg_trgm";

-- ============================================================
-- DEALERS
-- ============================================================
CREATE TABLE dealers (
    id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name            TEXT NOT NULL,
    source          TEXT NOT NULL DEFAULT 'vntg',  -- vntg, pamono, 1stdibs, etc.
    source_url      TEXT,
    location        TEXT,
    rating          NUMERIC(3,2),
    total_products  INTEGER DEFAULT 0,
    notes           TEXT,
    created_at      TIMESTAMPTZ DEFAULT NOW(),
    updated_at      TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_dealers_source ON dealers (source);
CREATE INDEX idx_dealers_name ON dealers USING gin (name gin_trgm_ops);

-- ============================================================
-- PRODUCTS
-- ============================================================
CREATE TABLE products (
    id                    UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    slug                  TEXT UNIQUE NOT NULL,
    source_url            TEXT NOT NULL,
    source_id             TEXT NOT NULL,
    source                TEXT NOT NULL DEFAULT 'vntg',

    -- Original content
    title_original        TEXT NOT NULL,
    description_original  TEXT,
    condition_original    TEXT,

    -- Translated content (Traditional Chinese)
    title_zh              TEXT,
    description_zh        TEXT,
    condition_zh          TEXT,

    -- Classification
    category              TEXT,
    subcategory           TEXT,
    style                 TEXT,
    period                TEXT,
    materials             TEXT[] DEFAULT '{}',
    designer              TEXT,
    manufacturer          TEXT,
    hs_code               TEXT,

    -- Quality
    quality_grade         TEXT CHECK (quality_grade IN ('A', 'B', 'C')),
    ai_confidence         NUMERIC(4,3),

    -- Dimensions
    width_cm              NUMERIC(8,2),
    depth_cm              NUMERIC(8,2),
    height_cm             NUMERIC(8,2),
    volume_cbm            NUMERIC(8,4),
    dimension_method      TEXT,  -- scraped, ai_estimated, category_average

    -- Pricing
    price_eur             NUMERIC(10,2),
    price_on_request      BOOLEAN DEFAULT FALSE,
    exchange_rate         NUMERIC(8,4),
    base_twd              NUMERIC(12,0),
    markup_pct            NUMERIC(5,2),
    markup_twd            NUMERIC(12,0),
    shipping_twd          NUMERIC(12,0),
    customs_twd           NUMERIC(12,0),
    vat_twd               NUMERIC(12,0),
    insurance_twd         NUMERIC(12,0),
    packaging_twd         NUMERIC(12,0),
    total_price_twd       NUMERIC(12,0),

    -- Images
    images                TEXT[] DEFAULT '{}',
    thumbnail             TEXT,

    -- Status
    status                TEXT NOT NULL DEFAULT 'pending'
                          CHECK (status IN ('pending', 'approved', 'rejected', 'sold', 'unavailable')),
    admin_notes           TEXT,

    -- Relations
    dealer_id             UUID REFERENCES dealers(id),

    -- Embedding for semantic search
    embedding             vector(1536),

    -- Timestamps
    last_scraped_at       TIMESTAMPTZ,
    created_at            TIMESTAMPTZ DEFAULT NOW(),
    updated_at            TIMESTAMPTZ DEFAULT NOW(),

    UNIQUE (source, source_id)
);

CREATE INDEX idx_products_slug ON products (slug);
CREATE INDEX idx_products_status ON products (status);
CREATE INDEX idx_products_category ON products (category);
CREATE INDEX idx_products_style ON products (style);
CREATE INDEX idx_products_designer ON products (designer);
CREATE INDEX idx_products_quality_grade ON products (quality_grade);
CREATE INDEX idx_products_total_price ON products (total_price_twd);
CREATE INDEX idx_products_created_at ON products (created_at DESC);
CREATE INDEX idx_products_source ON products (source, source_id);
CREATE INDEX idx_products_title_search ON products USING gin (title_original gin_trgm_ops);
CREATE INDEX idx_products_title_zh_search ON products USING gin (title_zh gin_trgm_ops);
CREATE INDEX idx_products_embedding ON products USING ivfflat (embedding vector_cosine_ops) WITH (lists = 100);

-- ============================================================
-- USER PROFILES (extends Supabase auth.users)
-- ============================================================
CREATE TABLE user_profiles (
    id              UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    email           TEXT NOT NULL,
    display_name    TEXT,
    phone           TEXT,
    line_id         TEXT,
    role            TEXT NOT NULL DEFAULT 'customer' CHECK (role IN ('customer', 'admin')),
    preferences     JSONB DEFAULT '{}',
    created_at      TIMESTAMPTZ DEFAULT NOW(),
    updated_at      TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_user_profiles_email ON user_profiles (email);
CREATE INDEX idx_user_profiles_role ON user_profiles (role);
CREATE INDEX idx_user_profiles_line_id ON user_profiles (line_id);

-- ============================================================
-- ADDRESSES
-- ============================================================
CREATE TABLE addresses (
    id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id         UUID NOT NULL REFERENCES user_profiles(id) ON DELETE CASCADE,
    label           TEXT DEFAULT 'home',
    recipient_name  TEXT NOT NULL,
    phone           TEXT NOT NULL,
    city            TEXT NOT NULL,
    district        TEXT NOT NULL,
    postal_code     TEXT NOT NULL,
    address_line    TEXT NOT NULL,
    is_default      BOOLEAN DEFAULT FALSE,
    created_at      TIMESTAMPTZ DEFAULT NOW(),
    updated_at      TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_addresses_user_id ON addresses (user_id);

-- ============================================================
-- INQUIRIES
-- ============================================================
CREATE TABLE inquiries (
    id                UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    product_id        UUID REFERENCES products(id),
    source_url        TEXT,
    user_id           UUID REFERENCES user_profiles(id),
    name              TEXT NOT NULL,
    email             TEXT NOT NULL,
    line_id           TEXT,
    message           TEXT NOT NULL,
    preferred_contact TEXT DEFAULT 'email',
    status            TEXT NOT NULL DEFAULT 'new'
                      CHECK (status IN ('new', 'in_progress', 'quoted', 'closed')),
    admin_notes       TEXT,
    quoted_price_twd  NUMERIC(12,0),
    created_at        TIMESTAMPTZ DEFAULT NOW(),
    updated_at        TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_inquiries_status ON inquiries (status);
CREATE INDEX idx_inquiries_product_id ON inquiries (product_id);
CREATE INDEX idx_inquiries_user_id ON inquiries (user_id);
CREATE INDEX idx_inquiries_created_at ON inquiries (created_at DESC);

-- ============================================================
-- ORDERS
-- ============================================================
CREATE TABLE orders (
    id                  UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    order_number        TEXT UNIQUE NOT NULL,
    user_id             UUID NOT NULL REFERENCES user_profiles(id),
    product_id          UUID NOT NULL REFERENCES products(id),
    shipping_address_id UUID REFERENCES addresses(id),
    status              TEXT NOT NULL DEFAULT 'pending_payment'
                        CHECK (status IN (
                            'pending_payment', 'paid', 'purchasing', 'purchased',
                            'shipping_to_warehouse', 'at_warehouse',
                            'shipping_to_taiwan', 'customs_clearance',
                            'domestic_delivery', 'delivered',
                            'cancelled', 'refunded'
                        )),
    total_twd           NUMERIC(12,0) NOT NULL,
    paid_at             TIMESTAMPTZ,
    payment_method      TEXT,
    payment_ref         TEXT,
    notes               TEXT,
    created_at          TIMESTAMPTZ DEFAULT NOW(),
    updated_at          TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_orders_order_number ON orders (order_number);
CREATE INDEX idx_orders_user_id ON orders (user_id);
CREATE INDEX idx_orders_status ON orders (status);
CREATE INDEX idx_orders_created_at ON orders (created_at DESC);

-- ============================================================
-- PURCHASES (proxy purchase records from European dealers)
-- ============================================================
CREATE TABLE purchases (
    id                UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    order_id          UUID NOT NULL REFERENCES orders(id),
    dealer_id         UUID REFERENCES dealers(id),
    purchase_price_eur NUMERIC(10,2),
    wise_transfer_id  TEXT,
    wise_status       TEXT,
    purchased_at      TIMESTAMPTZ,
    notes             TEXT,
    created_at        TIMESTAMPTZ DEFAULT NOW(),
    updated_at        TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_purchases_order_id ON purchases (order_id);

-- ============================================================
-- SHIPMENTS (consolidated shipments EU -> TW)
-- ============================================================
CREATE TABLE shipments (
    id                UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    shipment_number   TEXT UNIQUE NOT NULL,
    carrier           TEXT,
    method            TEXT CHECK (method IN ('sea', 'air')),
    origin_country    TEXT DEFAULT 'NL',
    tracking_number   TEXT,
    total_volume_cbm  NUMERIC(8,4),
    total_weight_kg   NUMERIC(8,2),
    shipping_cost_eur NUMERIC(10,2),
    status            TEXT NOT NULL DEFAULT 'pending'
                      CHECK (status IN (
                          'pending', 'picked_up', 'in_transit',
                          'arrived', 'customs', 'cleared', 'delivered'
                      )),
    departed_at       TIMESTAMPTZ,
    arrived_at        TIMESTAMPTZ,
    created_at        TIMESTAMPTZ DEFAULT NOW(),
    updated_at        TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_shipments_status ON shipments (status);

-- ============================================================
-- SHIPMENT-ORDERS (many-to-many: multiple orders per shipment)
-- ============================================================
CREATE TABLE shipment_orders (
    id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    shipment_id     UUID NOT NULL REFERENCES shipments(id),
    order_id        UUID NOT NULL REFERENCES orders(id),
    created_at      TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE (shipment_id, order_id)
);

CREATE INDEX idx_shipment_orders_shipment_id ON shipment_orders (shipment_id);
CREATE INDEX idx_shipment_orders_order_id ON shipment_orders (order_id);

-- ============================================================
-- CUSTOMS DECLARATIONS
-- ============================================================
CREATE TABLE customs_declarations (
    id                UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    shipment_id       UUID NOT NULL REFERENCES shipments(id),
    declaration_number TEXT,
    hs_codes          TEXT[],
    declared_value_twd NUMERIC(12,0),
    duty_twd          NUMERIC(12,0),
    vat_twd           NUMERIC(12,0),
    status            TEXT DEFAULT 'pending'
                      CHECK (status IN ('pending', 'submitted', 'cleared', 'held')),
    cleared_at        TIMESTAMPTZ,
    created_at        TIMESTAMPTZ DEFAULT NOW(),
    updated_at        TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_customs_shipment_id ON customs_declarations (shipment_id);

-- ============================================================
-- NOTIFICATIONS
-- ============================================================
CREATE TABLE notifications (
    id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id         UUID REFERENCES user_profiles(id),
    order_id        UUID REFERENCES orders(id),
    channel         TEXT NOT NULL CHECK (channel IN ('email', 'line', 'sms', 'push')),
    type            TEXT NOT NULL,  -- order_update, inquiry_response, etc.
    subject         TEXT,
    body            TEXT,
    sent_at         TIMESTAMPTZ,
    status          TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'sent', 'failed')),
    error_message   TEXT,
    created_at      TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_notifications_user_id ON notifications (user_id);
CREATE INDEX idx_notifications_order_id ON notifications (order_id);
CREATE INDEX idx_notifications_status ON notifications (status);

-- ============================================================
-- REVIEWS
-- ============================================================
CREATE TABLE reviews (
    id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    order_id        UUID NOT NULL REFERENCES orders(id),
    user_id         UUID NOT NULL REFERENCES user_profiles(id),
    product_id      UUID NOT NULL REFERENCES products(id),
    rating          INTEGER NOT NULL CHECK (rating BETWEEN 1 AND 5),
    title           TEXT,
    body            TEXT,
    images          TEXT[] DEFAULT '{}',
    is_verified     BOOLEAN DEFAULT FALSE,
    created_at      TIMESTAMPTZ DEFAULT NOW(),
    updated_at      TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_reviews_product_id ON reviews (product_id);
CREATE INDEX idx_reviews_user_id ON reviews (user_id);

-- ============================================================
-- CHAT LOGS (LINE / web chat history)
-- ============================================================
CREATE TABLE chat_logs (
    id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id         UUID REFERENCES user_profiles(id),
    channel         TEXT NOT NULL CHECK (channel IN ('line', 'web')),
    direction       TEXT NOT NULL CHECK (direction IN ('inbound', 'outbound')),
    message_type    TEXT DEFAULT 'text',
    content         TEXT,
    metadata        JSONB DEFAULT '{}',
    created_at      TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_chat_logs_user_id ON chat_logs (user_id);
CREATE INDEX idx_chat_logs_created_at ON chat_logs (created_at DESC);

-- ============================================================
-- PRICE HISTORY (track price changes)
-- ============================================================
CREATE TABLE price_history (
    id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    product_id      UUID NOT NULL REFERENCES products(id),
    price_eur       NUMERIC(10,2),
    exchange_rate   NUMERIC(8,4),
    total_price_twd NUMERIC(12,0),
    recorded_at     TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_price_history_product_id ON price_history (product_id);
CREATE INDEX idx_price_history_recorded_at ON price_history (recorded_at DESC);

-- ============================================================
-- SCRAPE LOGS
-- ============================================================
CREATE TABLE scrape_logs (
    id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    source          TEXT NOT NULL,
    scrape_type     TEXT NOT NULL CHECK (scrape_type IN ('full', 'delta', 'single', 'availability')),
    category        TEXT,
    status          TEXT NOT NULL DEFAULT 'running'
                    CHECK (status IN ('running', 'completed', 'failed')),
    products_found  INTEGER DEFAULT 0,
    products_new    INTEGER DEFAULT 0,
    products_updated INTEGER DEFAULT 0,
    errors          INTEGER DEFAULT 0,
    error_messages  TEXT[],
    duration_seconds NUMERIC(8,2),
    started_at      TIMESTAMPTZ DEFAULT NOW(),
    completed_at    TIMESTAMPTZ,
    created_at      TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_scrape_logs_source ON scrape_logs (source);
CREATE INDEX idx_scrape_logs_status ON scrape_logs (status);
CREATE INDEX idx_scrape_logs_created_at ON scrape_logs (created_at DESC);

-- ============================================================
-- UPDATED_AT TRIGGER
-- ============================================================
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Apply trigger to all tables with updated_at
DO $$
DECLARE
    t TEXT;
BEGIN
    FOR t IN
        SELECT table_name
        FROM information_schema.columns
        WHERE column_name = 'updated_at'
          AND table_schema = 'public'
    LOOP
        EXECUTE format(
            'CREATE TRIGGER update_%s_updated_at
             BEFORE UPDATE ON %I
             FOR EACH ROW
             EXECUTE FUNCTION update_updated_at_column()',
            t, t
        );
    END LOOP;
END;
$$;

-- ============================================================
-- ROW LEVEL SECURITY (RLS)
-- ============================================================
ALTER TABLE user_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE addresses ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE inquiries ENABLE ROW LEVEL SECURITY;
ALTER TABLE reviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;

-- Users can read/update their own profile
CREATE POLICY "Users can view own profile"
    ON user_profiles FOR SELECT
    USING (auth.uid() = id);

CREATE POLICY "Users can update own profile"
    ON user_profiles FOR UPDATE
    USING (auth.uid() = id);

-- Users can manage their own addresses
CREATE POLICY "Users can manage own addresses"
    ON addresses FOR ALL
    USING (auth.uid() = user_id);

-- Users can view their own orders
CREATE POLICY "Users can view own orders"
    ON orders FOR SELECT
    USING (auth.uid() = user_id);

-- Products are publicly readable when approved
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Approved products are public"
    ON products FOR SELECT
    USING (status = 'approved');

-- Users can view their own inquiries
CREATE POLICY "Users can view own inquiries"
    ON inquiries FOR SELECT
    USING (auth.uid() = user_id OR user_id IS NULL);

CREATE POLICY "Anyone can create inquiries"
    ON inquiries FOR INSERT
    WITH CHECK (true);

-- Users can view their own notifications
CREATE POLICY "Users can view own notifications"
    ON notifications FOR SELECT
    USING (auth.uid() = user_id);

-- Users can manage own reviews
CREATE POLICY "Users can manage own reviews"
    ON reviews FOR ALL
    USING (auth.uid() = user_id);
