# Integration Troubleshooting Guide

## Backend Issues

### 1. Database Connection Errors

**Error**: `Connection refused` or `could not connect to server`

**Causes & Solutions**:
- [ ] Wrong DATABASE_URL
  - Check format: `postgresql://postgres:PASSWORD@HOST:5432/postgres`
  - Verify password doesn't have special characters needing encoding
  
- [ ] Supabase project not active
  - Go to supabase.com and check project status
  - Verify project hasn't been deleted/paused
  
- [ ] Network/Firewall blocking
  - Test with: `psql "YOUR_DATABASE_URL"`
  - Check if PostgreSQL is accessible from your machine
  
- [ ] Port not accessible
  - Default Supabase port: 5432
  - Some networks block this - try Supabase connection pooler on port 6543

**Solution**:
```bash
# Test connection directly
psql "postgresql://postgres:yourpassword@projectid.supabase.co:5432/postgres"

# If that fails, use connection pooler
psql "postgresql://postgres:yourpassword@projectid.supabase.co:6543/postgres"
```

### 2. Schema Not Created

**Error**: `relation "books" does not exist`

**Causes & Solutions**:
- [ ] schema.sql not executed
  - Go to Supabase SQL Editor
  - Create new query
  - Paste entire schema.sql
  - Click Run
  
- [ ] SQL errors during execution
  - Look for red error messages
  - Check specific CREATE TABLE line
  - Verify all extensions exist (uuid-ossp)
  
- [ ] Wrong database selected
  - Ensure you're in default postgres database
  - Not a different project

**Solution**:
```sql
-- In Supabase SQL Editor, run this to verify:
SELECT table_name FROM information_schema.tables 
WHERE table_schema = 'public';

-- Should list: users, books, members, categories, etc.
```

### 3. Port Already in Use

**Error**: `Address already in use` on port 8000

**Solutions**:
```bash
# Find process using port 8000
lsof -i :8000

# Kill the process
kill -9 <PID>

# Or use different port
PORT=8001 cargo run
```

### 4. JWT Token Errors

**Error**: `Invalid token` or `token not found`

**Causes & Solutions**:
- [ ] JWT_SECRET not set in .env
  ```bash
  # Must be at least 32 characters
  JWT_SECRET=your-super-secret-key-change-this-in-production-12345
  ```

- [ ] Token not sent in request
  - Frontend must include: `Authorization: Bearer YOUR_TOKEN`
  - Check browser DevTools Network tab

- [ ] Token expired
  - Tokens expire after 24 hours
  - Frontend must handle token refresh

**Solution**:
```bash
# Generate new secret
head -c 32 /dev/urandom | base64

# Update .env and restart
```

### 5. CORS Errors

**Error**: `Access-Control-Allow-Origin` not present

**Causes & Solutions**:
- [ ] Wrong CLIENT_URL in backend .env
  ```env
  CLIENT_URL=http://localhost:5173  # Exactly as frontend runs
  ```

- [ ] Frontend on different port
  - Update CLIENT_URL to match
  - Restart backend

- [ ] Wrong ALLOWED_ORIGINS
  ```env
  ALLOWED_ORIGINS=http://localhost:5173,http://localhost:3000
  ```

**Solution**:
1. Check frontend URL in browser
2. Update backend CLIENT_URL exactly
3. Restart backend with: `cargo run`

### 6. Password Hash Errors

**Error**: `password verification failed` or `bcrypt error`

**Causes & Solutions**:
- [ ] Password not properly hashed
  - Use bcrypt for password hashing
  - Hash must be 60 characters

- [ ] Demo password incorrect
  - Default: `admin123`
  - Different from reset password

**Solution**:
```bash
# Use example generator
cd examples
cargo run --example gen_hash
```

## Frontend Issues

### 1. API Connection Failed

**Error**: `Failed to reach backend` or `Cannot GET /api/books`

**Causes & Solutions**:
- [ ] Backend not running
  ```bash
  # In backend directory
  cargo run
  # Should show: Server running on http://0.0.0.0:8000
  ```

- [ ] Wrong API URL in .env.local
  ```env
  VITE_API_URL=http://localhost:8000
  ```

- [ ] Port mismatch
  - Backend default: 8000
  - Check `PORT` in backend .env

**Solution**:
1. Verify backend running: `http://localhost:8000/api/books`
2. Check frontend .env.local for correct URL
3. Restart frontend: `npm run dev`

### 2. Login Fails

**Error**: `Invalid email or password` or blank error

**Causes & Solutions**:
- [ ] Wrong credentials
  - Default: admin@library.edu / admin123
  - Check capitalization

- [ ] User not in database
  - Run seeding SQL from SUPABASE_SETUP.md
  - Verify in Supabase: SELECT * FROM users;

- [ ] Backend database not connected
  - Check backend logs for database errors

- [ ] CORS blocking request
  - Check browser DevTools > Network
  - Look for OPTIONS request blocked

**Solution**:
```bash
# Check database has users
# In Supabase SQL Editor:
SELECT email, role FROM users;

# Should see admin@library.edu
```

### 3. Data Not Loading

**Error**: Empty lists or loading spinner never stops

**Causes & Solutions**:
- [ ] Token not being sent
  - Check browser DevTools > Application > Local Storage
  - Should have `auth_token` key

- [ ] API returns error
  - Check browser DevTools > Network tab
  - Look at response JSON for error message

- [ ] Database empty
  - Add sample data via Supabase UI
  - Or run INSERT statements

**Solution**:
1. Open DevTools (F12)
2. Network tab > click API call
3. Check Response tab for error
4. Fix error on backend or database

### 4. Token Not Persisting

**Error**: Logged out after page refresh

**Causes & Solutions**:
- [ ] localStorage not working
  - Check browser privacy settings
  - Try incognito mode

- [ ] Token being cleared
  - Check TokenManager.removeToken() not called
  - Verify logout() only on logout click

**Solution**:
```typescript
// Check token in console
localStorage.getItem('auth_token')  // Should show token
```

### 5. Build Fails

**Error**: `npm run build` fails

**Causes & Solutions**:
- [ ] TypeScript errors
  - Run: `npm run build` to see full errors
  - Fix type issues

- [ ] Missing dependencies
  - Run: `npm install`
  - Clean cache: `npm cache clean --force`

- [ ] Vite config issues
  - Check vite.config.ts syntax
  - Verify all imports exist

**Solution**:
```bash
# Clean install
rm -rf node_modules package-lock.json
npm install
npm run build
```

## Database Issues

### 1. Connection Pool Exhausted

**Error**: `too many connections` or `connection pool timeout`

**Solution**:
```env
# Increase max connections in backend .env
# Default is 5, try 10-20 for production
DATABASE_URL=...?connection_limit=20
```

### 2. Slow Queries

**Error**: Requests taking > 5 seconds

**Causes & Solutions**:
- [ ] Missing indexes
  - Add indexes in schema.sql for common queries
  - `CREATE INDEX idx_books_status ON books(status);`

- [ ] Large result sets
  - Implement pagination
  - Add WHERE clauses to limit results

- [ ] Network latency
  - Use Supabase connection pooler (port 6543)

### 3. Data Not Persisting

**Error**: Data disappears after page refresh

**Causes & Solutions**:
- [ ] Database connection drops
  - Check database logs
  - Verify transaction commits

- [ ] Data validation fails
  - Check INSERT/UPDATE SQL syntax
  - Verify column types match

**Solution**:
```sql
-- Check database logs in Supabase
-- Verify data manually:
SELECT COUNT(*) FROM books;
SELECT * FROM books LIMIT 1;
```

## System-Wide Issues

### 1. Everything Fails on Startup

**Checklist**:
1. [ ] Supabase project created and active
2. [ ] schema.sql executed in SQL Editor
3. [ ] .env file created with DATABASE_URL
4. [ ] Backend runs: `cargo run`
5. [ ] Frontend runs: `npm run dev`
6. [ ] Can access http://localhost:5173
7. [ ] Can login with admin@library.edu / admin123

If any fails, fix before proceeding.

### 2. Only Some Features Work

**Likely Cause**: Partial schema or incomplete setup

**Solution**:
1. Drop all tables in Supabase
2. Re-run complete schema.sql
3. Restart both backend and frontend
4. Re-seed database

### 3. Performance Degradation

**Causes**:
- [ ] Too many concurrent connections
- [ ] Large queries without limits
- [ ] Missing database indexes

**Solution**:
```sql
-- Add indexes for common queries:
CREATE INDEX idx_books_title ON books(title);
CREATE INDEX idx_books_status ON books(status);
CREATE INDEX idx_books_author_id ON books(author_id);
CREATE INDEX idx_members_email ON users(email);
CREATE INDEX idx_borrows_member_id ON borrows(member_id);
```

## Testing Checklist

Use this to verify everything works:

- [ ] Backend starts: `cargo run`
- [ ] Frontend starts: `npm run dev`
- [ ] Login page loads: http://localhost:5173
- [ ] Can login: admin@library.edu / admin123
- [ ] Can view books: `/books` page shows data
- [ ] Can view members: `/members` page shows data
- [ ] Can add book: Create modal works
- [ ] Can borrow book: Modal shows available books
- [ ] Can return book: Return option appears
- [ ] No console errors: DevTools clean

If all pass, integration is complete!

## Getting Help

If stuck:

1. **Check logs**:
   - Backend: Terminal running `cargo run`
   - Frontend: Browser DevTools (F12)
   - Database: Supabase dashboard

2. **Review docs**:
   - INTEGRATION_GUIDE.md
   - SUPABASE_SETUP.md
   - Backend README.md
   - Frontend README.md

3. **Ask for help**:
   - Post error message + logs
   - Describe what you tried
   - Include system info (OS, versions)

4. **Resources**:
   - Supabase Discord
   - Rust Community Forums
   - React Documentation
   - Stack Overflow
