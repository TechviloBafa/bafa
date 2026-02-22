// Error handling utilities
export interface ErrorResponse {
  message: string;
  code: string;
  details?: string;
}

export function handleDatabaseError(error: { code?: string; message?: string } | null): ErrorResponse {
  if (!error) {
    return {
      message: "অজানা ত্রুটি ঘটেছে",
      code: "UNKNOWN_ERROR",
    };
  }

  // Handle Supabase specific errors
  if (error.code === "PGRST116") {
    return {
      message: "অনুমতি অস্বীকৃত",
      code: "PERMISSION_DENIED",
      details: "আপনার এই অপারেশনের অনুমতি নেই",
    };
  }

  if (error.code === "23505") {
    return {
      message: "এই ডেটা ইতিমধ্যে বিদ্যমান",
      code: "DUPLICATE_ENTRY",
      details: "একই তথ্য একাধিকবার যোগ করা যায় না",
    };
  }

  if (error.message) {
    return {
      message: error.message,
      code: error.code || "DATABASE_ERROR",
    };
  }

  return {
    message: "ডাটাবেস সমস্যা হয়েছে",
    code: "DATABASE_ERROR",
  };
}

export function handleNetworkError(): ErrorResponse {
  return {
    message: "নেটওয়ার্ক সংযোগ ব্যর্থ",
    code: "NETWORK_ERROR",
    details: "আপনার ইন্টারনেট সংযোগ পরীক্ষা করুন",
  };
}

export function handleValidationError(fields: string[]): ErrorResponse {
  return {
    message: `${fields.join(", ")} পূরণ করা আবশ্যক`,
    code: "VALIDATION_ERROR",
  };
}