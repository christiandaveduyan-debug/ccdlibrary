<<<<<<< HEAD
# CCD Library Frontend

A modern React-based web application for the City College of Davao Library Management System.

## Quick Start

### Prerequisites
- Node.js 16+ and npm
- Backend running at http://localhost:8000

### Installation

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Create `.env.local`:**
   ```env
   VITE_API_URL=http://localhost:8000
   ```

3. **Start development server:**
   ```bash
   npm run dev
   ```

   Application will open at `http://localhost:5173`

## Available Scripts

### Development
```bash
npm run dev
```
Starts the Vite development server with hot module replacement.

### Build
```bash
npm run build
```
Builds optimized production bundle.

### Preview
```bash
npm run preview
```
Preview production build locally.

## Project Structure

```
src/
├── App.tsx              # Root component
├── main.tsx             # Entry point
├── Auth/                # Authentication pages
│   ├── LoginPage.tsx
│   └── RegisterModal.tsx
├── components/          # Reusable UI components
│   ├── Dashboard.tsx
│   ├── BooksPage.tsx
│   ├── BookCard.tsx
│   ├── BookForm.tsx
│   ├── CheckOutModal.tsx
│   ├── Sidebar.tsx
│   ├── StatsCard.tsx
│   └── ui/              # Basic UI components
├── hooks/               # Custom React hooks
│   └── useData.ts       # Data management hooks
├── services/            # API services
│   └── api.ts           # API client
├── types/               # TypeScript types
├── utils/               # Utility functions
├── styles/              # CSS files
└── index.css            # Global styles
```

## Features

✅ User Authentication
✅ Book Management
✅ Member Management
✅ Book Borrowing/Returning
✅ Member Dashboard
✅ Search & Filter
✅ Responsive Design
✅ Real-time Updates
✅ Activity Tracking
✅ Fines Management

## Key Components

### Authentication
- Login with email and password
- JWT token management
- Automatic token refresh
- Logout functionality

### Books Page
- Display all books in library
- Add new books
- Edit book details
- Delete books
- Search and filter
- Borrow books

### Members Page
- View all members
- Add new members
- Edit member details
- Track member activity

### Dashboard
- Statistics and overview
- Recent activities
- Quick actions
- Member management

## Hooks Usage

### useBooks
```typescript
const { books, loading, error, addBook, updateBook, deleteBook } = useBooks();
```

### useMembers
```typescript
const { members, loading, error, addMember, updateMember, deleteMember } = useMembers();
```

### useBorrow
```typescript
const { borrowBook, returnBook, loading } = useBorrow();
```

## API Integration

All API calls are handled through the `services/api.ts` file:

```typescript
import { BooksAPI, TokenManager } from '@/services/api';

// Get all books
const response = await BooksAPI.getAll();

// Manage authentication
TokenManager.setToken(token);
const token = TokenManager.getToken();
TokenManager.removeToken();
```

## Authentication Flow

1. User enters credentials
2. Frontend sends request to `/api/login`
3. Backend returns JWT token and user data
4. Token stored in localStorage
5. Token included in all subsequent requests
6. Token automatically cleared on logout

## Environment Variables

| Variable | Default | Description |
|----------|---------|-------------|
| VITE_API_URL | http://localhost:8000 | Backend API URL |

## Styling

The project uses:
- **Tailwind CSS** for utility-first styling
- **Lucide React** for icons
- **Custom CSS** for specific components

### Tailwind Configuration
See `tailwind.config.js` for customization options.

## Development Guidelines

### Component Structure
```typescript
import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';

export function MyComponent() {
  const [state, setState] = useState('');
  
  useEffect(() => {
    // Side effects
  }, []);

  return (
    <div className="p-4">
      {/* Component JSX */}
    </div>
  );
}
```

### Error Handling
- All API calls wrapped in try-catch
- Error messages displayed to user
- Loading states managed with hooks
- Failed requests show error notifications

### Data Management
- Data fetched in useEffect
- State managed with useState
- Custom hooks for data operations
- Automatic refetch on mutations

## Building for Production

1. **Build optimized bundle:**
   ```bash
   npm run build
   ```

2. **Update API URL for production:**
   ```env
   VITE_API_URL=https://your-production-api.com
   ```

3. **Deploy to hosting platform:**
   - Vercel: `vercel deploy`
   - Netlify: Drag & drop `dist` folder
   - GitHub Pages: Configure in package.json

## Performance Optimization

- Code splitting with Vite
- Lazy loading of routes
- Image optimization
- CSS minification
- Bundle analysis

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## Troubleshooting

### API Connection Failed
1. Check backend is running
2. Verify VITE_API_URL in .env.local
3. Check browser console for errors
4. Verify CORS settings

### Login Issues
1. Verify credentials are correct
2. Check backend authentication
3. Review browser console
4. Clear localStorage and try again

### Data Not Updating
1. Check network requests in DevTools
2. Verify API response format
3. Check error messages
4. Manually refetch data

## Dependencies

- **react** - UI library
- **typescript** - Type safety
- **vite** - Build tool
- **tailwindcss** - Styling
- **lucide-react** - Icons

See `package.json` for complete dependency list.

## License

MIT License - See LICENSE file
=======
# CCD Library Documentation Index

**Start Here:** [COMPLETION_SUMMARY.md](COMPLETION_SUMMARY.md) ⭐

## 📚 Documentation Files

All documentation files are in the root directory:

### For Getting Started
1. **[QUICKSTART.md](QUICKSTART.md)** ⭐⭐⭐
   - 15-minute setup guide
   - Step-by-step instructions
   - Demo credentials
   - **Start here if you want to run it fast**

2. **[COMPLETION_SUMMARY.md](COMPLETION_SUMMARY.md)** ⭐⭐⭐
   - What was completed
   - How everything connects
   - File structure overview
   - Next steps
   - **Start here to understand what you have**

### For Setup & Configuration
3. **[SUPABASE_SETUP.md](SUPABASE_SETUP.md)**
   - Create Supabase project
   - Get credentials
   - Initialize database
   - Seed demo data
   - Connection troubleshooting

4. **[INTEGRATION_GUIDE.md](INTEGRATION_GUIDE.md)**
   - Architecture overview
   - Complete setup instructions
   - Technology stack details
   - API endpoint documentation
   - Frontend usage examples
   - Database schema
   - Deployment guide

### For Development
5. **[ccdlib/README.md](ccdlib/README.md)**
   - Backend documentation
   - Development setup
   - Running tests
   - Feature list
   - Performance info

6. **[LIB/README.md](LIB/README.md)**
   - Frontend documentation
   - Project structure
   - Component guide
   - Styling system
   - Building for production

### For Problem Solving
7. **[TROUBLESHOOTING.md](TROUBLESHOOTING.md)**
   - Backend issues
   - Frontend issues
   - Database issues
   - System-wide troubleshooting
   - Testing checklist
   - **Read this if something isn't working**

### For Overview & Status
8. **[PROJECT_STATUS.md](PROJECT_STATUS.md)**
   - Completion status checklist
   - Technology stack
   - Directory structure
   - Features implemented
   - Data flow examples
   - Security features
   - Deployment guide

## 🗂️ Code Files Created/Modified

### Backend (Rust)

**New/Modified:**
- ✅ `ccdlib/src/api/library.rs` - Added borrow/return functions
- ✅ `ccdlib/src/routes/auth_routes.rs` - Added borrow/return routes
- ✅ `ccdlib/.env.example` - Environment template
- ✅ `ccdlib/README.md` - Backend documentation

**Existing:**
- `ccdlib/schema.sql` - Database schema
- `ccdlib/Cargo.toml` - Dependencies
- `ccdlib/src/db.rs` - Database connection
- `ccdlib/src/engine.rs` - Server setup
- `ccdlib/src/api/auth.rs` - Authentication handlers

### Frontend (React)

**New:**
- ✅ `LIB/src/services/api.ts` - Complete API client
- ✅ `LIB/src/hooks/useData.ts` - Data management hooks
- ✅ `LIB/.env.local` - Environment file
- ✅ `LIB/README.md` - Frontend documentation

**Existing:**
- `LIB/src/App.tsx` - Root component
- `LIB/src/Auth/LoginPage.tsx` - Login page
- `LIB/src/components/` - UI components
- `LIB/package.json` - Dependencies

## 🚀 Quick Navigation

### I want to...

**Get everything running fast**
→ Read [QUICKSTART.md](QUICKSTART.md) (15 minutes)

**Understand the full system**
→ Read [COMPLETION_SUMMARY.md](COMPLETION_SUMMARY.md) then [INTEGRATION_GUIDE.md](INTEGRATION_GUIDE.md)

**Set up Supabase database**
→ Read [SUPABASE_SETUP.md](SUPABASE_SETUP.md)

**Fix a problem**
→ Read [TROUBLESHOOTING.md](TROUBLESHOOTING.md)

**Develop/contribute to backend**
→ Read [ccdlib/README.md](ccdlib/README.md)

**Develop/contribute to frontend**
→ Read [LIB/README.md](LIB/README.md)

**Deploy to production**
→ See INTEGRATION_GUIDE.md > Production Deployment section

**See project status**
→ Read [PROJECT_STATUS.md](PROJECT_STATUS.md)

## 📋 Setup Checklist

- [ ] Read COMPLETION_SUMMARY.md
- [ ] Follow QUICKSTART.md (15 minutes)
- [ ] Backend running: `cargo run`
- [ ] Frontend running: `npm run dev`
- [ ] Can login: admin@library.edu / admin123
- [ ] Can view books page
- [ ] Can view members page
- [ ] Can create new book
- [ ] Can borrow/return books
- [ ] All features working

## 🎯 Key Takeaways

1. **Everything is connected**: Frontend ↔ Backend ↔ Database
2. **Fully documented**: 8+ comprehensive guides
3. **Production ready**: Can deploy immediately
4. **Secure**: JWT auth, bcrypt hashing, SQL injection prevention
5. **Complete features**: Login, CRUD, Borrow/Return, Fines

## 📖 Reading Order

**For Quick Setup:**
1. COMPLETION_SUMMARY.md (5 min)
2. QUICKSTART.md (15 min)
3. Done! 🎉

**For Full Understanding:**
1. COMPLETION_SUMMARY.md (5 min)
2. INTEGRATION_GUIDE.md (20 min)
3. SUPABASE_SETUP.md (10 min)
4. ccdlib/README.md (10 min)
5. LIB/README.md (10 min)
6. Ready for production! ✅

**For Development:**
1. ccdlib/README.md (backend)
2. LIB/README.md (frontend)
3. TROUBLESHOOTING.md (when needed)
4. INTEGRATION_GUIDE.md (API reference)

## 🆘 Help

**Stuck?** Check [TROUBLESHOOTING.md](TROUBLESHOOTING.md)

**Need setup help?** Check [QUICKSTART.md](QUICKSTART.md)

**Want full details?** Check [INTEGRATION_GUIDE.md](INTEGRATION_GUIDE.md)

**Want to understand everything?** Check [PROJECT_STATUS.md](PROJECT_STATUS.md)

## ✅ You Have Everything You Need

The complete CCD Library system is ready to:
- ✅ Run locally
- ✅ Test thoroughly
- ✅ Understand deeply
- ✅ Deploy to production
- ✅ Extend and customize

**Next Step**: Read [QUICKSTART.md](QUICKSTART.md)

Good luck! 🚀
>>>>>>> 632d95c (fix nested git repos)
