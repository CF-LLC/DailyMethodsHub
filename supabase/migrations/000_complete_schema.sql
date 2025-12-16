-- ============================================================================
-- COMPLETE DATABASE SCHEMA FOR DAILYMETHODSHUB
-- ============================================================================
-- This file consolidates all migrations into a single schema.
-- Run this once in your Supabase SQL Editor to set up the entire database.
-- ============================================================================

-- ============================================================================
-- 1. PROFILES TABLE
-- ============================================================================
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  is_admin BOOLEAN DEFAULT false NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- ============================================================================
-- 2. METHODS TABLE
-- ============================================================================
CREATE TABLE IF NOT EXISTS public.methods (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  category TEXT NOT NULL,
  earnings TEXT NOT NULL,
  difficulty TEXT NOT NULL CHECK (difficulty IN ('Easy', 'Medium', 'Hard')),
  time_required TEXT NOT NULL,
  link TEXT,
  referral_code TEXT,
  icon_url TEXT,
  is_active BOOLEAN DEFAULT true NOT NULL,
  is_public BOOLEAN DEFAULT false NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- ============================================================================
-- 3. DAILY EARNINGS TABLE
-- ============================================================================
CREATE TABLE IF NOT EXISTS public.daily_earnings (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  method_id UUID NOT NULL REFERENCES public.methods(id) ON DELETE CASCADE,
  amount NUMERIC(10, 2) NOT NULL CHECK (amount >= 0),
  notes TEXT,
  entry_date DATE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  UNIQUE(user_id, method_id, entry_date)
);

-- ============================================================================
-- 4. STREAKS TABLE
-- ============================================================================
CREATE TABLE IF NOT EXISTS public.streaks (
  user_id UUID PRIMARY KEY REFERENCES public.profiles(id) ON DELETE CASCADE,
  current_streak INTEGER NOT NULL DEFAULT 0,
  longest_streak INTEGER NOT NULL DEFAULT 0,
  last_entry_date DATE,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- ============================================================================
-- 5. NOTIFICATIONS TABLE
-- ============================================================================
CREATE TABLE IF NOT EXISTS public.notifications (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  message TEXT NOT NULL,
  type TEXT NOT NULL DEFAULT 'info', -- info, warning, success, error
  read BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- ============================================================================
-- 6. SUBSCRIPTIONS TABLE
-- ============================================================================
CREATE TABLE IF NOT EXISTS public.subscriptions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL UNIQUE REFERENCES public.profiles(id) ON DELETE CASCADE,
  stripe_customer_id TEXT UNIQUE,
  stripe_subscription_id TEXT UNIQUE,
  status TEXT NOT NULL DEFAULT 'inactive', -- active, canceled, incomplete, past_due
  plan_type TEXT NOT NULL DEFAULT 'free', -- free, premium
  current_period_start TIMESTAMP WITH TIME ZONE,
  current_period_end TIMESTAMP WITH TIME ZONE,
  cancel_at_period_end BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- ============================================================================
-- 7. REFERRALS TABLE
-- ============================================================================
CREATE TABLE IF NOT EXISTS public.referrals (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  referrer_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  referred_user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  UNIQUE(referred_user_id)
);

-- ============================================================================
-- 8. REFERRAL POINTS TABLE
-- ============================================================================
CREATE TABLE IF NOT EXISTS public.referral_points (
  user_id UUID PRIMARY KEY REFERENCES public.profiles(id) ON DELETE CASCADE,
  points INTEGER NOT NULL DEFAULT 0,
  lifetime_points INTEGER NOT NULL DEFAULT 0,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- ============================================================================
-- ENABLE ROW LEVEL SECURITY
-- ============================================================================
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.methods ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.daily_earnings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.streaks ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.subscriptions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.referrals ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.referral_points ENABLE ROW LEVEL SECURITY;

-- ============================================================================
-- RLS POLICIES: PROFILES
-- ============================================================================
DROP POLICY IF EXISTS "Users can view their own profile" ON public.profiles;
DROP POLICY IF EXISTS "Users can update their own profile" ON public.profiles;

CREATE POLICY "Users can view their own profile"
  ON public.profiles
  FOR SELECT
  USING (auth.uid() = id);

CREATE POLICY "Users can update their own profile"
  ON public.profiles
  FOR UPDATE
  USING (auth.uid() = id);

-- ============================================================================
-- RLS POLICIES: METHODS
-- ============================================================================
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

-- ============================================================================
-- RLS POLICIES: DAILY EARNINGS
-- ============================================================================
DROP POLICY IF EXISTS "Users can view their own earnings" ON public.daily_earnings;
DROP POLICY IF EXISTS "Users can insert their own earnings" ON public.daily_earnings;
DROP POLICY IF EXISTS "Users can update their own earnings" ON public.daily_earnings;
DROP POLICY IF EXISTS "Users can delete their own earnings" ON public.daily_earnings;
DROP POLICY IF EXISTS "Admins can view all earnings" ON public.daily_earnings;

CREATE POLICY "Users can view their own earnings"
  ON public.daily_earnings
  FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own earnings"
  ON public.daily_earnings
  FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own earnings"
  ON public.daily_earnings
  FOR UPDATE
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete their own earnings"
  ON public.daily_earnings
  FOR DELETE
  USING (auth.uid() = user_id);

CREATE POLICY "Admins can view all earnings"
  ON public.daily_earnings
  FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE id = auth.uid() AND is_admin = true
    )
  );

-- ============================================================================
-- RLS POLICIES: STREAKS
-- ============================================================================
DROP POLICY IF EXISTS "Users can view their own streak" ON public.streaks;
DROP POLICY IF EXISTS "Users can update their own streak" ON public.streaks;
DROP POLICY IF EXISTS "Users can insert their own streak" ON public.streaks;

CREATE POLICY "Users can view their own streak"
  ON public.streaks
  FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can update their own streak"
  ON public.streaks
  FOR UPDATE
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can insert their own streak"
  ON public.streaks
  FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- ============================================================================
-- RLS POLICIES: NOTIFICATIONS
-- ============================================================================
DROP POLICY IF EXISTS "Users can view their own notifications" ON public.notifications;
DROP POLICY IF EXISTS "Users can update their own notifications" ON public.notifications;
DROP POLICY IF EXISTS "Users can insert their own notifications" ON public.notifications;
DROP POLICY IF EXISTS "Users can delete their own notifications" ON public.notifications;

CREATE POLICY "Users can view their own notifications"
  ON public.notifications
  FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can update their own notifications"
  ON public.notifications
  FOR UPDATE
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can insert their own notifications"
  ON public.notifications
  FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete their own notifications"
  ON public.notifications
  FOR DELETE
  USING (auth.uid() = user_id);

-- ============================================================================
-- RLS POLICIES: SUBSCRIPTIONS
-- ============================================================================
DROP POLICY IF EXISTS "Users can view their own subscription" ON public.subscriptions;

CREATE POLICY "Users can view their own subscription"
  ON public.subscriptions
  FOR SELECT
  USING (auth.uid() = user_id);

-- ============================================================================
-- RLS POLICIES: REFERRALS
-- ============================================================================
DROP POLICY IF EXISTS "Users can view referrals they made" ON public.referrals;
DROP POLICY IF EXISTS "Users can insert referrals" ON public.referrals;

CREATE POLICY "Users can view referrals they made"
  ON public.referrals
  FOR SELECT
  USING (auth.uid() = referrer_id OR auth.uid() = referred_user_id);

CREATE POLICY "Users can insert referrals"
  ON public.referrals
  FOR INSERT
  WITH CHECK (true); -- Allow any authenticated user to insert

-- ============================================================================
-- RLS POLICIES: REFERRAL POINTS
-- ============================================================================
DROP POLICY IF EXISTS "Users can view their own points" ON public.referral_points;
DROP POLICY IF EXISTS "Users can update their own points" ON public.referral_points;
DROP POLICY IF EXISTS "Users can insert their own points" ON public.referral_points;

CREATE POLICY "Users can view their own points"
  ON public.referral_points
  FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can update their own points"
  ON public.referral_points
  FOR UPDATE
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can insert their own points"
  ON public.referral_points
  FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- ============================================================================
-- FUNCTIONS
-- ============================================================================

-- Function to handle new user signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, email, is_admin)
  VALUES (new.id, new.email, false);
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = timezone('utc'::text, now());
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- ============================================================================
-- TRIGGERS
-- ============================================================================

-- Trigger for new user signup
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Trigger for methods updated_at
DROP TRIGGER IF EXISTS on_methods_updated ON public.methods;
CREATE TRIGGER on_methods_updated
  BEFORE UPDATE ON public.methods
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

-- Trigger for daily_earnings updated_at
DROP TRIGGER IF EXISTS on_daily_earnings_updated ON public.daily_earnings;
CREATE TRIGGER on_daily_earnings_updated
  BEFORE UPDATE ON public.daily_earnings
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

-- Trigger for streaks updated_at
DROP TRIGGER IF EXISTS on_streaks_updated ON public.streaks;
CREATE TRIGGER on_streaks_updated
  BEFORE UPDATE ON public.streaks
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

-- Trigger for subscriptions updated_at
DROP TRIGGER IF EXISTS on_subscriptions_updated ON public.subscriptions;
CREATE TRIGGER on_subscriptions_updated
  BEFORE UPDATE ON public.subscriptions
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

-- Trigger for referral_points updated_at
DROP TRIGGER IF EXISTS on_referral_points_updated ON public.referral_points;
CREATE TRIGGER on_referral_points_updated
  BEFORE UPDATE ON public.referral_points
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

-- ============================================================================
-- INDEXES FOR PERFORMANCE
-- ============================================================================

-- Profiles indexes
CREATE INDEX IF NOT EXISTS idx_profiles_email ON public.profiles(email);
CREATE INDEX IF NOT EXISTS idx_profiles_is_admin ON public.profiles(is_admin);

-- Methods indexes
CREATE INDEX IF NOT EXISTS idx_methods_user_id ON public.methods(user_id);
CREATE INDEX IF NOT EXISTS idx_methods_category ON public.methods(category);
CREATE INDEX IF NOT EXISTS idx_methods_difficulty ON public.methods(difficulty);
CREATE INDEX IF NOT EXISTS idx_methods_is_active ON public.methods(is_active);
CREATE INDEX IF NOT EXISTS idx_methods_is_public ON public.methods(is_public) WHERE is_public = true;
CREATE INDEX IF NOT EXISTS idx_methods_created_at ON public.methods(created_at DESC);

-- Daily earnings indexes
CREATE INDEX IF NOT EXISTS idx_daily_earnings_user_id ON public.daily_earnings(user_id);
CREATE INDEX IF NOT EXISTS idx_daily_earnings_method_id ON public.daily_earnings(method_id);
CREATE INDEX IF NOT EXISTS idx_daily_earnings_entry_date ON public.daily_earnings(entry_date);
CREATE INDEX IF NOT EXISTS idx_daily_earnings_user_date ON public.daily_earnings(user_id, entry_date);

-- Streaks indexes
CREATE INDEX IF NOT EXISTS idx_streaks_user_id ON public.streaks(user_id);

-- Notifications indexes
CREATE INDEX IF NOT EXISTS idx_notifications_user_id ON public.notifications(user_id);
CREATE INDEX IF NOT EXISTS idx_notifications_read ON public.notifications(read);
CREATE INDEX IF NOT EXISTS idx_notifications_created_at ON public.notifications(created_at DESC);

-- Subscriptions indexes
CREATE INDEX IF NOT EXISTS idx_subscriptions_user_id ON public.subscriptions(user_id);
CREATE INDEX IF NOT EXISTS idx_subscriptions_stripe_customer_id ON public.subscriptions(stripe_customer_id);
CREATE INDEX IF NOT EXISTS idx_subscriptions_status ON public.subscriptions(status);

-- Referrals indexes
CREATE INDEX IF NOT EXISTS idx_referrals_referrer_id ON public.referrals(referrer_id);
CREATE INDEX IF NOT EXISTS idx_referrals_referred_user_id ON public.referrals(referred_user_id);

-- Referral points indexes
CREATE INDEX IF NOT EXISTS idx_referral_points_user_id ON public.referral_points(user_id);

-- ============================================================================
-- PERMISSIONS
-- ============================================================================
GRANT ALL ON public.profiles TO authenticated;
GRANT ALL ON public.methods TO authenticated;
GRANT ALL ON public.daily_earnings TO authenticated;
GRANT ALL ON public.streaks TO authenticated;
GRANT ALL ON public.notifications TO authenticated;
GRANT SELECT ON public.subscriptions TO authenticated;
GRANT ALL ON public.referrals TO authenticated;
GRANT ALL ON public.referral_points TO authenticated;

GRANT SELECT ON public.daily_earnings TO anon;

-- ============================================================================
-- COMPLETE! 
-- ============================================================================
-- Your database is now ready to use.
-- All tables, policies, functions, triggers, and indexes have been created.
-- ============================================================================
