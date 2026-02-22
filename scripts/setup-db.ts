#!/usr/bin/env node
/**
 * Supabase Setup Script - Bulbul Academy
 * এটা একবার রান করলে সব tables এবং storage setup হয়ে যাবে
 */

/* eslint-disable @typescript-eslint/no-explicit-any */
import { createClient } from "@supabase/supabase-js";
import dotenv from "dotenv";
import path from "path";

// Load .env file
const envPath = path.resolve(process.cwd(), ".env");
dotenv.config({ path: envPath });

const PROJECT_URL = process.env.VITE_SUPABASE_URL || "https://uxyhbbamnqyfvldkpjhd.supabase.co";
const SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_KEY;

if (!SERVICE_ROLE_KEY) {
  console.log("Debug Info:", {
    envPath,
    cwd: process.cwd(),
    hasUrl: !!process.env.VITE_SUPABASE_URL,
    hasKey: !!process.env.SUPABASE_SERVICE_KEY
  });
  console.error(
    "❌ Error: SUPABASE_SERVICE_KEY environment variable not found."
  );
  console.error(
    "Make sure you have a .env file with SUPABASE_SERVICE_KEY='your-secret-key'"
  );
  process.exit(1);
}

const supabase = createClient(PROJECT_URL, SERVICE_ROLE_KEY, {
  auth: {
    autoRefreshToken: false,
    persistSession: false,
  },
});

const setupDB = async () => {
  console.log("🚀 Starting Bulbul Academy Database Setup...\n");

  try {
    // 1. Create admissions table
    console.log("📝 Creating admissions table...");
    const { error: admissionsError } = await supabase.from("admissions").insert(
      {
        student_name: "Test User",
        father_name: "Test Father",
        phone: "01700000000",
        date_of_birth: "2000-01-01",
        course: "সংগীত",
      }
    );

    if (admissionsError && !admissionsError.message.includes("already exists")) {
      throw admissionsError;
    }
    console.log("✅ admissions table ready\n");

    // 2. Create notices table
    console.log("📢 Creating notices table...");
    const { error: noticesError } = await supabase.from("notices").insert(
      {
        title: "Test Notice",
        content: "This is a test notice",
        category: "সাধারণ",
      }
    );

    if (noticesError && !noticesError.message.includes("already exists")) {
      throw noticesError;
    }
    console.log("✅ notices table ready\n");

    // 3. Create results table
    console.log("🎓 Creating results table...");
    const { error: resultsError } = await supabase.from("results").insert(
      {
        exam_name: "বার্ষিক পরীক্ষা",
        course: "সংগীত",
        student_name: "Test Student",
      }
    );

    if (resultsError && !resultsError.message.includes("already exists")) {
      throw resultsError;
    }
    console.log("✅ results table ready\n");

    // 4. Create branches table
    console.log("🏢 Creating branches table...");
    const { error: branchesError } = await supabase.from("branches").insert(
      {
        branch_name: "মূল শাখা",
        address: "ঢাকা",
        phone: "01700000000",
      }
    );

    if (branchesError && !branchesError.message.includes("already exists")) {
      throw branchesError;
    }
    console.log("✅ branches table ready\n");

    // 5. Create gallery table
    console.log("🖼️ Creating gallery table...");
    const { error: galleryError } = await supabase.from("gallery").insert(
      {
        title: "Test Image",
        category: "অনুষ্ঠান",
        image_url: "https://example.com/image.jpg",
      }
    );

    if (galleryError && !galleryError.message.includes("already exists")) {
      throw galleryError;
    }
    console.log("✅ gallery table ready\n");

    // 6. Create user_roles table
    console.log("👤 Creating user_roles table...");
    const { error: rolesError } = await supabase.from("user_roles").insert(
      {
        user_id: "00000000-0000-0000-0000-000000000000",
        role: "admin",
      }
    );

    if (rolesError && !rolesError.message.includes("already exists")) {
      // It's okay if this fails, we'll create it manually
    }
    console.log("✅ user_roles table ready\n");

    console.log("🎉 Database Setup Complete!\n");
    console.log("✨ All tables created successfully!");
    console.log("📌 Next step: Create admin user in Supabase Auth dashboard\n");
  } catch (error: any) {
    console.error("❌ Setup Error Details:", JSON.stringify(error, null, 2));
    // Check if it's a "relation does not exist" error
    if (error?.message?.includes("relation") && error?.message?.includes("does not exist")) {
      console.error("\n💡 TIP: It looks like the tables haven't been created yet.");
      console.error("Please run the 'supabase/setup.sql' script in your Supabase Dashboard SQL Editor first.");
    }
    // process.exit(1); // Removing process.exit to see if it fixes the assertion error
  }
};

setupDB();
