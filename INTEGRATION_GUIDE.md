# CCD Library - Complete Integration Guide

## Overview
This is a complete library management system for City College of Davao with full integration between:
- **Frontend**: React/TypeScript with Vite
- **Backend**: Rust/Axum REST API
- **Database**: PostgreSQL (via Supabase)

## Architecture

### Technology Stack
- **Frontend**: React 18, TypeScript, Tailwind CSS, Vite
- **Backend**: Rust, Axum, SQLx, PostgreSQL
- **Database**: Supabase (PostgreSQL)
- **Authentication**: JWT (JSON Web Tokens)

### Project Structure
```
ccdlib/                      # Backend (Rust)
├── src/
│   ├── main.rs            # Entry point  
│   ├── db.rs              # Database connection
│   ├── engine.rs          # Server setup
│   ├── limiter.rs         # Rate limiting
│   ├── api/
│   │   ├── auth.rs        # Authentication handlers
│   │   └── library.rs     # Library CRUD & borrow/return
│   ├── routes/
│   │   └── auth_routes.rs # Route definitions
│   └── security/
│       └── mod.rs         # JWT & security
├── schema.sql             # Database schema
├── Cargo.toml             # Rust dependencies
└── .env.example           # Environment template

LIB/                        # Frontend (React)
├── src/
│   ├── App.tsx            # Root component
│   ├── Auth/              # Authentication pages
│   │   ├── LoginPage.tsx
│   │   └── RegisterModal.tsx
│   ├── components/        # UI Components
│   ├── hooks/
│   │   └── useData.ts     # Data management hooks
│   ├── services/
│   │   └── api.ts         # API client
│   └── types/             # TypeScript types
├── .env.local             # Local environment
├── vite.config.ts         # Vite configuration
└── package.json           # Dependencies

schema.sql                  # Database schema
```

## Setup Instructions

### 1. Database Setup (Supabase)

1. Go to [supabase.com](https://supabase.com) and create a new project
2. Get your project credentials:
   - Project URL: `https://[project-id].supabase.co`
   - Database Password: Set during creation
   - API Key: Found in Settings > API

3. In Supabase SQL Editor, run the contents of `schema.sql` to create tables

4. Create initial data (optional):
```sql
INSERT INTO users (name, email, password_hash, role, status) VALUES
('Admin User', 'admin@library.edu', '$2b$12$...', 'admin', 'active');
-- Password: admin123 (use bcrypt for hashing)
```

### 2. Backend Setup

1. Navigate to backend directory:
```bash
cd ccdlib
```

2. Create `.env` file from template:
```bash
cp .env.example .env
```

3. Edit `.env` with your Supabase credentials:
```env
DATABASE_URL=postgresql://postgres:[PASSWORD]@[PROJECT-ID].supabase.co:5432/postgres
PORT=8000
CLIENT_URL=http://localhost:5173
JWT_SECRET=your-super-secret-key-change-this-in-production
ALLOWED_ORIGINS=http://localhost:5173,http://localhost:3000
```

4. Install Rust (if not already installed):
```bash
curl --proto '=https' --tlsv1.2 -sSf https://sh.rustup.rs | sh
```

5. Build and run backend:
```bash
cargo build
cargo run
```

The backend will start at `http://localhost:8000`

### 3. Frontend Setup

1. Navigate to frontend directory:
```bash
cd LIB
```

2. Create `.env.local`:
```env
VITE_API_URL=http://localhost:8000
```

3. Install dependencies:
```bash
npm install
```

4. Start development server:
```bash
npm run dev
```

The frontend will start at `http://localhost:5173`

## API Endpoints

### Authentication
- `POST /api/login` - Login user
- `POST /api/signup` - Register new user

### Books
- `GET /api/books` - Get all books
- `POST /api/books` - Add new book
- `PUT /api/books/:id` - Update book
- `DELETE /api/books/:id` - Delete book

### Members
- `GET /api/members` - Get all members
- `POST /api/members` - Add new member
- `PUT /api/members/:id` - Update member
- `DELETE /api/members/:id` - Delete member

### Categories
- `GET /api/categories` - Get all categories
- `POST /api/categories` - Add new category
- `PUT /api/categories/:id` - Update category
- `DELETE /api/categories/:id` - Delete category

### Authors
- `GET /api/authors` - Get all authors
- `POST /api/authors` - Add new author
- `PUT /api/authors/:id` - Update author
- `DELETE /api/authors/:id` - Delete author

### Publishers
- `GET /api/publishers` - Get all publishers
- `POST /api/publishers` - Add new publisher
- `PUT /api/publishers/:id` - Update publisher
- `DELETE /api/publishers/:id` - Delete publisher

### Borrow/Return
- `POST /api/borrow` - Borrow a book
  ```json
  {
    "book_id": "uuid",
    "member_id": "uuid",
    "due_date": "2024-12-31"
  }
  ```
- `POST /api/return` - Return a book
  ```json
  {
    "borrow_id": "uuid"
  }
  ```

## Frontend Usage

### Authentication
```typescript
import { AuthAPI, TokenManager } from '@/services/api';

// Login
const response = await AuthAPI.login(email, password);
if (response.success) {
  TokenManager.setToken(response.data.token);
}

// Logout
AuthAPI.logout();
```

### Data Management
```typescript
import { useBooks, useMembers, useBorrow } from '@/hooks/useData';

// Using books
const { books, loading, error, addBook, updateBook, deleteBook } = useBooks();

// Borrowing books
const { borrowBook, returnBook } = useBorrow();
await borrowBook(bookId, memberId, dueDate);
```

### API Calls
```typescript
import * as api from '@/services/api';

// Get all books
const response = await api.BooksAPI.getAll();

// Create book
const response = await api.BooksAPI.create({
  title: "Book Title",
  isbn: "123-456-789",
  // ... other fields
});
```

## Database Schema

### Key Tables
- **users**: User accounts (admin, librarian, member)
- **books**: Book inventory
- **members**: Member profiles (extends users)
- **borrows**: Borrow records
- **fines**: Overdue fines
- **categories**: Book categories
- **authors**: Book authors
- **publishers**: Book publishers
- **activities**: Activity logs
- **notifications**: User notifications

## Features

✅ User Authentication (JWT)
✅ Book Management (CRUD)
✅ Member Management (CRUD)
✅ Borrow/Return System
✅ Fine Management (automatic for overdue)
✅ Category/Author/Publisher Management
✅ Activity Logging
✅ Role-based Access (admin, librarian, member)
✅ CORS Support
✅ Rate Limiting
✅ Database Connection Pooling

## Security Features

- JWT Token-based authentication
- Bcrypt password hashing
- SQL parameterization (SQLx)
- CORS protection
- Rate limiting
- TLS support for Supabase
- Input validation
- Secure session management

## Environment Variables

### Backend (.env)
- `DATABASE_URL` - PostgreSQL connection string
- `PORT` - Server port (default: 8000)
- `CLIENT_URL` - Frontend URL for CORS
- `JWT_SECRET` - Secret key for JWT signing
- `ALLOWED_ORIGINS` - Comma-separated allowed origins

### Frontend (.env.local)
- `VITE_API_URL` - Backend API URL

## Troubleshooting

### Backend Connection Issues
1. Verify DATABASE_URL format
2. Check Supabase project is active
3. Ensure firewall allows PostgreSQL connections
4. Test with: `psql postgresql://...`

### Frontend API Errors
1. Check VITE_API_URL in .env.local
2. Verify backend is running
3. Check browser console for CORS errors
4. Ensure JWT token is being sent in headers

### Database Errors
1. Run schema.sql in Supabase SQL Editor
2. Verify all tables exist
3. Check column types match schema
4. Look at PostgreSQL logs for details

## Testing Demo Accounts

After seeding the database, use:
- Email: `admin@library.edu`
- Password: `admin123`

## Production Deployment

### Before Deploying
1. [ ] Change JWT_SECRET
2. [ ] Update CLIENT_URL to production URL
3. [ ] Enable HTTPS (required for production)
4. [ ] Set up database backups
5. [ ] Configure logging
6. [ ] Review security headers
7. [ ] Test all endpoints
8. [ ] Set up monitoring

### Deployment Platforms
- **Backend**: Vercel, Heroku, Render, Railway
- **Frontend**: Vercel, Netlify, Cloudflare Pages
- **Database**: Supabase (already hosted)

## Support & Documentation

- [Supabase Documentation](https://supabase.com/docs)
- [Axum Documentation](https://docs.rs/axum)
- [React Documentation](https://react.dev)
- [SQLx Documentation](https://sqlx.rs)

## License

MIT License - See LICENSE file for details
