-- Add method_completions table for tracking task completion
-- Run this if you already ran the previous schema

CREATE TABLE IF NOT EXISTS public.method_completions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  method_id UUID NOT NULL REFERENCES public.methods(id) ON DELETE CASCADE,
  completed_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Enable RLS
ALTER TABLE public.method_completions ENABLE ROW LEVEL SECURITY;

-- RLS Policies
DROP POLICY IF EXISTS "Users can view their own completions" ON public.method_completions;
DROP POLICY IF EXISTS "Users can insert their own completions" ON public.method_completions;
DROP POLICY IF EXISTS "Users can delete their own completions" ON public.method_completions;

CREATE POLICY "Users can view their own completions"
  ON public.method_completions
  FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own completions"
  ON public.method_completions
  FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete their own completions"
  ON public.method_completions
  FOR DELETE
  USING (auth.uid() = user_id);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_method_completions_user_id ON public.method_completions(user_id);
CREATE INDEX IF NOT EXISTS idx_method_completions_method_id ON public.method_completions(method_id);
CREATE INDEX IF NOT EXISTS idx_method_completions_completed_at ON public.method_completions(completed_at DESC);
CREATE INDEX IF NOT EXISTS idx_method_completions_user_method ON public.method_completions(user_id, method_id);

-- Permissions
GRANT ALL ON public.method_completions TO authenticated;
