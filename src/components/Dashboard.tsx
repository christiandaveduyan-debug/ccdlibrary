import { Book, Activity, Notification, Member } from '../types';
import { formatDate, getDaysOverdue, isOverdue } from '../utils/helpers';
import { BookOpen, Package, ArrowLeftRight, AlertTriangle, Clock, Users, TrendingUp, Bell } from 'lucide-react';

interface DashboardProps {
  books: Book[];
  activities: Activity[];
  notifications: Notification[];
  members: Member[];
}

export function Dashboard({ books, activities, notifications, members }: DashboardProps) {
  const totalBooks = books.reduce((sum, b) => sum + b.copies, 0);
  const availableBooks = books.reduce((sum, b) => sum + b.availableCopies, 0);
  const borrowedBooks = books.filter(b => b.status === 'borrowed').length;
  const overdueBooks = books.filter(b => b.dueDate && isOverdue(b.dueDate)).length;
  const activeMembers = members.filter(m => m.status === 'active').length;
  const totalFines = members.reduce((sum, m) => sum + m.fines, 0);
  const unreadNotifications = notifications.filter(n => !n.read).length;

  const stats = [
    { label: 'Total Books', value: totalBooks, icon: <BookOpen className="w-6 h-6" />, color: 'bg-sky-500', textColor: 'text-sky-500' },
    { label: 'Available', value: availableBooks, icon: <Package className="w-6 h-6" />, color: 'bg-emerald-500', textColor: 'text-emerald-500' },
    { label: 'Borrowed', value: borrowedBooks, icon: <ArrowLeftRight className="w-6 h-6" />, color: 'bg-amber-500', textColor: 'text-amber-500' },
    { label: 'Overdue', value: overdueBooks, icon: <AlertTriangle className="w-6 h-6" />, color: 'bg-red-500', textColor: 'text-red-500' },
  ];

  const quickStats = [
    { label: 'Active Members', value: activeMembers, icon: <Users className="w-5 h-5" /> },
    { label: 'Pending Fines', value: `$${totalFines.toFixed(2)}`, icon: <TrendingUp className="w-5 h-5" /> },
    { label: 'Notifications', value: unreadNotifications, icon: <Bell className="w-5 h-5" /> },
  ];

  const getActivityIcon = (type: Activity['type']) => {
    switch (type) {
      case 'borrow': return <ArrowLeftRight className="w-4 h-4 text-amber-500" />;
      case 'return': return <Package className="w-4 h-4 text-emerald-500" />;
      case 'reserve': return <Clock className="w-4 h-4 text-sky-500" />;
      case 'fine': return <AlertTriangle className="w-4 h-4 text-red-500" />;
      default: return <BookOpen className="w-4 h-4 text-slate-500" />;
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-800">Dashboard</h1>
        <p className="text-slate-500">Welcome back! Here's your library overview.</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat, idx) => (
          <div key={idx} className="bg-white rounded-xl border border-slate-200 p-5 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-500">{stat.label}</p>
                <p className={`text-3xl font-bold ${stat.textColor} mt-1`}>{stat.value}</p>
              </div>
              <div className={`${stat.color} p-3 rounded-lg text-white`}>
                {stat.icon}
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {quickStats.map((stat, idx) => (
          <div key={idx} className="bg-slate-50 rounded-xl border border-slate-200 p-4 flex items-center gap-4">
            <div className="bg-white p-2 rounded-lg border border-slate-200 text-slate-600">
              {stat.icon}
            </div>
            <div>
              <p className="text-sm text-slate-500">{stat.label}</p>
              <p className="text-xl font-bold text-slate-800">{stat.value}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm">
          <div className="p-4 border-b border-slate-200">
            <h2 className="font-semibold text-slate-800">Recent Activities</h2>
          </div>
          <div className="divide-y divide-slate-100">
            {activities.slice(0, 5).map((activity) => (
              <div key={activity.id} className="p-4 flex items-start gap-3">
                <div className="mt-0.5">{getActivityIcon(activity.type)}</div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-slate-700">{activity.description}</p>
                  <p className="text-xs text-slate-400 mt-1">
                    {activity.user} • {formatDate(activity.timestamp)}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-xl border border-slate-200 shadow-sm">
          <div className="p-4 border-b border-slate-200 flex items-center justify-between">
            <h2 className="font-semibold text-slate-800">Overdue Books</h2>
            <span className="text-xs bg-red-100 text-red-600 px-2 py-1 rounded-full font-medium">
              {overdueBooks} items
            </span>
          </div>
          <div className="divide-y divide-slate-100">
            {books.filter(b => b.dueDate && isOverdue(b.dueDate)).slice(0, 5).map((book) => (
              <div key={book.id} className="p-4">
                <div className="flex items-start justify-between">
                  <div>
                    <p className="font-medium text-slate-800">{book.title}</p>
                    <p className="text-sm text-slate-500">{book.borrower}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-medium text-red-600">
                      {getDaysOverdue(book.dueDate!)} days overdue
                    </p>
                    <p className="text-xs text-slate-400">Due: {formatDate(book.dueDate!)}</p>
                  </div>
                </div>
              </div>
            ))}
            {overdueBooks === 0 && (
              <div className="p-8 text-center text-slate-500">
                No overdue books
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl border border-slate-200 shadow-sm">
        <div className="p-4 border-b border-slate-200 flex items-center justify-between">
          <h2 className="font-semibold text-slate-800">Recent Notifications</h2>
          <span className="text-xs bg-sky-100 text-sky-600 px-2 py-1 rounded-full font-medium">
            {unreadNotifications} unread
          </span>
        </div>
        <div className="divide-y divide-slate-100">
          {notifications.slice(0, 3).map((notification) => (
            <div key={notification.id} className={`p-4 ${!notification.read ? 'bg-sky-50' : ''}`}>
              <div className="flex items-start gap-3">
                <div className={`mt-0.5 ${notification.type === 'overdue' ? 'text-red-500' : notification.type === 'reminder' ? 'text-amber-500' : 'text-sky-500'}`}>
                  <Bell className="w-4 h-4" />
                </div>
                <div className="flex-1">
                  <p className="font-medium text-slate-800">{notification.title}</p>
                  <p className="text-sm text-slate-600">{notification.message}</p>
                  <p className="text-xs text-slate-400 mt-1">{formatDate(notification.timestamp)}</p>
                </div>
                {!notification.read && (
                  <span className="w-2 h-2 bg-sky-500 rounded-full" />
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}