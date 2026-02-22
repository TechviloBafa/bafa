# Security & Setup Guide

## 🔒 CRITICAL SECURITY INFORMATION

### 1. Environment Variables (.env file)

⚠️ **NEVER commit `.env` file to git** - It contains sensitive credentials!

1. Copy `.env.example` to `.env` in the project root:
```bash
cp .env.example .env
```

2. Fill in the values from your Supabase dashboard:
```
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_PUBLISHABLE_KEY=your_public_key_here
VITE_SUPABASE_PROJECT_ID=your_project_id_here
```

3. The `.env` file is already in `.gitignore`, so it won't be committed.

### 2. Supabase Service Role Key

⚠️ **NEVER expose your Service Role Key** in your codebase!

- Keep it ONLY in your Supabase account
- Use it ONLY in backend operations (like the setup script)
- Never pass it to the frontend

### 3. Row Level Security (RLS)

All database tables now have RLS enabled with the following policies:

- **Public Read**: Anyone can read notices, results, branches, gallery
- **Admin Only Write/Delete**: Only users with `admin` role can create/update/delete content
- **User Data**: Users can only see their own admission applications
- **Role Management**: Only system (service role) can manage user roles

### 4. Admin Authentication

To set up admin users:

1. Create a user in Supabase Auth
2. Add their `user_id` to the `user_roles` table with role='admin'

```sql
INSERT INTO user_roles (user_id, role)
VALUES ('user-uuid-here', 'admin');
```

### 5. Running Database Setup

To set up the database from scratch:

```bash
# Option 1: Using Supabase CLI
supabase db push

# Option 2: Run manually in Supabase SQL Editor
# Copy the contents of supabase/setup.sql
# Paste into Supabase SQL Editor and run
```

---

## 🚀 Development Setup

```bash
# 1. Install dependencies
npm install

# 2. Setup environment variables
cp .env.example .env
# Then edit .env with your Supabase credentials

# 3. Start development server
npm run dev

# 4. Build for production
npm run build

# 5. Preview production build
npm preview
```

---

## 📋 Project Structure

```
src/
├── components/
│   ├── ErrorBoundary.tsx       # Global error handler
│   ├── PrivateRoute.tsx         # Protected route wrapper
│   ├── admin/                   # Admin components
│   ├── home/                    # Home page components
│   └── layout/                  # Layout components
├── pages/                       # Page components
├── hooks/                       # Custom React hooks
├── integrations/                # Supabase & API integration
│   ├── client.ts               # Supabase client
│   ├── auth.ts                 # Auth functions
│   ├── envValidator.ts         # Environment validation
│   └── ...
├── constants/
│   └── queryKeys.ts            # Centralized React Query keys
└── lib/
    └── utils.ts                # Utility functions
```

---

## 🔑 Key Components

### ErrorBoundary
Catches runtime errors and displays error UI:
```tsx
<ErrorBoundary>
  <App />
</ErrorBoundary>
```

### PrivateRoute
Protects routes and requires authentication:
```tsx
<PrivateRoute requiredRole="admin">
  <AdminDashboard />
</PrivateRoute>
```

### Query Keys
Centralized React Query keys for consistency:
```typescript
import { queryKeys } from "@/constants/queryKeys";

useQuery({
  queryKey: queryKeys.admin.dashboard.noticesCount,
  queryFn: ...
});
```

---

## 🧪 Testing

```bash
# Run tests
npm run test

# Run tests in watch mode
npm test:watch
```

---

## 📊 Database Tables

- **admissions**: Student admission applications
- **notices**: School notices and announcements
- **results**: Exam results
- **branches**: School branches
- **gallery**: Gallery images
- **user_roles**: Admin role assignments

---

## ⚠️ Important Notes

1. **Credentials**: All sensitive data should be in environment variables
2. **RLS**: Never disable Row Level Security in production
3. **Backups**: Regularly backup your Supabase database
4. **Logs**: Monitor Supabase logs for suspicious activity
5. **Updates**: Keep dependencies updated for security patches

---

## 🆘 Troubleshooting

### Environment Variables Not Loading
- Check `.env` file exists and is in project root
- Make sure `.env` is not in `.gitignore` (it should stay there!)
- Restart dev server after changing `.env`

### Auth Errors
- Verify user exists in Supabase Auth
- Check user has admin role in `user_roles` table
- Clear browser localStorage and try again

### Database Errors
- Check RLS policies in Supabase dashboard
- Verify database tables were created from setup.sql
- Check Supabase service role key permissions

---

## 📞 Support

For issues with:
- **Supabase**: https://supabase.com/docs
- **React Query**: https://tanstack.com/query/latest
- **React Router**: https://reactrouter.com/
