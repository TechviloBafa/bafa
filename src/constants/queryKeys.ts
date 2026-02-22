/**
 * Centralized React Query Keys
 * Use these keys throughout the app for consistency
 */

export const queryKeys = {
  // Auth queries
  auth: {
    session: ["auth", "session"],
    user: ["auth", "user"],
  },

  // Admin Dashboard
  admin: {
    dashboard: {
      admissionsCount: ["admin", "dashboard", "admissions-count"],
      pendingCount: ["admin", "dashboard", "pending-count"],
      noticesCount: ["admin", "dashboard", "notices-count"],
      resultsCount: ["admin", "dashboard", "results-count"],
      recentAdmissions: ["admin", "dashboard", "recent-admissions"],
    },
  },

  // Admissions
  admissions: {
    all: ["admissions"],
    list: ["admissions", "list"],
    detail: (id: string) => ["admissions", id],
  },

  // Notices
  notices: {
    all: ["notices"],
    list: ["notices", "list"],
    detail: (id: string) => ["notices", id],
    admin: ["admin", "notices"],
  },

  // Results
  results: {
    all: ["results"],
    list: ["results", "list"],
    detail: (id: string) => ["results", id],
    admin: ["admin", "results"],
  },

  // Branches
  branches: {
    all: ["branches"],
    list: ["branches", "list"],
    detail: (id: string) => ["branches", id],
    admin: ["admin", "branches"],
  },

  // Gallery
  gallery: {
    all: ["gallery"],
    list: ["gallery", "list"],
    byCategory: (category: string) => ["gallery", "category", category],
    admin: ["admin", "gallery"],
  },
};
