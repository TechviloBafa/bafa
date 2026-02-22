# বুলবুল ললিতকলা একাডেমী 

আমাদের নতুন এবং উন্নত ওয়েবসাইট!

## 📚 Documentation

**শুরু করতে চান?** 👇
- **[QUICK_START.md](QUICK_START.md)** - ৫ মিনিটে শুরু করুন
- **[FIXES_SUMMARY.md](FIXES_SUMMARY.md)** - কি ঠিক করা হয়েছে দেখুন
- **[SECURITY_SETUP.md](SECURITY_SETUP.md)** - সুরক্ষা এবং সেটআপ গাইড
- **[DEPLOYMENT_CHECKLIST.md](DEPLOYMENT_CHECKLIST.md)** - লঞ্চের আগে চেকলিস্ট

## 🚀 দ্রুত শুরু

```bash
# 1. ডিপেন্ডেন্সি ইনস্টল করুন
npm install

# 2. পরিবেশ ভেরিয়েবল সেটআপ করুন
cp .env.example .env
# এবং .env ফাইলে আপনার Supabase ক্রেডেনশিয়াল দিন

# 3. ডেভেলপমেন্ট সার্ভার শুরু করুন
npm run dev
```

ব্রাউজার খুলুন: **http://localhost:8080**

## ✨ এই প্রজেক্টে কী আছে

**🔒 সুরক্ষা**
- ✅ পরিবেশ ভেরিয়েবল সুরক্ষিত
- ✅ ডাটাবেস RLS নীতি
- ✅ অ্যাডমিন প্রমাণীকরণ
- ✅ সুরক্ষিত রুট (Protected Routes)

**⚡ বৈশিষ্ট্য**
- ✅ ত্রুটি সীমানা (Error Boundary)
- ✅ প্রশাসনিক প্যানেল
- ✅ ভর্তি ফর্ম
- ✅ নোটিশ ব্যবস্থাপনা
- ✅ ফলাফল ব্যবস্থাপনা
- ✅ গ্যালারি ব্যবস্থাপনা

## 📝 কমান্ডগুলি

```bash
# ডেভেলপমেন্ট
npm run dev        # শুরু করুন
npm run lint       # কোড চেক করুন

# প্রোডাকশন
npm run build      # বিল্ড করুন
npm run preview    # প্রিভিউ দেখুন

# টেস্টিং
npm test           # টেস্ট চালান
npm test:watch    # ওয়াচ মোডে টেস্ট
```

## 📂 প্রজেক্ট কাঠামো

```
src/
├── components/       # React কম্পোনেন্ট
├── pages/           # পৃষ্ঠা কম্পোনেন্ট
├── hooks/           # কাস্টম হুক
├── integrations/    # Supabase এবং API
├── constants/       # ধ্রুবক
└── lib/            # ইউটিলিটি ফাংশন
```

## 🔑 গুরুত্বপূর্ণ তথ্য

⚠️ **কখনও করবেন না:**
- `.env` ফাইল গিটে কমিট করবেন না
- Supabase Service Key প্রকাশ করবেন না
- ডাটাবেস RLS পলিসি বন্ধ করবেন না

✅ **সর্বদা করুন:**
- `.env.example` ব্যবহার করুন টেমপ্লেট হিসেবে
- পরিবর্তনগুলি `.env` শুধুমাত্রে করুন
- Supabase ক্রেডেনশিয়াল নিরাপদ রাখুন

## 📖 আরও জানার জন্য

- **ডিটেইলড গাইড**: [SECURITY_SETUP.md](SECURITY_SETUP.md)
- **যা ঠিক হয়েছে**: [FIXES_SUMMARY.md](FIXES_SUMMARY.md)
- **লঞ্চের জন্য**: [DEPLOYMENT_CHECKLIST.md](DEPLOYMENT_CHECKLIST.md)

## 🎯 পরবর্তী ধাপ

1. **পড়ুন**: [QUICK_START.md](QUICK_START.md)
2. **সেটআপ করুন**: `.env` ফাইল কনফিগার করুন
3. **শুরু করুন**: `npm run dev` চালান
4. **তৈরি করুন**: আপনার বৈশিষ্ট্য যোগ করুন

---

**আরও প্রশ্ন?** [SECURITY_SETUP.md](SECURITY_SETUP.md) দেখুন! 🚀

- Edit files directly within the Codespace and commit and push your changes once you're done.

## What technologies are used for this project?

This project is built with:

- Vite
- TypeScript
- React
- shadcn-ui
- Tailwind CSS

## How can I deploy this project?

Simply open [Lovable](https://lovable.dev/projects/REPLACE_WITH_PROJECT_ID) and click on Share -> Publish.

## Can I connect a custom domain to my Lovable project?

Yes, you can!

To connect a domain, navigate to Project > Settings > Domains and click Connect Domain.

Read more here: [Setting up a custom domain](https://docs.lovable.dev/features/custom-domain#custom-domain)
