# 🚀 Spinr CMS Setup Instructions

## 📋 Overview
This guide will help you complete the setup of your Spinr marketing website and CMS with a database-first SEO engine.

---

## ✅ PHASE 1: Database Setup (CRITICAL - DO THIS FIRST!)

### Step 1: Run the SQL Schema in Supabase

Your database tables don't exist yet. Follow these steps:

1. **Open Supabase Dashboard**
   - Go to: https://supabase.com/dashboard
   - Select your Spinr project

2. **Open SQL Editor**
   - Click on "SQL Editor" in the left sidebar
   - Click "New Query"

3. **Run the Schema**
   - Open the file `/app/SUPABASE_SETUP.sql` (it's in your project root)
   - Copy the **entire contents** of this file
   - Paste into the Supabase SQL Editor
   - Click "Run" (or press `Ctrl+Enter`)

4. **Verify Success**
   - You should see: `"Database schema created successfully! ✅"`
   - This creates 3 tables:
     - `faqs` - For FAQ management
     - `legal_docs` - For legal document management
     - `seo_pages` - For SEO metadata and sitemap control

### Step 2: Create Your Admin User

1. **Go to Supabase Authentication**
   - In your Supabase dashboard, click "Authentication" → "Users"
   - Click "Add User" (green button)

2. **Create Admin Account**
   - **Email**: Enter your email (e.g., `admin@spinr.ca`)
   - **Password**: Choose a secure password
   - ✅ Check "Auto Confirm User"
   - Click "Create User"

3. **Remember your credentials!** You'll need these to login to `/spinr-internal/login`

---

## 🔧 What Happens After You Run the SQL?

Once you run the SQL schema:

### ✅ **Immediate Benefits:**
1. **CMS Will Work**: You can create/edit FAQs and Legal Docs in the admin panel
2. **Public Pages Will Load Data**: The `/support` page will display real FAQs from the database
3. **Dashboard Stats Will Show**: Admin dashboard will display actual counts instead of "0"
4. **SEO System Ready**: Foundation for database-driven SEO is in place

### 🎯 **What I'll Implement Next:**

Once you confirm the tables are created, I will:

#### **Phase 2: Real Authentication**
- Remove the "Demo Mode" workaround
- Implement proper Supabase login with your admin credentials
- Secure the admin panel with real authentication

#### **Phase 3: Complete CMS Features**
- Build dynamic legal document pages at `/legal/[slug]`
- Fix admin dashboard stats to pull from database
- End-to-end testing of content workflow

#### **Phase 4: Database-First SEO Engine**
- Dynamic sitemap at `/sitemap.xml` (pulls from `seo_pages` table)
- Metadata management for every page (title, description, Open Graph)
- JSON-LD structured data injection (for Google Rich Results)
- Admin SEO editor at `/spinr-internal/seo` (full control over SEO)

---

## 🔐 Current Admin Access

**Before Authentication Implementation:**
- Go to: http://localhost:3000/spinr-internal/login
- Click: "Enter Demo Mode (No Auth)"
- This bypasses authentication for testing

**After I Implement Phase 2:**
- Use your real email/password from Supabase Auth
- Secure, persistent login session
- No more demo mode

---

## 📊 What's Already Built

### ✅ **Public Pages (With Theme & Images)**
- Home page (`/`) - Hero, features, CTA
- Drive page (`/drive`) - Driver benefits, earnings calculator
- Ride page (`/ride`) - Rider benefits, pricing
- About page (`/about`) - Company story
- Support page (`/support`) - FAQs with search (Shadcn Tabs + Accordions)

### ✅ **Admin Panel (`/spinr-internal`)**
- Dashboard with stats
- FAQ Manager (`/spinr-internal/faqs`)
- Policy Editor (`/spinr-internal/policies`) - WYSIWYG Tiptap editor
- Authentication guard (currently demo mode)

### ✅ **Design System**
- Primary Color: Bold Red (`#E63946`)
- Backgrounds: White & Light Gray
- Shadcn/UI components
- Saskatchewan-themed winter imagery
- Company logo and favicon integrated

---

## 🎯 Your Action Items

### **Right Now:**
1. ✅ Run `SUPABASE_SETUP.sql` in your Supabase SQL Editor
2. ✅ Create an admin user in Supabase Auth
3. ✅ Reply "Tables created!" so I can proceed with implementation

### **After Setup:**
- Test login at `/spinr-internal/login` with your admin credentials
- Create a test FAQ in the admin panel
- Verify it appears on `/support`

---

## 🆘 Troubleshooting

### "Could not find the table 'public.faqs'"
- **Cause**: The SQL schema hasn't been run yet
- **Fix**: Follow Phase 1 instructions above

### "Login Failed" or "Invalid Credentials"
- **Cause**: Admin user not created in Supabase Auth
- **Fix**: Follow Step 2 of Phase 1

### Want to Change Admin Email?
- After I implement Phase 2, I'll ask for your preferred admin email
- Currently hardcoded as `admin@spinr.ca` in the code

---

## 📞 Questions?

Just ask! I'm here to help you get Spinr fully operational.

Once you confirm the database is set up, I'll implement all remaining features in one go.
