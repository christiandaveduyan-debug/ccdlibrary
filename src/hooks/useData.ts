import { useState, useCallback, useEffect } from 'react';
import * as api from '../services/api';

// Types
export interface Book {
  id: string;
  title: string;
  author_id?: string;
  category_id?: string;
  publisher_id?: string;
  isbn?: string;
  call_number?: string;
  status: string;
  location?: string;
  published_year?: number;
  copies: number;
  available_copies: number;
  added_date: string;
  accession_number?: string;
  barcode?: string;
}

export interface Member {
  id: string;
  name: string;
  email: string;
  phone?: string;
  member_type?: string;
  joined_date: string;
}

export interface Category {
  id: string;
  name: string;
  description?: string;
}

export interface Author {
  id: string;
  name: string;
  bio?: string;
  nationality?: string;
}

export interface Publisher {
  id: string;
  name: string;
  address?: string;
  phone?: string;
  email?: string;
}

// Use Books Hook
export const useBooks = () => {
  const [books, setBooks] = useState<Book[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchBooks = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await api.BooksAPI.getAll();
      if (response.success && response.data) {
        setBooks(response.data);
      } else {
        setError(response.message || 'Failed to fetch books');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  }, []);

  const addBook = useCallback(async (book: Partial<Book>) => {
    try {
      const response = await api.BooksAPI.create(book);
      if (response.success) {
        await fetchBooks();
        return { success: true, id: response.data };
      } else {
        return { success: false, error: response.message };
      }
    } catch (err) {
      return { success: false, error: err instanceof Error ? err.message : 'An error occurred' };
    }
  }, [fetchBooks]);

  const updateBook = useCallback(async (id: string, book: Partial<Book>) => {
    try {
      const response = await api.BooksAPI.update(id, book);
      if (response.success) {
        await fetchBooks();
        return { success: true };
      } else {
        return { success: false, error: response.message };
      }
    } catch (err) {
      return { success: false, error: err instanceof Error ? err.message : 'An error occurred' };
    }
  }, [fetchBooks]);

  const deleteBook = useCallback(async (id: string) => {
    try {
      const response = await api.BooksAPI.delete(id);
      if (response.success) {
        await fetchBooks();
        return { success: true };
      } else {
        return { success: false, error: response.message };
      }
    } catch (err) {
      return { success: false, error: err instanceof Error ? err.message : 'An error occurred' };
    }
  }, [fetchBooks]);

  useEffect(() => {
    fetchBooks();
  }, [fetchBooks]);

  return { books, loading, error, addBook, updateBook, deleteBook, refetch: fetchBooks };
};

// Use Members Hook
export const useMembers = () => {
  const [members, setMembers] = useState<Member[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchMembers = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await api.MembersAPI.getAll();
      if (response.success && response.data) {
        setMembers(response.data);
      } else {
        setError(response.message || 'Failed to fetch members');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  }, []);

  const addMember = useCallback(async (member: Partial<Member>) => {
    try {
      const response = await api.MembersAPI.create(member);
      if (response.success) {
        await fetchMembers();
        return { success: true, id: response.data };
      } else {
        return { success: false, error: response.message };
      }
    } catch (err) {
      return { success: false, error: err instanceof Error ? err.message : 'An error occurred' };
    }
  }, [fetchMembers]);

  const updateMember = useCallback(async (id: string, member: Partial<Member>) => {
    try {
      const response = await api.MembersAPI.update(id, member);
      if (response.success) {
        await fetchMembers();
        return { success: true };
      } else {
        return { success: false, error: response.message };
      }
    } catch (err) {
      return { success: false, error: err instanceof Error ? err.message : 'An error occurred' };
    }
  }, [fetchMembers]);

  const deleteMember = useCallback(async (id: string) => {
    try {
      const response = await api.MembersAPI.delete(id);
      if (response.success) {
        await fetchMembers();
        return { success: true };
      } else {
        return { success: false, error: response.message };
      }
    } catch (err) {
      return { success: false, error: err instanceof Error ? err.message : 'An error occurred' };
    }
  }, [fetchMembers]);

  useEffect(() => {
    fetchMembers();
  }, [fetchMembers]);

  return { members, loading, error, addMember, updateMember, deleteMember, refetch: fetchMembers };
};

// Use Categories Hook
export const useCategories = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchCategories = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await api.CategoriesAPI.getAll();
      if (response.success && response.data) {
        setCategories(response.data);
      } else {
        setError(response.message || 'Failed to fetch categories');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  }, []);

  const addCategory = useCallback(async (category: Partial<Category>) => {
    try {
      const response = await api.CategoriesAPI.create(category);
      if (response.success) {
        await fetchCategories();
        return { success: true, id: response.data };
      } else {
        return { success: false, error: response.message };
      }
    } catch (err) {
      return { success: false, error: err instanceof Error ? err.message : 'An error occurred' };
    }
  }, [fetchCategories]);

  useEffect(() => {
    fetchCategories();
  }, [fetchCategories]);

  return { categories, loading, error, addCategory, refetch: fetchCategories };
};

// Use Authors Hook
export const useAuthors = () => {
  const [authors, setAuthors] = useState<Author[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchAuthors = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await api.AuthorsAPI.getAll();
      if (response.success && response.data) {
        setAuthors(response.data);
      } else {
        setError(response.message || 'Failed to fetch authors');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  }, []);

  const addAuthor = useCallback(async (author: Partial<Author>) => {
    try {
      const response = await api.AuthorsAPI.create(author);
      if (response.success) {
        await fetchAuthors();
        return { success: true, id: response.data };
      } else {
        return { success: false, error: response.message };
      }
    } catch (err) {
      return { success: false, error: err instanceof Error ? err.message : 'An error occurred' };
    }
  }, [fetchAuthors]);

  useEffect(() => {
    fetchAuthors();
  }, [fetchAuthors]);

  return { authors, loading, error, addAuthor, refetch: fetchAuthors };
};

// Use Publishers Hook
export const usePublishers = () => {
  const [publishers, setPublishers] = useState<Publisher[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchPublishers = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await api.PublishersAPI.getAll();
      if (response.success && response.data) {
        setPublishers(response.data);
      } else {
        setError(response.message || 'Failed to fetch publishers');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  }, []);

  const addPublisher = useCallback(async (publisher: Partial<Publisher>) => {
    try {
      const response = await api.PublishersAPI.create(publisher);
      if (response.success) {
        await fetchPublishers();
        return { success: true, id: response.data };
      } else {
        return { success: false, error: response.message };
      }
    } catch (err) {
      return { success: false, error: err instanceof Error ? err.message : 'An error occurred' };
    }
  }, [fetchPublishers]);

  useEffect(() => {
    fetchPublishers();
  }, [fetchPublishers]);

  return { publishers, loading, error, addPublisher, refetch: fetchPublishers };
};

// Use Borrow Hook
export const useBorrow = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const borrowBook = useCallback(async (bookId: string, memberId: string, dueDate: string) => {
    setLoading(true);
    setError(null);
    try {
      const response = await api.BorrowAPI.borrowBook(bookId, memberId, dueDate);
      if (response.success) {
        return { success: true, id: response.data };
      } else {
        return { success: false, error: response.message };
      }
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : 'An error occurred';
      setError(errorMsg);
      return { success: false, error: errorMsg };
    } finally {
      setLoading(false);
    }
  }, []);

  const returnBook = useCallback(async (borrowId: string) => {
    setLoading(true);
    setError(null);
    try {
      const response = await api.BorrowAPI.returnBook(borrowId);
      if (response.success) {
        return { success: true };
      } else {
        return { success: false, error: response.message };
      }
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : 'An error occurred';
      setError(errorMsg);
      return { success: false, error: errorMsg };
    } finally {
      setLoading(false);
    }
  }, []);

  return { borrowBook, returnBook, loading, error };
};
