import { useMemo, useState } from 'react';
import { Bell, Search, CheckCircle2, Trash2, Plus } from 'lucide-react';
import { Notification } from '../types';
import { formatDateTime } from '../utils/helpers';
import { Button } from './ui/button';
import { Input } from './ui/input';

interface NotificationsPageProps {
  notifications: Notification[];
  onToggleRead: (id: string) => void;
  onDelete: (id: string) => void;
  onMarkAllRead: () => void;
  onAddNotification: () => void;
}

export function NotificationsPage({
  notifications,
  onToggleRead,
  onDelete,
  onMarkAllRead,
  onAddNotification,
}: NotificationsPageProps) {
  const [filters, setFilters] = useState({ search: '', status: 'all' });

  const filteredNotifications = useMemo(() => {
    return notifications.filter((notification) => {
      const text = `${notification.title} ${notification.message} ${notification.type}`.toLowerCase();
      const matchesSearch = !filters.search || text.includes(filters.search.toLowerCase());
      const matchesStatus =
        filters.status === 'all' ||
        (filters.status === 'unread' && !notification.read) ||
        (filters.status === 'read' && notification.read);
      return matchesSearch && matchesStatus;
    });
  }, [filters, notifications]);

  const unreadCount = notifications.filter((notification) => !notification.read).length;

  const typeStyle = (type: Notification['type']) => {
    switch (type) {
      case 'overdue':
        return { label: 'Overdue', badge: 'bg-red-100 text-red-700' };
      case 'reminder':
        return { label: 'Reminder', badge: 'bg-amber-100 text-amber-700' };
      default:
        return { label: 'Announcement', badge: 'bg-sky-100 text-sky-700' };
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Notifications</h1>
          <p className="text-slate-500">View and manage notifications for the library system.</p>
        </div>
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
          <Button onClick={onMarkAllRead} className="bg-slate-800 text-white hover:bg-slate-900">
            <CheckCircle2 className="w-4 h-4" />
            Mark all read
          </Button>
          <Button onClick={onAddNotification} className="bg-sky-600 text-white hover:bg-sky-700">
            <Plus className="w-4 h-4" />
            New notification
          </Button>
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-slate-200 p-4 shadow-sm">
        <div className="grid gap-4 sm:grid-cols-[1fr_240px]">
          <div className="relative">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
            <Input
              placeholder="Search notifications..."
              value={filters.search}
              onChange={(e) => setFilters((prev) => ({ ...prev, search: e.target.value }))}
              className="pl-10"
            />
          </div>
          <select
            className="w-full rounded-2xl border border-slate-300 bg-white px-4 py-3 text-sm text-slate-800"
            value={filters.status}
            onChange={(e) => setFilters((prev) => ({ ...prev, status: e.target.value }))}
          >
            <option value="all">All notifications</option>
            <option value="unread">Unread only</option>
            <option value="read">Read only</option>
          </select>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="flex items-center gap-3 text-slate-600">
            <Bell className="h-5 w-5 text-sky-500" />
            <p className="text-sm font-semibold">Total notifications</p>
          </div>
          <p className="mt-4 text-3xl font-bold text-slate-800">{notifications.length}</p>
        </div>
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="text-slate-600 text-sm font-semibold">Unread</div>
          <p className="mt-4 text-3xl font-bold text-slate-800">{unreadCount}</p>
        </div>
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="text-slate-600 text-sm font-semibold">Filtered results</div>
          <p className="mt-4 text-3xl font-bold text-slate-800">{filteredNotifications.length}</p>
        </div>
      </div>

      <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
        {filteredNotifications.length === 0 ? (
          <div className="p-8 text-center text-slate-500">No notifications found.</div>
        ) : (
          <div className="space-y-3">
            {filteredNotifications.map((notification) => {
              const style = typeStyle(notification.type);
              return (
                <div
                  key={notification.id}
                  className={`rounded-2xl border border-slate-200 p-4 transition ${notification.read ? 'bg-slate-50' : 'bg-sky-50'}`}
                >
                  <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                    <div className="flex gap-3">
                      <div className={`flex h-10 w-10 items-center justify-center rounded-2xl ${style.badge}`}>
                        <Bell className="h-5 w-5" />
                      </div>
                      <div>
                        <div className="flex flex-wrap items-center gap-2">
                          <h2 className="text-base font-semibold text-slate-800">{notification.title}</h2>
                          <span className={`rounded-full px-2 py-1 text-xs font-semibold ${style.badge}`}>{style.label}</span>
                          {!notification.read && (
                            <span className="rounded-full bg-slate-900 px-2 py-1 text-xs font-semibold text-white">Unread</span>
                          )}
                        </div>
                        <p className="mt-2 text-sm text-slate-600">{notification.message}</p>
                        <p className="mt-1 text-xs text-slate-400">{formatDateTime(notification.timestamp)}</p>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Button
                        onClick={() => onToggleRead(notification.id)}
                        className="rounded-2xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-600 hover:bg-slate-50"
                      >
                        {notification.read ? 'Mark unread' : 'Mark read'}
                      </Button>
                      <Button
                        onClick={() => onDelete(notification.id)}
                        className="rounded-2xl border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700 hover:bg-red-100"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
