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
