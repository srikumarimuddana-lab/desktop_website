# ⚡ Quick Start Guide - Spinr CMS

## 🎯 3 Steps to Get Running

### 1️⃣ **Create Database Tables** (5 minutes)

```bash
# In Supabase Dashboard:
# SQL Editor → New Query → Paste contents of SUPABASE_SETUP.sql → Run
```

**What this does:**
- Creates `faqs`, `legal_docs`, and `seo_pages` tables
- Adds default SEO configurations
- Inserts starter content
- Sets up Row Level Security

---

### 2️⃣ **Create Admin User** (2 minutes)

```bash
# In Supabase Dashboard:
# Authentication → Users → Add User
# Email: admin@spinr.ca (or your email)
# Password: [your secure password]
# ✅ Check "Auto Confirm User"
```

**Optional:** Update admin email in `/app/app/spinr-internal/layout.js` line 12

---

### 3️⃣ **Login & Test** (1 minute)

```bash
# Go to: http://localhost:3000/spinr-internal/login
# Login with your Supabase credentials
# Test: Create a FAQ, it should appear on /support page
```

---

## 📁 Key Files Reference

| File | Purpose |
|------|---------|
| `SUPABASE_SETUP.sql` | Run this in Supabase SQL Editor first |
| `SETUP_INSTRUCTIONS.md` | Detailed setup guide |
| `IMPLEMENTATION_SUMMARY.md` | Complete feature list |
| `app/spinr-internal/seo/page.js` | SEO Manager admin panel |
| `app/sitemap.js` | Dynamic sitemap generator |
| `components/seo/JsonLdInjector.js` | Structured data component |

---

## 🎨 Admin Panel Routes

| Route | Description |
|-------|-------------|
| `/spinr-internal` | Dashboard (stats overview) |
| `/spinr-internal/faqs` | FAQ Manager |
| `/spinr-internal/policies` | Legal Document Editor (WYSIWYG) |
| `/spinr-internal/seo` | **NEW** - SEO Control Panel |
| `/spinr-internal/login` | Authentication |

---

## 🔍 Public Routes

| Route | Data Source | SEO-Enabled |
|-------|-------------|-------------|
| `/` | Static | ✅ Database-driven |
| `/drive` | Static | ✅ Database-driven |
| `/ride` | Static | ✅ Database-driven |
| `/about` | Static | ✅ Database-driven |
| `/support` | `faqs` table | ✅ Database-driven |
| `/legal/[slug]` | `legal_docs` table | ✅ Database-driven |
| `/sitemap.xml` | `seo_pages` table | ✅ Auto-generated |

---

## 🎯 What's Different After Database Setup?

### **Before Setup:**
- ❌ Stats show "0"
- ❌ Can't login (redirects to login page)
- ⚠️ Using fallback/demo data

### **After Setup:**
- ✅ Real data from Supabase
- ✅ Login works with your credentials
- ✅ Create/edit content persists
- ✅ Sitemap auto-updates from database
- ✅ SEO Manager fully functional

---

## 🚨 Common Issues

| Issue | Solution |
|-------|----------|
| "Table not found" error | Run SUPABASE_SETUP.sql in SQL Editor |
| Can't login | Create admin user in Supabase Auth |
| "Unauthorized access" | Update SUPER_ADMIN_EMAIL in layout.js |
| Stats showing 0 | Database tables not created yet |

---

## 🎉 Test Checklist

After setup, verify these work:

- [ ] Login at `/spinr-internal/login` with your credentials
- [ ] Dashboard shows real counts (not all zeros)
- [ ] Create a FAQ → appears on `/support` page
- [ ] Edit a legal doc → appears on `/legal/terms`
- [ ] Create SEO page → appears in `/sitemap.xml`
- [ ] Add JSON-LD → view page source to see `<script type="application/ld+json">`

---

## 📞 Need Help?

1. Check `SETUP_INSTRUCTIONS.md` for detailed steps
2. Check `IMPLEMENTATION_SUMMARY.md` for feature details
3. View logs: `tail -f /var/log/supervisor/nextjs.out.log`

---

## 🎊 You're All Set!

Once you complete the 3 steps above, you have:
- ✅ Full CMS for FAQs and legal docs
- ✅ Database-first SEO engine
- ✅ Secure admin authentication
- ✅ Dynamic sitemap generation
- ✅ JSON-LD structured data support

**No code changes needed to manage content or SEO!** 🚀
