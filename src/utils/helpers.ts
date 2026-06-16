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

export const initialBooks: Book[] = [
  { id: '1', title: 'The Great Gatsby', author: 'F. Scott Fitzgerald', isbn: '978-0743273565', category: 'Fiction', publisher: 'Scribner', callNumber: 'FIC FIT', status: 'available', location: 'Shelf A1', publishedYear: 1925, copies: 3, availableCopies: 2, addedDate: '2024-01-15', barcode: 'BC001' },
  { id: '2', title: 'Clean Code', author: 'Robert C. Martin', isbn: '978-0132350884', category: 'Technology', publisher: 'Prentice Hall', callNumber: 'TEC MAR', status: 'borrowed', location: 'Shelf B2', publishedYear: 2008, copies: 2, availableCopies: 0, addedDate: '2024-01-20', borrower: 'John Smith', borrowerId: 'M001', dueDate: '2024-02-15', borrowDate: '2024-01-28', barcode: 'BC002' },
  { id: '3', title: 'To Kill a Mockingbird', author: 'Harper Lee', isbn: '978-0061120084', category: 'Fiction', publisher: 'HarperCollins', callNumber: 'FIC LEE', status: 'available', location: 'Shelf A1', publishedYear: 1960, copies: 4, availableCopies: 4, addedDate: '2024-01-10', barcode: 'BC003' },
  { id: '4', title: '1984', author: 'George Orwell', isbn: '978-0451524935', category: 'Fiction', publisher: 'Signet Classic', callNumber: 'FIC ORW', status: 'reserved', location: 'Shelf A2', publishedYear: 1949, copies: 2, availableCopies: 1, addedDate: '2024-01-05', barcode: 'BC004' },
  { id: '5', title: 'Database Systems', author: 'Thomas Connolly', isbn: '978-0321215958', category: 'Technology', publisher: 'Addison Wesley', callNumber: 'TEC CON', status: 'borrowed', location: 'Shelf B1', publishedYear: 2014, copies: 3, availableCopies: 1, addedDate: '2024-01-12', borrower: 'Jane Doe', borrowerId: 'M002', dueDate: '2024-01-20', borrowDate: '2024-01-06', barcode: 'BC005' },
  { id: '6', title: 'The Catcher in the Rye', author: 'J.D. Salinger', isbn: '978-0316769488', category: 'Fiction', publisher: 'Little, Brown', callNumber: 'FIC SAL', status: 'missing', location: 'Shelf A3', publishedYear: 1951, copies: 2, availableCopies: 0, addedDate: '2024-01-08', barcode: 'BC006' },
  { id: '7', title: 'Pride and Prejudice', author: 'Jane Austen', isbn: '978-0141439518', category: 'Romance', publisher: 'Penguin', callNumber: 'ROM AUS', status: 'damaged', location: 'Shelf C1', publishedYear: 1813, copies: 3, availableCopies: 2, addedDate: '2024-01-18', barcode: 'BC007' },
  { id: '8', title: 'The Hobbit', author: 'J.R.R. Tolkien', isbn: '978-0547928227', category: 'Fantasy', publisher: 'Houghton Mifflin', callNumber: 'FAN TOL', status: 'available', location: 'Shelf D1', publishedYear: 1937, copies: 5, availableCopies: 5, addedDate: '2024-01-22', barcode: 'BC008' },
];

export const initialAuthors: Author[] = [
  { id: '1', name: 'F. Scott Fitzgerald', bio: 'American novelist known for the Jazz Age', booksCount: 3, nationality: 'American' },
  { id: '2', name: 'Robert C. Martin', bio: 'Software engineer and author', booksCount: 5, nationality: 'American' },
  { id: '3', name: 'Harper Lee', bio: 'American novelist', booksCount: 2, nationality: 'American' },
  { id: '4', name: 'George Orwell', bio: 'English novelist and essayist', booksCount: 4, nationality: 'British' },
  { id: '5', name: 'J.R.R. Tolkien', bio: 'English writer and philologist', booksCount: 8, nationality: 'British' },
];

export const initialPublishers: Publisher[] = [
  { id: '1', name: 'Scribner', address: '123 Publisher St, NY', phone: '212-555-0100', email: 'contact@scribner.com', booksCount: 15 },
  { id: '2', name: 'Prentice Hall', address: '456 Tech Blvd, NJ', phone: '201-555-0200', email: 'info@prenhall.com', booksCount: 22 },
  { id: '3', name: 'HarperCollins', address: '789 Book Ave, NY', phone: '212-555-0300', email: 'support@harpercollins.com', booksCount: 30 },
  { id: '4', name: 'Penguin', address: '321 River Rd, London', phone: '+44-20-5555-0100', email: 'info@penguin.com', booksCount: 45 },
];

export const initialCategories: Category[] = [
  { id: '1', name: 'Fiction', description: 'Literary fiction and novels', booksCount: 120 },
  { id: '2', name: 'Technology', description: 'Computer science and technology books', booksCount: 45 },
  { id: '3', name: 'Romance', description: 'Romance novels', booksCount: 38 },
  { id: '4', name: 'Fantasy', description: 'Fantasy and science fiction', booksCount: 52 },
  { id: '5', name: 'Non-Fiction', description: 'Non-fiction and educational', booksCount: 67 },
];

export const initialUsers: User[] = [
  { id: 'U001', name: 'Admin User', email: 'admin@library.edu', password: 'admin123', role: 'admin', createdAt: '2024-01-01' },
  { id: 'U002', name: 'Librarian User', email: 'librarian@library.edu', password: 'lib123', role: 'librarian', createdAt: '2024-01-02' },
];

export const initialMembers: Member[] = [
  { id: 'M001', name: 'John Smith', email: 'john.smith@school.edu', phone: '555-0101', type: 'student', status: 'active', joinedDate: '2023-09-01', borrowedBooks: 2, fines: 0 },
  { id: 'M002', name: 'Jane Doe', email: 'jane.doe@school.edu', phone: '555-0102', type: 'faculty', status: 'active', joinedDate: '2022-01-15', borrowedBooks: 1, fines: 5.50 },
  { id: 'M003', name: 'Mike Johnson', email: 'mike.j@school.edu', phone: '555-0103', type: 'staff', status: 'active', joinedDate: '2023-06-20', borrowedBooks: 0, fines: 0 },
  { id: 'M004', name: 'Sarah Williams', email: 'sarah.w@school.edu', phone: '555-0104', type: 'student', status: 'suspended', joinedDate: '2023-08-10', borrowedBooks: 0, fines: 25.00 },
];

export const initialActivities: Activity[] = [
  { id: '1', type: 'borrow', description: 'Borrowed "Clean Code"', user: 'John Smith', timestamp: '2024-01-28T10:30:00', bookTitle: 'Clean Code' },
  { id: '2', type: 'return', description: 'Returned "The Great Gatsby"', user: 'Jane Doe', timestamp: '2024-01-27T14:15:00', bookTitle: 'The Great Gatsby' },
  { id: '3', type: 'reserve', description: 'Reserved "1984"', user: 'Mike Johnson', timestamp: '2024-01-26T09:45:00', bookTitle: '1984' },
  { id: '4', type: 'add', description: 'Added new book "The Hobbit"', user: 'Admin', timestamp: '2024-01-22T11:00:00', bookTitle: 'The Hobbit' },
  { id: '5', type: 'fine', description: 'Fine issued for overdue book', user: 'Jane Doe', timestamp: '2024-01-21T16:30:00', bookTitle: 'Database Systems' },
];

export const initialNotifications: Notification[] = [
  { id: '1', type: 'overdue', title: 'Overdue Book Notice', message: 'Database Systems is 8 days overdue', timestamp: '2024-01-28T08:00:00', read: false },
  { id: '2', type: 'reminder', title: 'Due Date Reminder', message: 'Clean Code is due in 3 days', timestamp: '2024-01-27T08:00:00', read: false },
  { id: '3', type: 'announcement', title: 'Library Hours Update', message: 'Library will close early on Friday', timestamp: '2024-01-25T10:00:00', read: true },
];

export const initialFines: Fine[] = [
  { id: 'F001', memberId: 'M002', memberName: 'Jane Doe', bookId: '5', bookTitle: 'Database Systems', amount: 5.50, reason: 'Overdue by 8 days', status: 'unpaid', dateIssued: '2024-01-21' },
  { id: 'F002', memberId: 'M004', memberName: 'Sarah Williams', bookId: '6', bookTitle: 'The Catcher in the Rye', amount: 25.00, reason: 'Lost book', status: 'unpaid', dateIssued: '2024-01-15' },
];

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