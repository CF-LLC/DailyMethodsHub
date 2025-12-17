-- Update subscriptions table for Bitcoin payments
-- Remove Stripe fields and add Bitcoin payment fields

ALTER TABLE public.subscriptions 
DROP COLUMN IF EXISTS stripe_customer_id,
DROP COLUMN IF EXISTS stripe_subscription_id,
DROP COLUMN IF EXISTS current_period_start,
DROP COLUMN IF EXISTS current_period_end,
DROP COLUMN IF EXISTS cancel_at_period_end;

ALTER TABLE public.subscriptions
ADD COLUMN IF NOT EXISTS payment_method VARCHAR(20) DEFAULT 'bitcoin',
ADD COLUMN IF NOT EXISTS payment_tx_id TEXT,
ADD COLUMN IF NOT EXISTS payment_address TEXT,
ADD COLUMN IF NOT EXISTS payment_amount_sats BIGINT,
ADD COLUMN IF NOT EXISTS payment_verified_at TIMESTAMP WITH TIME ZONE,
ADD COLUMN IF NOT EXISTS lightning_invoice TEXT;

-- Update plan_type to only have 'free' and 'premium'
COMMENT ON COLUMN public.subscriptions.plan_type IS 'Plan type: free or premium';
COMMENT ON COLUMN public.subscriptions.payment_tx_id IS 'Bitcoin transaction ID or Lightning payment hash';
COMMENT ON COLUMN public.subscriptions.payment_address IS 'Bitcoin address used for payment';
COMMENT ON COLUMN public.subscriptions.payment_amount_sats IS 'Payment amount in satoshis';
COMMENT ON COLUMN public.subscriptions.lightning_invoice IS 'Lightning invoice if using Lightning Network';
