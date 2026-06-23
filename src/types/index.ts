export interface Book {
  id: string;
  title: string;
  author: string;
  isbn: string;
  category: string;
  publisher: string;
  callNumber: string;
  status: 'unprocessed' | 'available' | 'borrowed' | 'reserved' | 'missing' | 'damaged' | 'replaced';
  location: string;
  publishedYear: number;
  copies: number;
  availableCopies: number;
  addedDate: string;
  borrower?: string;
  borrowerId?: string;
  dueDate?: string;
  borrowDate?: string;
  accessionNumber?: string;
  damageNote?: string;
  repairStatus?: string;
  barcode?: string;
}

export interface Author {
  id: string;
  name: string;
  bio: string;
  booksCount: number;
  nationality: string;
}

export interface Publisher {
  id: string;
  name: string;
  address: string;
  phone: string;
  email: string;
  booksCount: number;
}

export interface Category {
  id: string;
  name: string;
  description: string;
  booksCount: number;
}

export interface Member {
  id: string;
  name: string;
  email: string;
  phone: string;
  type: 'student' | 'faculty' | 'staff';
  status: 'active' | 'inactive' | 'suspended';
  joinedDate: string;
  borrowedBooks: number;
  fines: number;
  avatar?: string;
}

export type UserRole = 'admin' | 'librarian' | 'member';

export interface User {
  id: string;
  name: string;
  email: string;
  password: string;
  role: UserRole;
  avatar?: string;
  createdAt: string;
}

export interface Activity {
  id: string;
  type: 'borrow' | 'return' | 'reserve' | 'add' | 'delete' | 'fine';
  description: string;
  user: string;
  timestamp: string;
  bookTitle?: string;
}

export interface Notification {
  id: string;
  type: 'reminder' | 'overdue' | 'announcement';
  title: string;
  message: string;
  timestamp: string;
  read: boolean;
}

export interface Fine {
  id: string;
  memberId: string;
  memberName: string;
  bookId: string;
  bookTitle: string;
  amount: number;
  reason: string;
  status: 'unpaid' | 'paid';
  dateIssued: string;
}

export interface LibrarySettings {
  name: string;
  address: string;
  phone: string;
  email: string;
  maxBorrowDays: number;
  maxBooksPerMember: number;
  finePerDay: number;
  gracePeriod: number;
}
