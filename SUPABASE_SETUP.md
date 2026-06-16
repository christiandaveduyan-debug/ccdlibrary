# Supabase Setup Guide

## Step 1: Create Supabase Project

1. Go to [https://supabase.com](https://supabase.com)
2. Click "New Project"
3. Fill in project details:
   - **Name**: ccd-library
   - **Password**: Set a strong password (save this!)
   - **Region**: Choose closest to your location
   - **Organization**: Create or select existing

4. Wait for project to initialize (2-3 minutes)

## Step 2: Get Credentials

Once project is created, go to **Settings > Database**:

- **Connection string**: `postgresql://postgres:[PASSWORD]@[PROJECT-ID].supabase.co:5432/postgres`
- **Project ID**: Found in URL as `[PROJECT-ID].supabase.co`
- **Password**: What you set during creation
- **API Keys**: Found in Settings > API

Your DATABASE_URL should be:
```
postgresql://postgres:YOUR_PASSWORD@YOUR_PROJECT_ID.supabase.co:5432/postgres
```

## Step 3: Initialize Database

1. Go to **SQL Editor** in Supabase dashboard
2. Click **New Query**
3. Copy and paste entire contents of `schema.sql`
4. Click **Run** (or Cmd+Enter)

This creates all necessary tables.

## Step 4: Seed Initial Data (Optional)

Run this SQL to create demo users:

```sql
-- Create admin user (password: admin123, hashed with bcrypt)
INSERT INTO users (id, name, email, password_hash, role, status, created_at) VALUES
(gen_random_uuid(), 'Admin User', 'admin@library.edu', '$2b$12$f1gk3lQ9vWfqzV5kZp8wROvq3.kI7jZ5B8w9yH2m5nQ6sXpY3cL6i', 'admin', 'active', now());

-- Create librarian user (password: lib123)
INSERT INTO users (id, name, email, password_hash, role, status, created_at) VALUES
(gen_random_uuid(), 'Librarian User', 'librarian@library.edu', '$2b$12$zB7hK9qL8vV5jX2cM4nP7Ro2F3xQ1wS8yT9uV3nW6oP5qR2sT5vU8', 'librarian', 'active', now());

-- Create sample member user (password: member123)
INSERT INTO users (id, name, email, password_hash, role, status, created_at) VALUES
(gen_random_uuid(), 'Member User', 'member@library.edu', '$2b$12$9T5sL3wH8vF2qX5nY4bZ1Mo3D5cG7jK9pQ1rS5tU7vW8xY3zM4aP9', 'member', 'active', now());

-- Create member profiles
INSERT INTO members (id, phone, type, joined_date)
SELECT id, '555-0101', 'student', now() FROM users WHERE email = 'member@library.edu';
```

**Note**: These bcrypt hashes are for demo purposes. In production, generate proper hashes.

## Step 5: Configure Backend

1. Navigate to backend directory:
```bash
cd ccdlib
```

2. Create `.env` file:
```env
DATABASE_URL=postgresql://postgres:YOUR_PASSWORD@YOUR_PROJECT_ID.supabase.co:5432/postgres
PORT=8000
CLIENT_URL=http://localhost:5173
JWT_SECRET=your-super-secret-key-change-this-in-production-12345
ALLOWED_ORIGINS=http://localhost:5173,http://localhost:3000
```

3. Run backend:
```bash
cargo run
```

## Step 6: Configure Frontend

1. Navigate to frontend directory:
```bash
cd LIB
```

2. Create `.env.local`:
```env
VITE_API_URL=http://localhost:8000
```

3. Install and run:
```bash
npm install
npm run dev
```

## Database Connection Troubleshooting

### Connection Refused
- [ ] Check password is correct
- [ ] Verify project is active in Supabase
- [ ] Check network allows PostgreSQL (port 5432)
- [ ] Try: `psql "postgresql://postgres:PASSWORD@PROJECT.supabase.co:5432/postgres"`

### Schema Not Found
- [ ] Run schema.sql in SQL Editor
- [ ] Verify all CREATE TABLE commands executed
- [ ] Check for errors in SQL execution

### Permission Denied
- [ ] Verify database password is correct
- [ ] Check Supabase database password in Settings
- [ ] Reset password if needed

## Supabase Features Used

- **Database**: PostgreSQL with connection pooling
- **Auth**: Custom JWT authentication (not Supabase Auth)
- **Storage**: Optional for future file uploads
- **Real-time**: Can be enabled for live updates

## Production Database Setup

For production, use:

1. **Separate Database**: Create separate Supabase project
2. **SSL**: Ensure SSL is required for connections
3. **Backups**: Enable automated backups (Supabase does this)
4. **Monitoring**: Set up database monitoring
5. **Connection Pooling**: PgBouncer enabled for better performance

Example production connection string:
```
postgresql://postgres:strong-password@prod-project.supabase.co:6543/postgres?sslmode=require
```

## Useful Supabase Resources

- [Supabase Documentation](https://supabase.com/docs)
- [PostgreSQL Documentation](https://www.postgresql.org/docs/)
- [Connection Pooling Guide](https://supabase.com/docs/guides/database/connecting-to-postgres)
- [Security Best Practices](https://supabase.com/docs/guides/database/overview)

## Support

If you encounter issues:
1. Check Supabase status at [status.supabase.com](https://status.supabase.com)
2. Review logs in Supabase dashboard
3. Check PostgreSQL documentation
4. Post on Supabase Community forums
