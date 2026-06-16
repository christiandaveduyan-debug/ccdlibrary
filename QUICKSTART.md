# Quick Start Guide - CCD Library

Get the complete library management system running in 15 minutes!

## Prerequisites
- Supabase account (free at [supabase.com](https://supabase.com))
- Rust installed ([rustup.rs](https://rustup.rs/))
- Node.js 16+ installed

## 5-Minute Setup

### 1. Database Setup (3 minutes)

1. Create Supabase project at [supabase.com](https://supabase.com)
2. In SQL Editor, paste entire contents of `schema.sql`
3. Click Run
4. Copy your database URL from Settings > Database

### 2. Backend Setup (5 minutes)

```bash
# Navigate to backend
cd ccdlib

# Create .env file
cp .env.example .env

# Edit .env with your Supabase credentials
# Replace DATABASE_URL with your connection string
nano .env  # or use your editor

# Run backend
cargo run
```

**Backend running at:** `http://localhost:8000`

### 3. Frontend Setup (5 minutes)

```bash
# In new terminal, navigate to frontend
cd LIB

# Create environment file
echo "VITE_API_URL=http://localhost:8000" > .env.local

# Install and start
npm install
npm run dev
```

**Frontend running at:** `http://localhost:5173`

## Demo Credentials

After seeding database (see SUPABASE_SETUP.md):

```
Email: admin@library.edu
Password: admin123
```

## System Check

### Backend Health
```bash
curl http://localhost:8000/api/books
```
Should return JSON (may show permission error - that's OK)

### Frontend Loading
Visit `http://localhost:5173` - should see login page

## What's Connected

✅ **Frontend** ← → **Backend** ← → **Supabase (PostgreSQL)**

- Frontend sends requests to Backend REST API
- Backend authenticates with JWT tokens
- Data stored in Supabase PostgreSQL database
- All data flows encrypted over HTTPS

## Common Issues

### "Cannot connect to database"
- [ ] Check DATABASE_URL in .env
- [ ] Verify Supabase project is active
- [ ] Test connection: `psql "YOUR_DATABASE_URL"`

### "CORS error" in frontend
- [ ] Check backend is running on port 8000
- [ ] Verify CLIENT_URL in backend .env is http://localhost:5173

### "API call failed"
- [ ] Backend running? `cargo run` in ccdlib directory
- [ ] Frontend .env.local has correct API URL

### "Schema not found" error
- [ ] Run schema.sql in Supabase SQL Editor
- [ ] Refresh browser after running

## Next Steps

1. **Test Features**:
   - Login with demo account
   - Add books, members
   - Borrow/return books
   - Check fines calculation

2. **Customize**:
   - Modify colors in Tailwind config
   - Add your library logo
   - Update database with real data

3. **Deploy** (see INTEGRATION_GUIDE.md):
   - Backend to Vercel/Render
   - Frontend to Vercel/Netlify
   - Database already on Supabase

## File Locations

Key files you might need to modify:

- **Database**: `schema.sql` - Table definitions
- **Backend**: `ccdlib/src/api/library.rs` - API handlers
- **Frontend**: `LIB/src/components/` - UI components
- **Config**: `.env` (backend), `.env.local` (frontend)

## API Endpoints

All working after setup:

| Method | Endpoint | Purpose |
|--------|----------|---------|
| POST | `/api/login` | User login |
| POST | `/api/signup` | Register user |
| GET | `/api/books` | List books |
| POST | `/api/books` | Add book |
| GET | `/api/members` | List members |
| POST | `/api/borrow` | Borrow book |
| POST | `/api/return` | Return book |

## Documentation

- **Full Guide**: See `INTEGRATION_GUIDE.md`
- **Backend**: See `ccdlib/README.md`
- **Frontend**: See `LIB/README.md`
- **Database**: See `SUPABASE_SETUP.md`

## Support

Having issues? Check:
1. Terminal output for error messages
2. Browser DevTools (F12) for errors
3. [Troubleshooting section](INTEGRATION_GUIDE.md#troubleshooting)
4. Supabase dashboard for database status

## Success Checklist

- [ ] Backend starts with `cargo run`
- [ ] Frontend starts with `npm run dev`
- [ ] Can login with demo credentials
- [ ] Can view books page
- [ ] Can add new book
- [ ] Can view members page

If all above pass, system is fully integrated and working!

## Next: Production

Ready to go live?
1. Set up production Supabase project
2. Update credentials in `.env`
3. Deploy backend to Render/Railway
4. Deploy frontend to Vercel/Netlify
5. Update frontend API URL to production backend

See full deployment guide in `INTEGRATION_GUIDE.md`
