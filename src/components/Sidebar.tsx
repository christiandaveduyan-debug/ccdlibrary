import { 
  LayoutDashboard, 
  BookOpen, 
  Package, 
  ArrowLeftRight, 
  BarChart3, 
  Bell, 
  Settings, 
  User,
  ChevronDown,
  ChevronRight,
  Library,
  LogOut
} from 'lucide-react';
import { useState } from 'react';
import { UserRole } from '../types';

export type Page = 
  | 'dashboard'
  | 'books' | 'authors' | 'publishers' | 'categories'
  | 'inventory' | 'barcode' | 'assets' | 'verification' | 'missing' | 'damaged' | 'accession-update'
  | 'borrow' | 'return' | 'renew' | 'reservations' | 'fines'
  | 'borrowing-reports' | 'overdue-reports' | 'lost-reports' | 'statistics'
  | 'notifications'
  | 'users' | 'permissions'
  | 'settings';

interface SidebarProps {
  currentPage: Page;
  onNavigate: (page: Page) => void;
  userName: string;
  userRole: UserRole;
  onLogout: () => void;
}

interface MenuItem {
  id: Page;
  label: string;
  icon: React.ReactNode;
  roles: UserRole[];
  children?: { id: Page; label: string; roles: UserRole[] }[];
}

const menuItems: MenuItem[] = [
  { id: 'dashboard', label: 'Dashboard', icon: <LayoutDashboard className="w-5 h-5" />, roles: ['admin', 'librarian', 'member'] },
  { 
    id: 'books', 
    label: 'Catalog Management', 
    icon: <BookOpen className="w-5 h-5" />,
    roles: ['admin', 'librarian'],
    children: [
      { id: 'books', label: 'Books', roles: ['admin', 'librarian'] },
      { id: 'authors', label: 'Authors', roles: ['admin', 'librarian'] },
      { id: 'publishers', label: 'Publishers', roles: ['admin', 'librarian'] },
      { id: 'categories', label: 'Categories', roles: ['admin', 'librarian'] },
    ]
  },
  { 
    id: 'inventory', 
    label: 'Inventory Management', 
    icon: <Package className="w-5 h-5" />,
    roles: ['admin', 'librarian'],
    children: [
      { id: 'inventory', label: 'Inventory List', roles: ['admin', 'librarian'] },
      { id: 'barcode', label: 'Barcode Management', roles: ['admin', 'librarian'] },
      { id: 'assets', label: 'Asset Tracking', roles: ['admin', 'librarian'] },
      { id: 'verification', label: 'Stock Verification', roles: ['admin', 'librarian'] },
      { id: 'missing', label: 'Missing Items', roles: ['admin', 'librarian'] },
      { id: 'damaged', label: 'Damaged Items', roles: ['admin', 'librarian'] },
      { id: 'accession-update', label: 'Accession Update', roles: ['admin', 'librarian'] },
    ]
  },
  { 
    id: 'borrow', 
    label: 'Circulation', 
    icon: <ArrowLeftRight className="w-5 h-5" />,
    roles: ['admin', 'librarian', 'member'],
    children: [
      { id: 'borrow', label: 'Borrow Books', roles: ['admin', 'librarian', 'member'] },
      { id: 'return', label: 'Return Books', roles: ['admin', 'librarian', 'member'] },
      { id: 'renew', label: 'Renew Loans', roles: ['admin', 'librarian', 'member'] },
      { id: 'reservations', label: 'Reservations', roles: ['admin', 'librarian', 'member'] },
      { id: 'fines', label: 'Fine Management', roles: ['admin', 'librarian'] },
    ]
  },
  { 
    id: 'borrowing-reports', 
    label: 'Reports', 
    icon: <BarChart3 className="w-5 h-5" />,
    roles: ['admin', 'librarian'],
    children: [
      { id: 'borrowing-reports', label: 'Borrowing Reports', roles: ['admin', 'librarian'] },
      { id: 'overdue-reports', label: 'Overdue Reports', roles: ['admin', 'librarian'] },
      { id: 'lost-reports', label: 'Lost Books Reports', roles: ['admin', 'librarian'] },
      { id: 'statistics', label: 'Statistics', roles: ['admin', 'librarian'] },
    ]
  },
  { id: 'notifications', label: 'Notifications', icon: <Bell className="w-5 h-5" />, roles: ['admin', 'librarian', 'member'] },
  { 
    id: 'users', 
    label: 'User Management', 
    icon: <User className="w-5 h-5" />,
    roles: ['admin'],
    children: [
      { id: 'users', label: 'Users', roles: ['admin'] },
      { id: 'permissions', label: 'Permissions', roles: ['admin'] },
    ]
  },
  { id: 'settings', label: 'Settings', icon: <Settings className="w-5 h-5" />, roles: ['admin', 'librarian'] },
];

export function Sidebar({ currentPage, onNavigate, userName, userRole, onLogout }: SidebarProps) {
  const [expandedItems, setExpandedItems] = useState<string[]>(['books', 'borrow']);

  const toggleExpand = (id: string) => {
    setExpandedItems(prev => 
      prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
    );
  };

  const isActive = (id: Page) => currentPage === id;

  const hasAccess = (roles: UserRole[]) => roles.includes(userRole);

  const filteredMenuItems = menuItems.filter(item => hasAccess(item.roles));

  const getRoleBadge = (role: UserRole) => {
    switch (role) {
      case 'admin':
        return <span className="text-xs bg-red-100 text-red-600 px-2 py-0.5 rounded-full font-medium">Admin</span>;
      case 'librarian':
        return <span className="text-xs bg-sky-100 text-sky-600 px-2 py-0.5 rounded-full font-medium">Librarian</span>;
      case 'member':
        return <span className="text-xs bg-emerald-100 text-emerald-600 px-2 py-0.5 rounded-full font-medium">Member</span>;
    }
  };

  return (
    <aside className="w-64 bg-slate-900 text-white min-h-screen flex flex-col">
      <div className="p-4 border-b border-slate-700">
        <div className="flex items-center gap-3">
          <div className="bg-sky-500 p-2 rounded-lg">
            <Library className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="font-bold text-lg">LibraryHub</h1>
            <p className="text-xs text-slate-400">Management System</p>
          </div>
        </div>
      </div>

      <nav className="flex-1 overflow-y-auto py-4">
        <ul className="space-y-1 px-2">
          {filteredMenuItems.map((item) => (
            <li key={item.id}>
              {item.children ? (
                <div>
                  <button
                    onClick={() => toggleExpand(item.id)}
                    className={`w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-sm transition-colors ${
                      expandedItems.includes(item.id) ? 'bg-slate-800 text-white' : 'text-slate-300 hover:bg-slate-800 hover:text-white'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      {item.icon}
                      <span>{item.label}</span>
                    </div>
                    {expandedItems.includes(item.id) ? (
                      <ChevronDown className="w-4 h-4" />
                    ) : (
                      <ChevronRight className="w-4 h-4" />
                    )}
                  </button>
                  {expandedItems.includes(item.id) && (
                    <ul className="ml-4 mt-1 space-y-1">
                      {item.children.filter(child => hasAccess(child.roles)).map((child) => (
                        <li key={child.id}>
                          <button
                            onClick={() => onNavigate(child.id)}
                            className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-colors ${
                              isActive(child.id)
                                ? 'bg-sky-600 text-white'
                                : 'text-slate-400 hover:bg-slate-800 hover:text-white'
                            }`}
                          >
                            {child.label}
                          </button>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              ) : (
                <button
                  onClick={() => onNavigate(item.id)}
                  className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-colors ${
                    isActive(item.id)
                      ? 'bg-sky-600 text-white'
                      : 'text-slate-300 hover:bg-slate-800 hover:text-white'
                  }`}
                >
                  {item.icon}
                  <span>{item.label}</span>
                </button>
              )}
            </li>
          ))}
        </ul>
      </nav>

      <div className="p-4 border-t border-slate-700">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-sky-600 rounded-full flex items-center justify-center font-semibold">
            {userName.charAt(0).toUpperCase()}
          </div>
          <div className="flex-1 min-w-0">
            <p className="font-medium text-sm truncate">{userName}</p>
            {getRoleBadge(userRole)}
          </div>
          <button
            onClick={onLogout}
            title="Logout"
            aria-label="Logout"
            className="p-2 bg-red-600 hover:bg-red-700 rounded-lg transition-colors flex items-center justify-center flex-shrink-0"
          >
            <LogOut className="w-5 h-5" />
          </button>
        </div>
        {userRole !== 'member' && (
          <button
            onClick={() => onNavigate('settings')}
            className="w-full mt-3 px-3 py-2 text-xs bg-slate-800 hover:bg-slate-700 rounded-lg transition-colors"
          >
            Settings
          </button>
        )}
      </div>
    </aside>
  );
}
