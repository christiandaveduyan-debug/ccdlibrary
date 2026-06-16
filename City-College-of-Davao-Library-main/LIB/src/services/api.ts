// API Base URL - Update this to match your backend
const API_BASE_URL = import.meta.env.VITE_API_URL || 'https://ccdlib.onrender.com';

// Token management
export const TokenManager = {
  getToken: () => {
    return localStorage.getItem('auth_token');
  },
  
  setToken: (token: string) => {
    localStorage.setItem('auth_token', token);
  },
  
  removeToken: () => {
    localStorage.removeItem('auth_token');
  },
  
  getAuthHeader: (): Record<string, string> => {
    const token = TokenManager.getToken();
    return token ? { 'Authorization': `Bearer ${token}` } : {};
  }
};

// API Response Type
export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data?: T;
}

// Auth API
export const AuthAPI = {
  async login(email: string, password: string) {
    const response = await fetch(`${API_BASE_URL}/api/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    });
    return response.json() as Promise<ApiResponse<any>>;
  },

  async signup(name: string, email: string, password: string) {
    const response = await fetch(`${API_BASE_URL}/api/signup`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, email, password }),
    });
    return response.json() as Promise<ApiResponse<any>>;
  },

  logout() {
    TokenManager.removeToken();
  }
};

// Books API
export const BooksAPI = {
  async getAll() {
    const response = await fetch(`${API_BASE_URL}/api/books`, {
      headers: TokenManager.getAuthHeader(),
    });
    return response.json() as Promise<ApiResponse<any[]>>;
  },

  async getById(id: string) {
    const response = await fetch(`${API_BASE_URL}/api/books/${id}`, {
      headers: TokenManager.getAuthHeader(),
    });
    return response.json() as Promise<ApiResponse<any>>;
  },

  async create(book: any) {
    const response = await fetch(`${API_BASE_URL}/api/books`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...TokenManager.getAuthHeader(),
      },
      body: JSON.stringify(book),
    });
    return response.json() as Promise<ApiResponse<any>>;
  },

  async update(id: string, book: any) {
    const response = await fetch(`${API_BASE_URL}/api/books/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        ...TokenManager.getAuthHeader(),
      },
      body: JSON.stringify(book),
    });
    return response.json() as Promise<ApiResponse<any>>;
  },

  async delete(id: string) {
    const response = await fetch(`${API_BASE_URL}/api/books/${id}`, {
      method: 'DELETE',
      headers: TokenManager.getAuthHeader(),
    });
    return response.json() as Promise<ApiResponse<any>>;
  }
};

// Members API
export const MembersAPI = {
  async getAll() {
    const response = await fetch(`${API_BASE_URL}/api/members`, {
      headers: TokenManager.getAuthHeader(),
    });
    return response.json() as Promise<ApiResponse<any[]>>;
  },

  async getById(id: string) {
    const response = await fetch(`${API_BASE_URL}/api/members/${id}`, {
      headers: TokenManager.getAuthHeader(),
    });
    return response.json() as Promise<ApiResponse<any>>;
  },

  async create(member: any) {
    const response = await fetch(`${API_BASE_URL}/api/members`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...TokenManager.getAuthHeader(),
      },
      body: JSON.stringify(member),
    });
    return response.json() as Promise<ApiResponse<any>>;
  },

  async update(id: string, member: any) {
    const response = await fetch(`${API_BASE_URL}/api/members/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        ...TokenManager.getAuthHeader(),
      },
      body: JSON.stringify(member),
    });
    return response.json() as Promise<ApiResponse<any>>;
  },

  async delete(id: string) {
    const response = await fetch(`${API_BASE_URL}/api/members/${id}`, {
      method: 'DELETE',
      headers: TokenManager.getAuthHeader(),
    });
    return response.json() as Promise<ApiResponse<any>>;
  }
};

// Categories API
export const CategoriesAPI = {
  async getAll() {
    const response = await fetch(`${API_BASE_URL}/api/categories`, {
      headers: TokenManager.getAuthHeader(),
    });
    return response.json() as Promise<ApiResponse<any[]>>;
  },

  async create(category: any) {
    const response = await fetch(`${API_BASE_URL}/api/categories`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...TokenManager.getAuthHeader(),
      },
      body: JSON.stringify(category),
    });
    return response.json() as Promise<ApiResponse<any>>;
  },

  async update(id: string, category: any) {
    const response = await fetch(`${API_BASE_URL}/api/categories/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        ...TokenManager.getAuthHeader(),
      },
      body: JSON.stringify(category),
    });
    return response.json() as Promise<ApiResponse<any>>;
  },

  async delete(id: string) {
    const response = await fetch(`${API_BASE_URL}/api/categories/${id}`, {
      method: 'DELETE',
      headers: TokenManager.getAuthHeader(),
    });
    return response.json() as Promise<ApiResponse<any>>;
  }
};

// Authors API
export const AuthorsAPI = {
  async getAll() {
    const response = await fetch(`${API_BASE_URL}/api/authors`, {
      headers: TokenManager.getAuthHeader(),
    });
    return response.json() as Promise<ApiResponse<any[]>>;
  },

  async create(author: any) {
    const response = await fetch(`${API_BASE_URL}/api/authors`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...TokenManager.getAuthHeader(),
      },
      body: JSON.stringify(author),
    });
    return response.json() as Promise<ApiResponse<any>>;
  },

  async update(id: string, author: any) {
    const response = await fetch(`${API_BASE_URL}/api/authors/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        ...TokenManager.getAuthHeader(),
      },
      body: JSON.stringify(author),
    });
    return response.json() as Promise<ApiResponse<any>>;
  },

  async delete(id: string) {
    const response = await fetch(`${API_BASE_URL}/api/authors/${id}`, {
      method: 'DELETE',
      headers: TokenManager.getAuthHeader(),
    });
    return response.json() as Promise<ApiResponse<any>>;
  }
};

// Publishers API
export const PublishersAPI = {
  async getAll() {
    const response = await fetch(`${API_BASE_URL}/api/publishers`, {
      headers: TokenManager.getAuthHeader(),
    });
    return response.json() as Promise<ApiResponse<any[]>>;
  },

  async create(publisher: any) {
    const response = await fetch(`${API_BASE_URL}/api/publishers`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...TokenManager.getAuthHeader(),
      },
      body: JSON.stringify(publisher),
    });
    return response.json() as Promise<ApiResponse<any>>;
  },

  async update(id: string, publisher: any) {
    const response = await fetch(`${API_BASE_URL}/api/publishers/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        ...TokenManager.getAuthHeader(),
      },
      body: JSON.stringify(publisher),
    });
    return response.json() as Promise<ApiResponse<any>>;
  },

  async delete(id: string) {
    const response = await fetch(`${API_BASE_URL}/api/publishers/${id}`, {
      method: 'DELETE',
      headers: TokenManager.getAuthHeader(),
    });
    return response.json() as Promise<ApiResponse<any>>;
  }
};

// Borrow/Return API
export const BorrowAPI = {
  async borrowBook(bookId: string, memberId: string, dueDate: string) {
    const response = await fetch(`${API_BASE_URL}/api/borrow`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...TokenManager.getAuthHeader(),
      },
      body: JSON.stringify({ book_id: bookId, member_id: memberId, due_date: dueDate }),
    });
    return response.json() as Promise<ApiResponse<any>>;
  },

  async returnBook(borrowId: string) {
    const response = await fetch(`${API_BASE_URL}/api/return`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...TokenManager.getAuthHeader(),
      },
      body: JSON.stringify({ borrow_id: borrowId }),
    });
    return response.json() as Promise<ApiResponse<any>>;
  }
};
