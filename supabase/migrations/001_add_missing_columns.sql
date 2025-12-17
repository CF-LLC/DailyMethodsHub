-- ============================================================================
-- ADD MISSING COLUMNS TO EXISTING TABLES
-- ============================================================================
-- Run this if you already have tables created but missing new columns
-- ============================================================================

-- Add user_id, referral_code, and is_public to methods table if they don't exist
DO $$ 
BEGIN
    -- Add user_id column
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_schema = 'public' 
        AND table_name = 'methods' 
        AND column_name = 'user_id'
    ) THEN
        ALTER TABLE public.methods ADD COLUMN user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE;
    END IF;

    -- Add referral_code column
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_schema = 'public' 
        AND table_name = 'methods' 
        AND column_name = 'referral_code'
    ) THEN
        ALTER TABLE public.methods ADD COLUMN referral_code TEXT;
    END IF;

    -- Add is_public column
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_schema = 'public' 
        AND table_name = 'methods' 
        AND column_name = 'is_public'
    ) THEN
        ALTER TABLE public.methods ADD COLUMN is_public BOOLEAN DEFAULT false NOT NULL;
    END IF;
END $$;

-- Create indexes if they don't exist
CREATE INDEX IF NOT EXISTS idx_methods_user_id ON public.methods(user_id);
CREATE INDEX IF NOT EXISTS idx_methods_is_public ON public.methods(is_public) WHERE is_public = true;

-- Update RLS policies for methods
DROP POLICY IF EXISTS "Users can read their own methods and public methods" ON public.methods;
DROP POLICY IF EXISTS "Users can create their own methods" ON public.methods;
DROP POLICY IF EXISTS "Users can update their own methods" ON public.methods;
DROP POLICY IF EXISTS "Users can delete their own methods" ON public.methods;

CREATE POLICY "Users can read their own methods and public methods"
  ON public.methods
  FOR SELECT
  USING (user_id = auth.uid() OR is_public = true);

CREATE POLICY "Users can create their own methods"
  ON public.methods
  FOR INSERT
  WITH CHECK (user_id = auth.uid());

CREATE POLICY "Users can update their own methods"
  ON public.methods
  FOR UPDATE
  USING (user_id = auth.uid());

CREATE POLICY "Users can delete their own methods"
  ON public.methods
  FOR DELETE
  USING (user_id = auth.uid());
