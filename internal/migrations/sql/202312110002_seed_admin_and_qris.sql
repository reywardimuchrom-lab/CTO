-- +goose Up
WITH inserted_user AS (
    INSERT INTO users (email, password_hash, full_name, role, status)
    VALUES (
        'admin@example.com',
        '$2b$12$lE6LVMo4IRGsZpQoyUgtHO66Rku4nC.jpJvwcMwP7OtmUMTdjdcre',
        'System Administrator',
        'admin',
        'active'
    )
    ON CONFLICT (email) DO UPDATE SET
        password_hash = EXCLUDED.password_hash,
        full_name = EXCLUDED.full_name,
        role = EXCLUDED.role,
        status = EXCLUDED.status
    RETURNING id
)
INSERT INTO wallets (user_id)
SELECT id FROM inserted_user
ON CONFLICT (user_id, currency) DO NOTHING;

INSERT INTO qris_config (provider, merchant_id, terminal_id, status, is_active, config)
VALUES (
    'mock-provider',
    'MERCHANT-001',
    'TERM-001',
    'active',
    true,
    jsonb_build_object('currency', 'IDR', 'country', 'ID', 'version', '1.0.0')
)
ON CONFLICT (provider, merchant_id) DO UPDATE SET
    terminal_id = EXCLUDED.terminal_id,
    status = EXCLUDED.status,
    is_active = EXCLUDED.is_active,
    config = EXCLUDED.config;

-- +goose Down
DELETE FROM qris_config WHERE provider = 'mock-provider' AND merchant_id = 'MERCHANT-001';
DELETE FROM users WHERE email = 'admin@example.com';
