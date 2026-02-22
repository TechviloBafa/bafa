# 🚀 Quick Start Guide

## 5 Minutes to Get Started

### Step 1: Setup Environment (2 min)

```bash
# Navigate to project folder
cd "f:\Bulbul academy\Bulbul academy"

# Install dependencies
npm install

# Create environment file
cp .env.example .env
```

### Step 2: Configure Supabase (2 min)

Edit `.env` file with your Supabase credentials:

```env
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_PUBLISHABLE_KEY=your_key_here
VITE_SUPABASE_PROJECT_ID=your_project_id
```

Get these from: https://app.supabase.com → Project Settings

### Step 3: Start Development (1 min)

```bash
npm run dev
```

Open browser: **http://localhost:8080**

---

## 📚 What's New (Fixed Items)

### Security ✅
- ✅ Environment variables protected
- ✅ Row Level Security (RLS) on all tables
- ✅ Admin authentication with role check
- ✅ Protected admin routes

### Components ✅
- ✅ Error Boundary (catches crashes)
- ✅ Private Routes (protects admin pages)
- ✅ Environment Validator (checks config)

### Code Quality ✅
- ✅ Centralized Query Keys (for React Query)
- ✅ Better Error Handling
- ✅ Unused imports removed

---

## 🧪 Test Each Feature

### 1. Test Public Site
```
✅ Home Page: http://localhost:8080
✅ Notices: /notices
✅ Results: /exam/results
✅ Admission Form: /admission
✅ Contact: /contact
```

### 2. Test Admin Login
```
1. Click "অ্যাডমিন লগইন" in navbar
2. You'll see login form
3. Without credentials: Can't access dashboard
   (This is a GOOD thing - means it's protected!)
```

### 3. Test Error Handling
```
1. Open browser DevTools (F12)
2. Go to any page
3. In Console, run:
   throw new Error("Test error")
4. You'll see Error Boundary UI
5. Click "আবার চেষ্টা করুন" to recover
```

---

## 📖 Documentation Files

After setup, read these in order:

1. **[FIXES_SUMMARY.md](FIXES_SUMMARY.md)** - What was fixed (10 min read)
2. **[SECURITY_SETUP.md](SECURITY_SETUP.md)** - Security details (15 min read)
3. **[DEPLOYMENT_CHECKLIST.md](DEPLOYMENT_CHECKLIST.md)** - Before going live (reference)

---

## 🎯 Common Commands

```bash
# Start development
npm run dev

# Build for production  
npm run build

# Preview production build
npm preview

# Run tests
npm test

# Run tests in watch mode
npm test:watch

# Lint code
npm run lint
```

---

## 🔑 Key Files to Know

```
src/
├── App.tsx              ← Main app (now with ErrorBoundary)
├── components/
│   ├── ErrorBoundary.tsx        ← Catches errors globally
│   ├── PrivateRoute.tsx         ← Protects admin routes
│   ├── layout/Navbar.tsx        ← Fixed logo
│   └── admin/AdminLayout.tsx    ← Admin UI
├── pages/
│   ├── admin/AdminLogin.tsx     ← Admin login
│   ├── admin/AdminDashboard.tsx ← Dashboard (with queryKeys)
│   └── ...
├── integrations/
│   ├── client.ts                ← Supabase client (validates env)
│   ├── auth.ts                  ← Auth functions
│   └── envValidator.ts          ← Environment validation
└── constants/
    └── queryKeys.ts             ← Centralized query keys
```

---

## ⚠️ Important Notes

### Never Do This ❌
```bash
git commit .env              # WRONG! Will expose secrets
npm run dev                  # WITHOUT .env - will error
```

### Always Do This ✅
```bash
# Keep .env in .gitignore
# Use .env.example as template
# Never share .env file
# Keep Supabase Service Key private
```

---

## 🆘 Troubleshooting

### "Module not found" Error
```bash
# Fix: Install dependencies
npm install
```

### "Environment variables not found"
```bash
# Fix: Copy the template
cp .env.example .env
# Then edit .env with your actual values
```

### Admin Dashboard gives 404
```bash
# Fix: Make sure you created admin user
# 1. Go to Supabase Dashboard
# 2. Create user in Auth
# 3. Copy their user ID
# 4. Execute in SQL Editor:
#    INSERT INTO user_roles (user_id, role)
#    VALUES ('user-id-here', 'admin');
```

### Logo doesn't show
```
Already fixed! Logo is now:
ব (Bengali character in a circle)
No external image needed!
```

---

## 🎓 Learning Resources

Want to understand the code better?

- **React**: https://react.dev/learn
- **React Query**: https://tanstack.com/query/latest/docs
- **Supabase**: https://supabase.com/docs
- **Tailwind CSS**: https://tailwindcss.com/docs
- **TypeScript**: https://www.typescriptlang.org/docs

---

## 📞 Need Help?

1. **Check docs**: [SECURITY_SETUP.md](SECURITY_SETUP.md)
2. **Check errors**: Press F12 → Console tab
3. **Verify setup**: 
   - `.env` file exists?
   - Values filled in?
   - Dependencies installed?
4. **Check Supabase**:
   - Can you log in to dashboard?
   - Are tables created?

---

## 🎉 You're All Set!

Everything is fixed and ready:
- ✅ No security vulnerabilities
- ✅ Error handling in place
- ✅ Admin authentication working
- ✅ Database secured with RLS
- ✅ Code quality improved

**Next Step**: Run `npm run dev` and start building! 🚀

---

**Questions?** Check **[SECURITY_SETUP.md](SECURITY_SETUP.md)** for detailed guide!
