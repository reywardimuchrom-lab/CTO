-- +goose Up
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

CREATE TABLE users (
    id              uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
    email           text NOT NULL,
    password_hash   text NOT NULL,
    full_name       text NOT NULL,
    role            text NOT NULL CHECK (role IN ('admin', 'student', 'finance', 'operator')),
    status          text NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'inactive', 'suspended')),
    last_login_at   timestamptz,
    created_at      timestamptz NOT NULL DEFAULT NOW(),
    updated_at      timestamptz NOT NULL DEFAULT NOW()
);

CREATE UNIQUE INDEX idx_users_email ON users (email);

CREATE TABLE wallets (
    id          uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id     uuid NOT NULL REFERENCES users (id) ON DELETE CASCADE,
    balance     numeric(18, 2) NOT NULL DEFAULT 0,
    currency    char(3) NOT NULL DEFAULT 'IDR',
    status      text NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'suspended', 'closed')),
    created_at  timestamptz NOT NULL DEFAULT NOW(),
    updated_at  timestamptz NOT NULL DEFAULT NOW(),
    UNIQUE (user_id, currency)
);

CREATE INDEX idx_wallets_user_id ON wallets (user_id);

CREATE TABLE payment_requests (
    id              uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
    from_student    uuid NOT NULL REFERENCES users (id) ON DELETE CASCADE,
    to_student      uuid NOT NULL REFERENCES users (id) ON DELETE CASCADE,
    wallet_id       uuid NOT NULL REFERENCES wallets (id) ON DELETE RESTRICT,
    amount          numeric(18, 2) NOT NULL CHECK (amount > 0),
    status          text NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected', 'expired', 'cancelled', 'settled')),
    reference_code  text NOT NULL UNIQUE,
    expires_at      timestamptz,
    notes           text,
    created_at      timestamptz NOT NULL DEFAULT NOW(),
    updated_at      timestamptz NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_payment_requests_to_student ON payment_requests (to_student);
CREATE INDEX idx_payment_requests_status ON payment_requests (status);

CREATE TABLE transactions (
    id                  uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
    wallet_id           uuid NOT NULL REFERENCES wallets (id) ON DELETE CASCADE,
    payment_request_id  uuid REFERENCES payment_requests (id) ON DELETE SET NULL,
    amount              numeric(18, 2) NOT NULL CHECK (amount > 0),
    direction           text NOT NULL CHECK (direction IN ('credit', 'debit')),
    status              text NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'completed', 'failed', 'cancelled')),
    reference           text UNIQUE,
    description         text,
    metadata            jsonb NOT NULL DEFAULT '{}'::jsonb,
    occurred_at         timestamptz NOT NULL DEFAULT NOW(),
    created_at          timestamptz NOT NULL DEFAULT NOW(),
    updated_at          timestamptz NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_transactions_status ON transactions (status);
CREATE INDEX idx_transactions_wallet ON transactions (wallet_id);

CREATE TABLE qris_config (
    id           uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
    provider     text NOT NULL,
    merchant_id  text NOT NULL,
    terminal_id  text NOT NULL,
    status       text NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'inactive')),
    is_active    boolean NOT NULL DEFAULT true,
    config       jsonb NOT NULL DEFAULT '{}'::jsonb,
    created_at   timestamptz NOT NULL DEFAULT NOW(),
    updated_at   timestamptz NOT NULL DEFAULT NOW(),
    UNIQUE (provider, merchant_id)
);

CREATE TABLE audit_log (
    id          bigserial PRIMARY KEY,
    user_id     uuid REFERENCES users (id) ON DELETE SET NULL,
    action      text NOT NULL,
    resource    text,
    details     jsonb NOT NULL DEFAULT '{}'::jsonb,
    ip_address  inet,
    created_at  timestamptz NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_audit_log_user_id ON audit_log (user_id);

-- +goose Down
DROP TABLE IF EXISTS audit_log;
DROP TABLE IF EXISTS transactions;
DROP TABLE IF EXISTS payment_requests;
DROP TABLE IF EXISTS wallets;
DROP TABLE IF EXISTS qris_config;
DROP TABLE IF EXISTS users;
DROP EXTENSION IF EXISTS "uuid-ossp";
