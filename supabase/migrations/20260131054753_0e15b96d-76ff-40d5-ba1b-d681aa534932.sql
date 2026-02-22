-- Create branches table
CREATE TABLE public.branches (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  address TEXT NOT NULL,
  phone TEXT NOT NULL,
  email TEXT,
  established TEXT,
  students INTEGER DEFAULT 0,
  teachers INTEGER DEFAULT 0,
  image_url TEXT,
  description TEXT,
  facilities TEXT[] DEFAULT '{}',
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.branches ENABLE ROW LEVEL SECURITY;

-- Anyone can read active branches
CREATE POLICY "Anyone can read active branches"
ON public.branches
FOR SELECT
USING (is_active = true);

-- Admins can manage branches
CREATE POLICY "Admins can manage branches"
ON public.branches
FOR ALL
USING (has_role(auth.uid(), 'admin'))
WITH CHECK (has_role(auth.uid(), 'admin'));

-- Create trigger for automatic timestamp updates
CREATE TRIGGER update_branches_updated_at
BEFORE UPDATE ON public.branches
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Insert sample branches data
INSERT INTO public.branches (name, address, phone, email, established, students, teachers, description, facilities) VALUES
('বুলবুল ললিতকলা একাডেমী - প্রধান শাখা', 'ঢাকা, বাংলাদেশ - 1000', '+880 1700000001', 'main@bulbullolitakola.edu.bd', '2000', 250, 15, 'বুলবুল ললিতকলা একাডেমী প্রধান শাখা শিল্প ও সংস্কৃতি চর্চার একটি অন্যতম প্রতিষ্ঠান।', ARRAY['সংগীত রুম', 'নৃত্য হল', 'চিত্রকলা স্টুডিও', 'লাইব্রেরি', 'অডিটোরিয়াম']),
('বুলবুল ললিতকলা একাডেমী - চট্টগ্রাম শাখা', 'চট্টগ্রাম, বাংলাদেশ - 4000', '+880 1700000002', 'ctg@bulbullolitakola.edu.bd', '2005', 180, 12, 'চট্টগ্রাম শাখায় সংগীত, নৃত্য, চিত্রকলা সহ বিভিন্ন বিষয়ে শিক্ষা প্রদান করা হয়।', ARRAY['সংগীত রুম', 'নৃত্য হল', 'চিত্রকলা স্টুডিও']),
('বুলবুল ললিতকলা একাডেমী - রাজশাহী শাখা', 'রাজশাহী, বাংলাদেশ - 6000', '+880 1700000003', 'raj@bulbullolitakola.edu.bd', '2008', 150, 10, 'রাজশাহী শাখায় শিল্প ও সংস্কৃতির চর্চা চলছে।', ARRAY['সংগীত রুম', 'নৃত্য হল', 'লাইব্রেরি']),
('বুলবুল ললিতকলা একাডেমী - খুলনা শাখা', 'খুলনা, বাংলাদেশ - 9000', '+880 1700000004', 'khulna@bulbullolitakola.edu.bd', '2010', 120, 8, 'খুলনা শাখায় শিল্প শিক্ষার জন্য আদর্শ পরিবেশ।', ARRAY['সংগীত রুম', 'নৃত্য হল']),
('বুলবুল ললিতকলা একাডেমী - সিলেট শাখা', 'সিলেট, বাংলাদেশ - 3100', '+880 1700000005', 'sylhet@bulbullolitakola.edu.bd', '2012', 100, 7, 'সিলেট শাখায় মানসম্মত শিল্প শিক্ষা।', ARRAY['সংগীত রুম', 'চিত্রকলা স্টুডিও']);