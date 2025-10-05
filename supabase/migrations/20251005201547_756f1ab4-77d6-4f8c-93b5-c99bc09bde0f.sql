-- Create app_role enum
CREATE TYPE public.app_role AS ENUM ('customer', 'restaurant_owner', 'moderator', 'admin');

-- Create user_roles table with approval status
CREATE TABLE public.user_roles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    role public.app_role NOT NULL,
    approved BOOLEAN DEFAULT FALSE,
    granted_at TIMESTAMPTZ DEFAULT NOW(),
    granted_by UUID REFERENCES auth.users(id),
    approved_at TIMESTAMPTZ,
    approved_by UUID REFERENCES auth.users(id),
    UNIQUE (user_id, role)
);

ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

-- Security definer function to check roles
CREATE OR REPLACE FUNCTION public.has_role(_user_id UUID, _role public.app_role)
RETURNS BOOLEAN
LANGUAGE SQL
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.user_roles
    WHERE user_id = _user_id
      AND role = _role
      AND (approved = TRUE OR role IN ('customer', 'moderator', 'admin'))
  )
$$;

-- Helper function to check if user is admin
CREATE OR REPLACE FUNCTION public.is_admin(_user_id UUID)
RETURNS BOOLEAN
LANGUAGE SQL
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT public.has_role(_user_id, 'admin')
$$;

-- Migrate existing data from profiles.user_type to user_roles
INSERT INTO public.user_roles (user_id, role, approved)
SELECT id, user_type::text::public.app_role, TRUE
FROM public.profiles
WHERE user_type IS NOT NULL
ON CONFLICT (user_id, role) DO NOTHING;

-- RLS policies for user_roles
CREATE POLICY "Users can view their own roles"
ON public.user_roles
FOR SELECT
TO authenticated
USING (user_id = auth.uid() OR public.is_admin(auth.uid()));

CREATE POLICY "Admins can manage all roles"
ON public.user_roles
FOR ALL
TO authenticated
USING (public.is_admin(auth.uid()))
WITH CHECK (public.is_admin(auth.uid()));

-- Update restaurants RLS policies
DROP POLICY IF EXISTS "Users can insert own restaurant data" ON public.restaurants;
DROP POLICY IF EXISTS "Users can read own restaurant data" ON public.restaurants;
DROP POLICY IF EXISTS "Users can update own restaurant data" ON public.restaurants;

CREATE POLICY "Restaurant owners can manage own restaurants"
ON public.restaurants
FOR ALL
TO authenticated
USING (
  owner_id = auth.uid() 
  OR public.is_admin(auth.uid())
)
WITH CHECK (
  (owner_id = auth.uid() AND public.has_role(auth.uid(), 'restaurant_owner'))
  OR public.is_admin(auth.uid())
);

-- Update profiles RLS policies for admin access
CREATE POLICY "Admins can view all profiles"
ON public.profiles
FOR SELECT
TO authenticated
USING (
  id = auth.uid()
  OR public.is_admin(auth.uid())
);

CREATE POLICY "Admins can update any profile"
ON public.profiles
FOR UPDATE
TO authenticated
USING (
  id = auth.uid()
  OR public.is_admin(auth.uid())
)
WITH CHECK (
  id = auth.uid()
  OR public.is_admin(auth.uid())
);

-- Create index for performance
CREATE INDEX idx_user_roles_user_id ON public.user_roles(user_id);
CREATE INDEX idx_user_roles_role ON public.user_roles(role) WHERE approved = TRUE;