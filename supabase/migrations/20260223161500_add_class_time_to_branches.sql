-- Add class_time column to branches table
ALTER TABLE branches ADD COLUMN IF NOT EXISTS class_time TEXT;
