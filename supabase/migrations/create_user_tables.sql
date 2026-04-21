-- Enable RLS
ALTER TABLE auth.users ENABLE ROW LEVEL SECURITY;

-- Create user profiles table
CREATE TABLE IF NOT EXISTS public.user_profiles_2026_02_21_06_55 (
  id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  email TEXT,
  full_name TEXT,
  phone TEXT,
  avatar_url TEXT,
  preferred_language TEXT DEFAULT 'zh',
  preferred_currency TEXT DEFAULT 'IDR',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create user favorites table
CREATE TABLE IF NOT EXISTS public.user_favorites_2026_02_21_06_55 (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  property_id TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, property_id)
);

-- Enable RLS on tables
ALTER TABLE public.user_profiles_2026_02_21_06_55 ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_favorites_2026_02_21_06_55 ENABLE ROW LEVEL SECURITY;

-- RLS Policies for user_profiles
CREATE POLICY "Users can view own profile" ON public.user_profiles_2026_02_21_06_55
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update own profile" ON public.user_profiles_2026_02_21_06_55
  FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Users can insert own profile" ON public.user_profiles_2026_02_21_06_55
  FOR INSERT WITH CHECK (auth.uid() = id);

-- RLS Policies for user_favorites
CREATE POLICY "Users can view own favorites" ON public.user_favorites_2026_02_21_06_55
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own favorites" ON public.user_favorites_2026_02_21_06_55
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own favorites" ON public.user_favorites_2026_02_21_06_55
  FOR DELETE USING (auth.uid() = user_id);

-- Function to handle user profile creation
CREATE OR REPLACE FUNCTION public.handle_new_user_2026_02_21_06_55()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.user_profiles_2026_02_21_06_55 (id, email, full_name)
  VALUES (NEW.id, NEW.email, NEW.raw_user_meta_data->>'full_name');
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger to create profile on user signup
CREATE OR REPLACE TRIGGER on_auth_user_created_2026_02_21_06_55
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user_2026_02_21_06_55();

-- Update function for updated_at
CREATE OR REPLACE FUNCTION public.update_updated_at_column_2026_02_21_06_55()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger for updated_at on user_profiles
CREATE OR REPLACE TRIGGER update_user_profiles_updated_at_2026_02_21_06_55
  BEFORE UPDATE ON public.user_profiles_2026_02_21_06_55
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column_2026_02_21_06_55();