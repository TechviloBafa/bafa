# 👨‍🏫 Teacher/Admin Registration & Approval System

## Overview

শিক্ষকরা এখন নিজেরাই account create করতে পারবেন, এবং super admin তাদের approve করবেন। Password reset feature সহ সম্পূর্ণ workflow!

---

## 🔄 Workflow

```
Teacher/Admin
    ↓
Register Page (/admin/register)
    ↓
Email + Password দিয়ে register
    ↓
Supabase Auth এ auto user create (unverified)
    ↓
pending_admins table এ entry
    ↓
Status: "pending"
    ↓
Super Admin Dashboard
    ↓
Pending Approvals (/admin/approvals)
    ↓
Super Admin approve/reject করে
    ↓
Approve → user_roles table এ admin role add
    ↓
Teacher এখন login করতে পারবে
    ↓
Password Forgot? → (/admin/password-reset)
    ↓
Email link পায়
    ↓
নতুন password set করে
    ↓
Login!
```

---

## 📋 Database Schema

### pending_admins Table
```sql
CREATE TABLE pending_admins (
  id UUID PRIMARY KEY,
  email VARCHAR(255) UNIQUE,
  full_name VARCHAR(255),
  status VARCHAR(50) DEFAULT 'pending',  -- pending, approved, rejected
  approved_by UUID,                      -- super admin user id
  approved_at TIMESTAMP,
  created_at TIMESTAMP DEFAULT now(),
  updated_at TIMESTAMP DEFAULT now()
);
```

**Statuses:**
- `pending` - নতুন registration, অপেক্ষায়
- `approved` - Super admin approved করেছে
- `rejected` - Super admin reject করেছে

---

## 🔐 Security Features

✅ **RLS Policies:**
- Anyone can register (insert)
- Only admins can see pending admins
- Only admins can approve/reject
- Password reset via email only

✅ **Authentication:**
- Supabase auth দিয়ে user create
- Email verification (Supabase handles)
- Password reset link via email
- Service role key protected

---

## 📱 User Pages

### 1. **Registration Page** (`/admin/register`)

**Who can access:** Anyone (public)

**What happens:**
1. Teacher নাম, email, password দেয়
2. Validation check
3. Supabase Auth এ user create
4. pending_admins table এ entry
5. Success message দেখায়

**Fields:**
- Full Name (required)
- Email (required, unique)
- Password (min 6 chars)
- Confirm Password

### 2. **Admin Login Page** (`/admin/login`)

**Updated:**
- "Forgot Password?" link যোগ করা হয়েছে
- নিবন্ধন link যোগ করা হয়েছে

### 3. **Password Reset Page** (`/admin/password-reset`)

**Two States:**

**State 1: Request Reset**
- Email দিয়ে reset request করে
- System email ভেজায় reset link সহ
- 

**State 2: Set New Password**
- Email link এ click করলে যায়
- নতুন password সেট করে
- Auto redirect to login

---

## 🎯 Admin Panel Pages

### 4. **Pending Approvals** (`/admin/approvals`)

**Who can access:** Super admin only

**What's shown:**
- সব pending registrations এর list
- Teacher name, email, registration date
- Approve এবং Reject buttons

**Actions:**
- **Approve:**
  - Supabase auth থেকে user খুঁজে বের করে
  - user_roles table এ admin role add করে
  - pending_admins status update করে "approved"
  - Teacher এখন login করতে পারবে

- **Reject:**
  - pending_admins status update করে "rejected"
  - Supabase auth থেকে user delete করা যায় (optional)

---

## 🛠️ Implementation Details

### Files Created:

1. **`src/pages/admin/AdminRegistration.tsx`**
   - Registration form
   - Validation
   - Supabase auth integration
   - pending_admins insert

2. **`src/pages/admin/PasswordReset.tsx`**
   - Request reset email
   - Set new password
   - Supabase resetPasswordForEmail()
   - Supabase updateUser()

3. **`src/pages/admin/PendingAdminApprovals.tsx`**
   - List pending registrations
   - Approve/Reject logic
   - Admin role management
   - Real-time update

### Files Modified:

1. **`supabase/setup.sql`**
   - Added pending_admins table
   - Added RLS policies
   - Added indexes

2. **`src/App.tsx`**
   - New routes added
   - Imports updated

3. **`src/components/layout/Navbar.tsx`**
   - Registration link added
   - Top bar updated

4. **`src/pages/admin/AdminLogin.tsx`**
   - Password reset link added

5. **`src/components/admin/AdminLayout.tsx`**
   - Pending Approvals sidebar item
   - Clock icon imported

---

## 🚀 Setup Instructions

### Step 1: Update Supabase Database

1. Go to Supabase Dashboard
2. SQL Editor খুলুন
3. Copy করুন: `supabase/setup.sql` এর content
4. Paste এবং Execute করুন

**What it does:**
- pending_admins table create
- RLS policies enable
- Indexes add

### Step 2: Test Registration

1. যান: `http://localhost:8080/admin/register`
2. টেস্ট data fill করুন:
   ```
   Full Name: টেস্ট শিক্ষক
   Email: teacher@example.com
   Password: 123456
   ```
3. Register করুন
4. Check করুন Supabase:
   - Auth → Users (user create হয়েছে?)
   - SQL Editor: `SELECT * FROM pending_admins;` (entry আছে?)

### Step 3: Approve Registration

1. Super Admin দিয়ে login করুন
2. যান: `http://localhost:8080/admin/approvals`
3. Pending list দেখবেন
4. "অনুমোদন" button click করুন
5. Check Supabase:
   - user_roles table এ admin role entry?
   - pending_admins status "approved"?

### Step 4: Test New Admin Login

1. যান: `http://localhost:8080/admin/login`
2. নতুন teacher এর email/password দিয়ে login করুন
3. Dashboard should load!

### Step 5: Test Password Reset

1. Login page যান
2. "পাসওয়ার্ড ভুলে গেছেন?" click করুন
3. Email দিন
4. Supabase fake email service দেখায় (development mode)
5. Link copy করুন এবং test করুন

---

## 📧 Email Configuration (Production)

Production এ real emails পাঠানোর জন্য:

1. Supabase Dashboard → Authentication → Email Templates
2. Configure করুন:
   - Email verification template
   - Password reset template
   - Custom branding

3. SMTP setup করুন (optional):
   - Supabase → Project Settings → Email
   - SMTP credentials দিন

---

## 🔍 Database Queries

### See All Pending Approvals:
```sql
SELECT * FROM pending_admins WHERE status = 'pending';
```

### See Approved Admins:
```sql
SELECT 
  pa.email,
  pa.full_name,
  pa.approved_at,
  ur.role
FROM pending_admins pa
LEFT JOIN user_roles ur ON ur.user_id = (
  SELECT id FROM auth.users WHERE email = pa.email
)
WHERE pa.status = 'approved';
```

### Manually Approve (if needed):
```sql
UPDATE pending_admins 
SET status = 'approved', approved_at = now()
WHERE email = 'teacher@example.com';
```

### Add Admin Role (if needed):
```sql
INSERT INTO user_roles (user_id, role)
VALUES ('user-id-from-auth', 'admin');
```

---

## ⚠️ Common Issues

### Issue: "Permission denied" অনুমোদন করার সময়

**Cause:** Service role key problem

**Fix:**
```tsx
// PendingAdminApprovals.tsx এ
// এটা work করবে না:
const { data: { users } } = await supabase.auth.admin.listUsers();

// এর পরিবর্তে, direct তে check করুন:
// অথবা frontend থেকে admin.users() call বন্ধ করুন
```

### Issue: Email নিয়ে সমস্যা

**In Development:** Supabase captures emails দেখায়

**In Production:** Real SMTP configured হতে হবে

---

## 🎓 Best Practices

1. **Super Admin:** Only one super admin, multiple regular admins
2. **Password:** আপনার super admin password safe রাখুন
3. **Approval:** Manually review প্রতিটা registration
4. **Backup:** Regularly backup user_roles table
5. **Logs:** Monitor failed login attempts

---

## 📊 Flowchart

```
┌─────────────────────┐
│  Public Pages       │
│  (Home, Notices)    │
└─────────────────────┘

┌─────────────────────┐
│  Registration       │
│  /admin/register    │  ← Teacher আসে
└──────────┬──────────┘
           ↓
     ┌──────────────┐
     │ pending_    │
     │ admins      │
     │ status:     │
     │ pending     │
     └──────────┬──────┘
                ↓
        ┌─────────────────┐
        │  Super Admin    │
        │  /admin/        │
        │  approvals      │
        └────────┬────────┘
                 ↓
        ┌─────────────────┐
        │ Approve/Reject  │
        │ Button Click    │
        └────────┬────────┘
                 ↓
    ┌────────────────────────┐
    │   If APPROVED:          │
    │ 1. Find user in auth    │
    │ 2. Add admin role       │
    │ 3. Update status        │
    └────────┬───────────────┘
             ↓
        ┌─────────────────┐
        │ Teacher Login   │
        │ /admin/login    │
        │ ✓ succeeds      │
        └─────────────────┘
```

---

## 🎉 You're All Set!

এখন আপনার academy-তে শিক্ষকরা:
- ✅ নিজেরাই register করতে পারবে
- ✅ অপেক্ষা করবে super admin এর approval এর
- ✅ Password reset করতে পারবে
- ✅ Dashboard access পাবে একবার approved হলে

**Test it out!** 🚀
