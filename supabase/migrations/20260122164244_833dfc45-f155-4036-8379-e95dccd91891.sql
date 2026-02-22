-- Create app role enum
CREATE TYPE public.app_role AS ENUM ('admin', 'user');

-- Create user_roles table for role management
CREATE TABLE public.user_roles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    role app_role NOT NULL DEFAULT 'user',
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    UNIQUE (user_id, role)
);

-- Enable RLS on user_roles
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

-- Create security definer function to check roles (prevents recursive RLS)
CREATE OR REPLACE FUNCTION public.has_role(_user_id UUID, _role app_role)
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
  )
$$;

-- RLS policy for user_roles - users can view their own roles
CREATE POLICY "Users can view their own roles"
ON public.user_roles FOR SELECT
USING (auth.uid() = user_id);

-- Admins can view all roles
CREATE POLICY "Admins can view all roles"
ON public.user_roles FOR SELECT
USING (public.has_role(auth.uid(), 'admin'));

-- Create notices table
CREATE TABLE public.notices (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title TEXT NOT NULL,
    content TEXT NOT NULL,
    category TEXT NOT NULL DEFAULT 'সাধারণ',
    is_new BOOLEAN NOT NULL DEFAULT true,
    has_attachment BOOLEAN NOT NULL DEFAULT false,
    attachment_url TEXT,
    created_by UUID REFERENCES auth.users(id),
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.notices ENABLE ROW LEVEL SECURITY;

-- Public can read notices
CREATE POLICY "Anyone can read notices"
ON public.notices FOR SELECT
USING (true);

-- Only admins can insert/update/delete notices
CREATE POLICY "Admins can manage notices"
ON public.notices FOR ALL
USING (public.has_role(auth.uid(), 'admin'))
WITH CHECK (public.has_role(auth.uid(), 'admin'));

-- Create admissions table
CREATE TABLE public.admissions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    student_id TEXT UNIQUE NOT NULL,
    student_name TEXT NOT NULL,
    father_name TEXT NOT NULL,
    mother_name TEXT,
    date_of_birth DATE NOT NULL,
    course TEXT NOT NULL,
    phone TEXT NOT NULL,
    email TEXT,
    address TEXT,
    photo_url TEXT,
    status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected')),
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.admissions ENABLE ROW LEVEL SECURITY;

-- Public can insert admissions (for form submission)
CREATE POLICY "Anyone can submit admission"
ON public.admissions FOR INSERT
WITH CHECK (true);

-- Only admins can view/update/delete admissions
CREATE POLICY "Admins can manage admissions"
ON public.admissions FOR SELECT
USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can update admissions"
ON public.admissions FOR UPDATE
USING (public.has_role(auth.uid(), 'admin'))
WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can delete admissions"
ON public.admissions FOR DELETE
USING (public.has_role(auth.uid(), 'admin'));

-- Create results table
CREATE TABLE public.results (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    student_id TEXT NOT NULL,
    student_name TEXT NOT NULL,
    exam_year TEXT NOT NULL,
    exam_type TEXT NOT NULL,
    course TEXT NOT NULL,
    marks JSONB NOT NULL DEFAULT '{}',
    total_marks INTEGER,
    grade TEXT,
    gpa DECIMAL(3,2),
    created_by UUID REFERENCES auth.users(id),
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.results ENABLE ROW LEVEL SECURITY;

-- Anyone can search results by student_id
CREATE POLICY "Anyone can search results"
ON public.results FOR SELECT
USING (true);

-- Only admins can manage results
CREATE POLICY "Admins can manage results"
ON public.results FOR ALL
USING (public.has_role(auth.uid(), 'admin'))
WITH CHECK (public.has_role(auth.uid(), 'admin'));

-- Create function to generate student_id
CREATE OR REPLACE FUNCTION public.generate_student_id()
RETURNS TRIGGER AS $$
BEGIN
  NEW.student_id := 'BLA-' || to_char(CURRENT_DATE, 'YYYY') || '-' || LPAD(NEXTVAL('admission_seq')::TEXT, 3, '0');
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create sequence for student_id
CREATE SEQUENCE IF NOT EXISTS admission_seq START 1;

-- Create trigger for auto student_id
CREATE TRIGGER set_student_id
BEFORE INSERT ON public.admissions
FOR EACH ROW
WHEN (NEW.student_id IS NULL OR NEW.student_id = '')
EXECUTE FUNCTION public.generate_student_id();

-- Create updated_at trigger function
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Add triggers for updated_at
CREATE TRIGGER update_notices_updated_at
BEFORE UPDATE ON public.notices
FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_admissions_updated_at
BEFORE UPDATE ON public.admissions
FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_results_updated_at
BEFORE UPDATE ON public.results
FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();