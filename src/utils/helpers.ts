import { Book, Author, Publisher, Category, Member, Activity, Notification, Fine, LibrarySettings, User } from '../types';

export const generateId = (): string => Math.random().toString(36).substring(2, 11);

export const formatDate = (date: string): string => {
  return new Date(date).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
};

export const formatDateTime = (date: string): string => {
  return new Date(date).toLocaleString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
};

export const formatDueDate = (dueDate: string): string => {
  return new Date(dueDate).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
};

export const getStatusColor = (status: string): string => {
  switch (status) {
    case 'available':
      return 'border-emerald-200 bg-emerald-100 text-emerald-700';
    case 'borrowed':
      return 'border-amber-200 bg-amber-100 text-amber-700';
    case 'reserved':
      return 'border-sky-200 bg-sky-100 text-sky-700';
    case 'missing':
      return 'border-red-200 bg-red-100 text-red-700';
    case 'damaged':
      return 'border-orange-200 bg-orange-100 text-orange-700';
    default:
      return 'border-slate-200 bg-slate-100 text-slate-700';
  }
};

export const isOverdue = (dueDate: string): boolean => {
  return new Date(dueDate) < new Date();
};

export const getDaysOverdue = (dueDate: string): number => {
  const diff = Math.floor((new Date().getTime() - new Date(dueDate).getTime()) / (1000 * 60 * 60 * 24));
  return Math.max(0, diff);
};

export const initialBooks: Book[] = [];
export const initialAuthors: Author[] = [];
export const initialPublishers: Publisher[] = [];
export const initialCategories: Category[] = [];
export const initialUsers: User[] = [];
export const initialMembers: Member[] = [];
export const initialActivities: Activity[] = [];
export const initialNotifications: Notification[] = [];
export const initialFines: Fine[] = [];

export const defaultSettings: LibrarySettings = {
  name: 'Central Library',
  address: '123 Library Street, Education City',
  phone: '555-0199',
  email: 'library@school.edu',
  maxBorrowDays: 14,
  maxBooksPerMember: 5,
  finePerDay: 0.50,
  gracePeriod: 3,
};

export const getCategories = (books: Book[]): string[] => {
  return [...new Set(books.map((b) => b.category))].sort();
};

export const filterBooks = (books: Book[], filters: { search: string; status: string; category: string }): Book[] => {
  return books.filter((book) => {
    const matchesSearch =
      !filters.search ||
      book.title.toLowerCase().includes(filters.search.toLowerCase()) ||
      book.author.toLowerCase().includes(filters.search.toLowerCase()) ||
      book.isbn.includes(filters.search);
    const matchesStatus = filters.status === 'all' || book.status === filters.status;
    const matchesCategory = !filters.category || book.category === filters.category;
    return matchesSearch && matchesStatus && matchesCategory;
  });
};
