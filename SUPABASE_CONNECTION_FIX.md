# Supabase Connection Fix Guide

## Current Issue
Database connection failing with: `password authentication failed for user "postgres"`

This means your DATABASE_URL has an incorrect password or the Supabase project needs verification.

---

## Step 1: Verify/Update Supabase Credentials

### Get Correct Connection String:
1. Go to **[supabase.com](https://supabase.com)** and log in
2. Select your project `fqrvivavvzhkdjkuweab` (City College Davao)
3. Click **Settings** → **Database**
4. Look for **Connection string** section
5. You'll see two options:

```
# Option 1: Direct Connection (slower)
postgresql://postgres:[PASSWORD]@aws-1-ap-northeast-1.supabase.co:5432/postgres

# Option 2: Connection Pooler (recommended for apps)
postgresql://postgres.[PROJECT_ID]:password@aws-1-ap-northeast-1.pooler.supabase.co:5432/postgres
```

### Current URL in .env
```
postgresql://postgres.fqrvivavvzhkdjkuweab:sidi_1121200@aws-1-ap-northeast-1.pooler.supabase.com:5432/postgres
```

⚠️ **Note**: Check if password `sidi_1121200` is correct!

---

## Step 2: Update DATABASE_URL

Edit `/ccdlib/.env` and replace the DATABASE_URL:

```env
DATABASE_URL=postgresql://postgres.fqrvivavvzhkdjkuweab:YOUR_ACTUAL_PASSWORD@aws-1-ap-northeast-1.pooler.supabase.com:5432/postgres
```

**For special characters in password**, URL encode them:
- `@` → `%40`
- `#` → `%23`
- `:` → `%3A`
- `%` → `%25`

---

## Step 3: Create Database Schema

1. In **Supabase Dashboard**, go to **SQL Editor**
2. Click **New Query**
3. Open [schema.sql](./ccdlib/schema.sql)
4. Copy entire contents and paste into Supabase SQL Editor
5. Click **Run** (Cmd+Enter)

This creates:
- `users` table
- `books` table
- `members` table
- `categories`, `authors`, `publishers` tables
- All required indexes and constraints

---

## Step 4: Test Connection

### Option A: Direct Test (Windows PowerShell)

```powershell
cd c:\Users\Acer\Downloads\City-College-of-Davao-Library-main\ccdlib

# Run backend server
cargo run
```

**Expected Output:**
```
Server running on http://0.0.0.0:8000
✓ Database connection successful!
```

### Option B: Test with psql (if installed)

```bash
psql "postgresql://postgres.fqrvivavvzhkdjkuweab:sidi_1121200@aws-1-ap-northeast-1.pooler.supabase.com:5432/postgres"
```

---

## Step 5: Start Full Application Stack

### Terminal 1: Backend Server
```powershell
cd c:\Users\Acer\Downloads\City-College-of-Davao-Library-main\ccdlib
cargo run
# Runs on http://localhost:8000
```

### Terminal 2: Frontend Server
```powershell
cd c:\Users\Acer\Downloads\City-College-of-Davao-Library-main\City-College-of-Davao-Library-main\LIB
npm install  # First time only
npm run dev
# Runs on http://localhost:5173
```

---

## Troubleshooting

### Connection Timeout
- The Supabase project might be paused
- Go to Supabase Dashboard → Project Settings → Pause/Resume to verify

### Wrong Password Error
- Reset password in Supabase: Settings → Database → Reset Database Password
- Wait 1 minute
- Update .env with new password

### "relation does not exist" Error
- Schema.sql hasn't been run
- Execute schema.sql in Supabase SQL Editor (see Step 3)

### Firewall/Network Error
- Try connection pooler instead: `.pooler.supabase.com` ✅ (already using this)
- If still blocked, contact your network admin

---

## Configuration Files Status

| File | Status | Notes |
|------|--------|-------|
| `.env` (backend) | ✅ Updated | Has all required vars |
| `.env.local` (frontend) | ✅ Ready | Points to localhost:8080 |
| `schema.sql` | ⚠️ Needs execution | Must run in Supabase dashboard |
| `Cargo.toml` | ✅ Complete | All dependencies present |
| `package.json` | ✅ Complete | All npm packages configured |

---

## What Each Service Does

```
Frontend (http://localhost:5173)
    ↓ API calls
Backend (http://localhost:8000)
    ↓ SQL queries
Supabase PostgreSQL Database
```

Once backend connects successfully, frontend will auto-connect to it.

---

## Next Steps

1. **Update** the DATABASE_URL password in `.env`
2. **Execute** schema.sql in Supabase dashboard
3. **Start** backend with `cargo run`
4. **Start** frontend with `npm run dev`
5. **Login** at http://localhost:5173 with demo credentials (see SUPABASE_SETUP.md)

Good luck! 🚀
