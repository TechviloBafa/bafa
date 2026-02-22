# Pre-Deployment Checklist

## 🚀 Before Going Live

### Week 1: Setup & Configuration

- [ ] **Environment Variables**
  - [ ] Copy `.env.example` to `.env` (if not already done)
  - [ ] Fill in all Supabase credentials from dashboard
  - [ ] Verify `.env` is in `.gitignore`
  - [ ] Test that app loads without errors

- [ ] **Database Setup**
  - [ ] Open Supabase SQL Editor
  - [ ] Copy contents of `supabase/setup.sql`
  - [ ] Paste and execute in SQL Editor
  - [ ] Verify all tables created successfully
  - [ ] Verify RLS policies are enabled

- [ ] **Admin User Setup**
  - [ ] Create first admin user in Supabase Auth
  - [ ] Get their user ID
  - [ ] Execute in Supabase SQL Editor:
    ```sql
    INSERT INTO user_roles (user_id, role)
    VALUES ('user-uuid-here', 'admin');
    ```
  - [ ] Test admin login
  - [ ] Verify dashboard loads

### Week 2: Data Migration

- [ ] **Migrate Existing Data** (if any)
  - [ ] Export data from old system
  - [ ] Transform to match database schema
  - [ ] Import into Supabase tables
  - [ ] Verify data integrity

- [ ] **Test Admission Form**
  - [ ] Submit test admission
  - [ ] Verify data appears in database
  - [ ] Test validation errors
  - [ ] Test file uploads (if any)

- [ ] **Test Admin Panel**
  - [ ] Create a notice
  - [ ] Update a notice
  - [ ] Delete a notice
  - [ ] Create results
  - [ ] Manage branches
  - [ ] Update gallery

### Week 3: Security Review

- [ ] **Security Check**
  - [ ] Verify no hardcoded secrets in code
  - [ ] Check all env variables are used
  - [ ] Verify RLS policies are working
  - [ ] Test unauthenticated access (should be denied for admin)
  - [ ] Test authenticated but non-admin access (should be denied)

- [ ] **Backup Configuration**
  - [ ] Enable automatic backups in Supabase
  - [ ] Set retention period (30+ days recommended)
  - [ ] Test backup/restore procedure
  - [ ] Document backup process

- [ ] **Monitoring Setup**
  - [ ] Enable Supabase logs
  - [ ] Set monitoring alerts (optional)
  - [ ] Review security rules one more time

### Week 4: Performance & Testing

- [ ] **Performance Testing**
  - [ ] Test app with 100+ admissions
  - [ ] Test with 1000+ notices
  - [ ] Check loading times
  - [ ] Verify indexes are working

- [ ] **Browser Testing**
  - [ ] Test on Chrome
  - [ ] Test on Firefox
  - [ ] Test on Safari
  - [ ] Test on mobile browsers
  - [ ] Test on mobile devices

- [ ] **Functionality Testing**
  - [ ] Test all public pages load
  - [ ] Test navigation between pages
  - [ ] Test admin login flow
  - [ ] Test admin CRUD operations
  - [ ] Test error scenarios
  - [ ] Test error boundary (intentionally break a component)

### Week 5: Deployment

- [ ] **Build Production Version**
  ```bash
  npm run build
  ```
  - [ ] Verify build completes without errors
  - [ ] Check build output size
  - [ ] Test build locally: `npm run preview`

- [ ] **Deploy to Hosting**
  - [ ] Choose hosting (Vercel, Netlify, etc.)
  - [ ] Connect GitHub repository
  - [ ] Set environment variables
  - [ ] Deploy production build
  - [ ] Verify deployment successful

- [ ] **DNS & Domain**
  - [ ] Update DNS settings (if using custom domain)
  - [ ] Set up SSL certificate
  - [ ] Test HTTPS works
  - [ ] Verify domain points to correct site

- [ ] **Post-Deploy Verification**
  - [ ] Test website on live domain
  - [ ] Test all pages load
  - [ ] Test admin panel on live site
  - [ ] Verify database connections work
  - [ ] Check browser console for errors

### Final Checks

- [ ] **User Acceptance Testing**
  - [ ] Give test account to principal/administrator
  - [ ] They test admin panel
  - [ ] Get feedback and fix issues
  - [ ] Run final round of testing

- [ ] **Documentation**
  - [ ] Update README with deployment info
  - [ ] Create admin manual (how to use admin panel)
  - [ ] Document common issues and solutions
  - [ ] Create user guide for admission process

- [ ] **Communication**
  - [ ] Prepare launch announcement
  - [ ] Email to stakeholders
  - [ ] Update website about new features
  - [ ] Provide support contact info

---

## 📋 Quick Reference

### Critical URLs
- Supabase Dashboard: https://app.supabase.com
- Production Site: https://your-domain.com
- Admin Panel: https://your-domain.com/admin/dashboard

### Important Credentials to Secure
- [ ] Supabase Service Role Key (keep in account only)
- [ ] Database passwords
- [ ] Admin user credentials
- [ ] Domain registrar credentials

### Emergency Contacts
- [ ] Supabase support: support@supabase.io
- [ ] Hosting provider support
- [ ] Domain registrar support
- [ ] Your development team

---

## 🔴 CRITICAL REMINDERS

⚠️ **BEFORE DEPLOYMENT:**
1. **DO NOT** commit `.env` file
2. **DO NOT** expose Service Role Key
3. **DO NOT** disable RLS policies
4. **DO** test admin login
5. **DO** verify database backups work
6. **DO** test error handling

⚠️ **AFTER DEPLOYMENT:**
1. Monitor error logs daily for first week
2. Keep backups enabled
3. Have admin team on standby
4. Document any issues found
5. Plan regular maintenance

---

## 📞 Support Resources

- **Supabase Docs**: https://supabase.com/docs
- **React Docs**: https://react.dev
- **React Query Docs**: https://tanstack.com/query/
- **Tailwind CSS**: https://tailwindcss.com/docs

---

## ✅ Sign-Off

- [ ] **Developer**: Code reviewed and tested
- [ ] **Admin**: Data setup and access verified
- [ ] **Manager**: Security review completed
- [ ] **Team Lead**: Ready for production

**Deployment Date**: ________________  
**Deployed By**: ________________  
**Approved By**: ________________

---

**Good luck with your launch! 🚀**
