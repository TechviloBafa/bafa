/**
 * Environment Variable Validator
 * Validates that all required Supabase configuration is available
 */

interface EnvConfig {
  supabaseUrl: string;
  supabaseKey: string;
  projectId: string;
}

export function validateEnvironment(): EnvConfig {
  const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
  const supabaseKey = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY;
  const projectId = import.meta.env.VITE_SUPABASE_PROJECT_ID;

  const missing: string[] = [];

  if (!supabaseUrl) missing.push("VITE_SUPABASE_URL");
  if (!supabaseKey) missing.push("VITE_SUPABASE_PUBLISHABLE_KEY");
  // if (!projectId) missing.push("VITE_SUPABASE_PROJECT_ID"); // Not used

  if (missing.length > 0) {
    const error = `Missing required environment variables: ${missing.join(", ")}. 
    Please copy .env.example to .env and fill in the required values.`;
    console.error(error);
    throw new Error(error);
  }

  return {
    supabaseUrl,
    supabaseKey,
    projectId,
  };
}

// Validate on module load
try {
  validateEnvironment();
} catch (error) {
  console.error("Environment validation failed:", error);
}
