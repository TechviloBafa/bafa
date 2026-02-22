-- Create tables for Bulbul Academy
-- Run this in your Supabase SQL Editor

-- 1. Create admissions table
CREATE TABLE IF NOT EXISTS admissions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  student_name VARCHAR(255) NOT NULL,
  father_name VARCHAR(255) NOT NULL,
  mother_name VARCHAR(255),
  phone VARCHAR(20) NOT NULL,
  email VARCHAR(255),
  address VARCHAR(500),
  date_of_birth VARCHAR(20) NOT NULL,
  student_id VARCHAR(100),
  course VARCHAR(100) NOT NULL,
  photo_url VARCHAR(500),
  status VARCHAR(50) DEFAULT 'pending',
  created_at TIMESTAMP DEFAULT now(),
  updated_at TIMESTAMP DEFAULT now()
);

-- 2. Create notices table
CREATE TABLE IF NOT EXISTS notices (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title VARCHAR(255) NOT NULL,
  content TEXT NOT NULL,
  category VARCHAR(100),
  is_new BOOLEAN DEFAULT true,
  featured BOOLEAN DEFAULT false,
  created_at TIMESTAMP DEFAULT now(),
  updated_at TIMESTAMP DEFAULT now()
);

-- 3. Create results table
CREATE TABLE IF NOT EXISTS results (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  exam_name VARCHAR(255), -- Made nullable to support legacy or alternative usage
  exam_type VARCHAR(100) NOT NULL,
  exam_year VARCHAR(20) NOT NULL,
  course VARCHAR(100) NOT NULL,
  student_name VARCHAR(255) NOT NULL,
  student_id VARCHAR(100),
  roll_number VARCHAR(50),
  marks_obtained FLOAT,
  total_marks FLOAT,
  gpa FLOAT,
  grade VARCHAR(10),
  marks JSONB DEFAULT '{}'::jsonb,
  status VARCHAR(50),
  created_at TIMESTAMP DEFAULT now(),
  updated_at TIMESTAMP DEFAULT now()
);

-- 4. Create branches table
CREATE TABLE IF NOT EXISTS branches (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  branch_name VARCHAR(255) NOT NULL,
  address VARCHAR(500),
  phone VARCHAR(20),
  email VARCHAR(255),
  manager_name VARCHAR(255),
  open_time VARCHAR(50),
  close_time VARCHAR(50),
  latitude FLOAT,
  longitude FLOAT,
  students INTEGER DEFAULT 0,
  teachers INTEGER DEFAULT 0,
  image_url VARCHAR(500),
  description TEXT,
  facilities TEXT[],
  established VARCHAR(50),
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP DEFAULT now(),
  updated_at TIMESTAMP DEFAULT now()
);

-- 5. Create gallery table
CREATE TABLE IF NOT EXISTS gallery (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title VARCHAR(255) NOT NULL,
  category VARCHAR(100) NOT NULL,
  image_url VARCHAR(500) NOT NULL,
  created_at TIMESTAMP DEFAULT now(),
  updated_at TIMESTAMP DEFAULT now()
);

-- 6. Create user_roles table (for admin authentication)
CREATE TABLE IF NOT EXISTS user_roles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL,
  role VARCHAR(50) DEFAULT 'admin',
  created_at TIMESTAMP DEFAULT now()
);

-- 7. Create pending_admins table (for registration approval workflow)
CREATE TABLE IF NOT EXISTS pending_admins (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID,
  email VARCHAR(255) NOT NULL UNIQUE,
  full_name VARCHAR(255) NOT NULL,
  status VARCHAR(50) DEFAULT 'pending',
  approved_by UUID,
  approved_at TIMESTAMP,
  created_at TIMESTAMP DEFAULT now(),
  updated_at TIMESTAMP DEFAULT now()
);

-- Create storage bucket for gallery images
INSERT INTO storage.buckets (id, name, public)
VALUES ('gallery-images', 'gallery-images', true)
ON CONFLICT (id) DO NOTHING;

-- Drop existing storage policies if they exist
DROP POLICY IF EXISTS "Allow public read gallery images" ON storage.objects;
DROP POLICY IF EXISTS "Allow authenticated uploads to gallery" ON storage.objects;
DROP POLICY IF EXISTS "Allow authenticated deletes from gallery" ON storage.objects;

-- Create storage policies for gallery-images bucket
-- Allow public read
CREATE POLICY "Allow public read gallery images"
ON storage.objects
FOR SELECT
TO public
USING (bucket_id = 'gallery-images');
-- Allow authenticated uploads
CREATE POLICY "Allow authenticated uploads to gallery"
ON storage.objects
FOR INSERT
WITH CHECK (bucket_id = 'gallery-images');

-- Allow authenticated deletes
CREATE POLICY "Allow authenticated deletes from gallery"
ON storage.objects
FOR DELETE
USING (bucket_id = 'gallery-images');

  -- ============================================
  -- ROW LEVEL SECURITY POLICIES
  -- ============================================

-- 8. Create teachers table
CREATE TABLE IF NOT EXISTS teachers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(255) NOT NULL,
  designation VARCHAR(255) NOT NULL,
  qualification VARCHAR(255),
  experience VARCHAR(100),
  specialization TEXT,
  image_url VARCHAR(500),
  is_active BOOLEAN DEFAULT true,
  order_index INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- ============================================
-- ROW LEVEL SECURITY POLICIES
-- ============================================

-- Enable RLS
ALTER TABLE admissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE notices ENABLE ROW LEVEL SECURITY;
ALTER TABLE results ENABLE ROW LEVEL SECURITY;
ALTER TABLE branches ENABLE ROW LEVEL SECURITY;
ALTER TABLE gallery ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_roles ENABLE ROW LEVEL SECURITY;
ALTER TABLE pending_admins ENABLE ROW LEVEL SECURITY;
ALTER TABLE teachers ENABLE ROW LEVEL SECURITY;

-- 1. ADMISSIONS TABLE POLICIES
DROP POLICY IF EXISTS "Anyone can create admission" ON admissions;
CREATE POLICY "Anyone can create admission" ON admissions FOR INSERT TO anon, authenticated WITH CHECK (true);

DROP POLICY IF EXISTS "Anyone can read admissions" ON admissions;
CREATE POLICY "Anyone can read admissions" ON admissions FOR SELECT TO anon, authenticated USING (true);

DROP POLICY IF EXISTS "Only admins or super_admins can manage admissions" ON admissions;
CREATE POLICY "Only admins or super_admins can manage admissions" ON admissions FOR ALL TO authenticated
USING (EXISTS (SELECT 1 FROM user_roles WHERE user_roles.user_id = auth.uid() AND user_roles.role IN ('admin', 'super_admin')))
WITH CHECK (EXISTS (SELECT 1 FROM user_roles WHERE user_roles.user_id = auth.uid() AND user_roles.role IN ('admin', 'super_admin')));

-- 2. NOTICES TABLE POLICIES
DROP POLICY IF EXISTS "Anyone can read notices" ON notices;
CREATE POLICY "Anyone can read notices" ON notices FOR SELECT TO anon, authenticated USING (true);

DROP POLICY IF EXISTS "Only admins or super_admins can manage notices" ON notices;
CREATE POLICY "Only admins or super_admins can manage notices" ON notices FOR ALL TO authenticated
USING (EXISTS (SELECT 1 FROM user_roles WHERE user_roles.user_id = auth.uid() AND user_roles.role IN ('admin', 'super_admin')))
WITH CHECK (EXISTS (SELECT 1 FROM user_roles WHERE user_roles.user_id = auth.uid() AND user_roles.role IN ('admin', 'super_admin')));

-- 3. RESULTS TABLE POLICIES
DROP POLICY IF EXISTS "Anyone can read results" ON results;
CREATE POLICY "Anyone can read results" ON results FOR SELECT TO anon, authenticated USING (true);

DROP POLICY IF EXISTS "Only admins or super_admins can manage results" ON results;
CREATE POLICY "Only admins or super_admins can manage results" ON results FOR ALL TO authenticated
USING (EXISTS (SELECT 1 FROM user_roles WHERE user_roles.user_id = auth.uid() AND user_roles.role IN ('admin', 'super_admin')))
WITH CHECK (EXISTS (SELECT 1 FROM user_roles WHERE user_roles.user_id = auth.uid() AND user_roles.role IN ('admin', 'super_admin')));

-- 4. BRANCHES TABLE POLICIES
DROP POLICY IF EXISTS "Anyone can read branches" ON branches;
CREATE POLICY "Anyone can read branches" ON branches FOR SELECT TO anon, authenticated USING (true);

DROP POLICY IF EXISTS "Only admins or super_admins can manage branches" ON branches;
CREATE POLICY "Only admins or super_admins can manage branches" ON branches FOR ALL TO authenticated
USING (EXISTS (SELECT 1 FROM user_roles WHERE user_roles.user_id = auth.uid() AND user_roles.role IN ('admin', 'super_admin')))
WITH CHECK (EXISTS (SELECT 1 FROM user_roles WHERE user_roles.user_id = auth.uid() AND user_roles.role IN ('admin', 'super_admin')));

-- 5. GALLERY TABLE POLICIES
DROP POLICY IF EXISTS "Anyone can read gallery" ON gallery;
CREATE POLICY "Anyone can read gallery" ON gallery FOR SELECT TO anon, authenticated USING (true);

DROP POLICY IF EXISTS "Only admins or super_admins can manage gallery" ON gallery;
CREATE POLICY "Only admins or super_admins can manage gallery" ON gallery FOR ALL TO authenticated
USING (EXISTS (SELECT 1 FROM user_roles WHERE user_roles.user_id = auth.uid() AND user_roles.role IN ('admin', 'super_admin')))
WITH CHECK (EXISTS (SELECT 1 FROM user_roles WHERE user_roles.user_id = auth.uid() AND user_roles.role IN ('admin', 'super_admin')));

-- 6. TEACHERS TABLE POLICIES
DROP POLICY IF EXISTS "Anyone can read teachers" ON teachers;
CREATE POLICY "Anyone can read teachers" ON teachers FOR SELECT TO anon, authenticated USING (true);

DROP POLICY IF EXISTS "Only admins or super_admins can manage teachers" ON teachers;
CREATE POLICY "Only admins or super_admins can manage teachers" ON teachers FOR ALL TO authenticated
USING (EXISTS (SELECT 1 FROM user_roles WHERE user_roles.user_id = auth.uid() AND user_roles.role IN ('admin', 'super_admin')))
WITH CHECK (EXISTS (SELECT 1 FROM user_roles WHERE user_roles.user_id = auth.uid() AND user_roles.role IN ('admin', 'super_admin')));

-- 7. USER_ROLES TABLE POLICIES
DROP POLICY IF EXISTS "Users can read their own role" ON user_roles;
CREATE POLICY "Users can read their own role" ON user_roles FOR SELECT TO authenticated USING (user_id = auth.uid());

DROP POLICY IF EXISTS "Admins can read all roles" ON user_roles;
CREATE POLICY "Admins can read all roles" ON user_roles FOR SELECT TO authenticated
USING (EXISTS (SELECT 1 FROM user_roles WHERE user_roles.user_id = auth.uid() AND user_roles.role IN ('admin', 'super_admin')));

-- 8. PENDING_ADMINS TABLE POLICIES
DROP POLICY IF EXISTS "Anyone can register as pending admin" ON pending_admins;
CREATE POLICY "Anyone can register as pending admin" ON pending_admins FOR INSERT TO anon, authenticated WITH CHECK (true);

DROP POLICY IF EXISTS "Admins can manage pending admins" ON pending_admins;
CREATE POLICY "Admins can manage pending admins" ON pending_admins FOR ALL TO authenticated
USING (EXISTS (SELECT 1 FROM user_roles WHERE user_roles.user_id = auth.uid() AND user_roles.role IN ('admin', 'super_admin')))
WITH CHECK (EXISTS (SELECT 1 FROM user_roles WHERE user_roles.user_id = auth.uid() AND user_roles.role IN ('admin', 'super_admin')));

-- Set indexes for better performance
CREATE INDEX IF NOT EXISTS idx_admissions_status ON admissions(status);
CREATE INDEX IF NOT EXISTS idx_admissions_course ON admissions(course);
CREATE INDEX IF NOT EXISTS idx_admissions_created_at ON admissions(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_notices_category ON notices(category);
CREATE INDEX IF NOT EXISTS idx_notices_created_at ON notices(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_results_course ON results(course);
CREATE INDEX IF NOT EXISTS idx_results_exam ON results(exam_name);
CREATE INDEX IF NOT EXISTS idx_gallery_category ON gallery(category);
CREATE INDEX IF NOT EXISTS idx_gallery_created_at ON gallery(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_branches_active ON branches(is_active);
CREATE INDEX IF NOT EXISTS idx_pending_admins_status ON pending_admins(status);
CREATE INDEX IF NOT EXISTS idx_pending_admins_email ON pending_admins(email);
CREATE INDEX IF NOT EXISTS idx_teachers_order ON teachers(order_index);
CREATE INDEX IF NOT EXISTS idx_teachers_active ON teachers(is_active);

-- ============================================
-- RPC FUNCTIONS FOR SECURE OPERATIONS
-- ============================================

-- Function to assign admin role (callable by authenticated users)
DROP FUNCTION IF EXISTS assign_admin_role(UUID, VARCHAR);
CREATE OR REPLACE FUNCTION assign_admin_role(target_user_id UUID, target_role VARCHAR DEFAULT 'admin')
RETURNS json AS $$
DECLARE
  current_admin BOOLEAN;
BEGIN
  -- Check if current user is an admin OR super_admin
  SELECT EXISTS(
    SELECT 1 FROM user_roles
    WHERE user_id = auth.uid()
    AND role IN ('admin', 'super_admin')
  ) INTO current_admin;

  IF NOT current_admin THEN
    RETURN json_build_object('success', false, 'error', 'Only admins can assign roles');
  END IF;

  -- Upsert the role
  INSERT INTO user_roles (user_id, role)
  VALUES (target_user_id, target_role)
  ON CONFLICT (user_id) DO UPDATE SET role = target_role;

  RETURN json_build_object('success', true, 'message', 'Role assigned successfully');
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Grant execute permission to authenticated users
GRANT EXECUTE ON FUNCTION assign_admin_role(UUID, VARCHAR) TO authenticated;
