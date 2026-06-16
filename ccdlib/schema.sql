-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. USERS Table (Consolidated library users/staff/members)
CREATE TABLE IF NOT EXISTS users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    role VARCHAR(50) NOT NULL CHECK (role IN ('admin', 'librarian', 'member')),
    status VARCHAR(50) NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'inactive', 'suspended', 'pending')),
    avatar_url TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 2. CATEGORIES Table
CREATE TABLE IF NOT EXISTS categories (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(255) UNIQUE NOT NULL,
    description TEXT
);

-- 3. AUTHORS Table
CREATE TABLE IF NOT EXISTS authors (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(255) NOT NULL,
    bio TEXT,
    nationality VARCHAR(100)
);

-- 4. PUBLISHERS Table
CREATE TABLE IF NOT EXISTS publishers (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(255) UNIQUE NOT NULL,
    address TEXT,
    phone VARCHAR(50),
    email VARCHAR(255)
);

-- 5. BOOKS Table
CREATE TABLE IF NOT EXISTS books (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title VARCHAR(255) NOT NULL,
    author_id UUID REFERENCES authors(id) ON DELETE SET NULL,
    category_id UUID REFERENCES categories(id) ON DELETE SET NULL,
    publisher_id UUID REFERENCES publishers(id) ON DELETE SET NULL,
    isbn VARCHAR(50) UNIQUE,
    call_number VARCHAR(100),
    status VARCHAR(50) NOT NULL DEFAULT 'available' CHECK (status IN ('available', 'borrowed', 'reserved', 'missing', 'damaged')),
    location VARCHAR(255),
    published_year INT,
    copies INT NOT NULL DEFAULT 1,
    available_copies INT NOT NULL DEFAULT 1,
    added_date TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    barcode VARCHAR(100) UNIQUE
);

-- 6. MEMBERS Profiles (Extends User for members with specific attributes)
CREATE TABLE IF NOT EXISTS members (
    id UUID PRIMARY KEY REFERENCES users(id) ON DELETE CASCADE,
    phone VARCHAR(50),
    type VARCHAR(50) NOT NULL CHECK (type IN ('student', 'faculty', 'staff')),
    joined_date TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 7. BORROW RECORDS Table
CREATE TABLE IF NOT EXISTS borrows (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    book_id UUID NOT NULL REFERENCES books(id) ON DELETE CASCADE,
    member_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    borrow_date TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    due_date TIMESTAMP WITH TIME ZONE NOT NULL,
    return_date TIMESTAMP WITH TIME ZONE,
    status VARCHAR(50) NOT NULL DEFAULT 'borrowed' CHECK (status IN ('borrowed', 'returned', 'overdue'))
);

-- 8. FINES Table
CREATE TABLE IF NOT EXISTS fines (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    member_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    book_id UUID NOT NULL REFERENCES books(id) ON DELETE CASCADE,
    amount DECIMAL(10, 2) NOT NULL DEFAULT 0.00,
    reason TEXT,
    status VARCHAR(50) NOT NULL DEFAULT 'unpaid' CHECK (status IN ('unpaid', 'paid')),
    date_issued TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 9. ACTIVITIES Table
CREATE TABLE IF NOT EXISTS activities (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    type VARCHAR(50) NOT NULL CHECK (type IN ('borrow', 'return', 'reserve', 'add', 'delete', 'fine')),
    description TEXT NOT NULL,
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    book_id UUID REFERENCES books(id) ON DELETE SET NULL,
    timestamp TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 10. NOTIFICATIONS Table
CREATE TABLE IF NOT EXISTS notifications (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    type VARCHAR(50) NOT NULL CHECK (type IN ('reminder', 'overdue', 'announcement')),
    title VARCHAR(255) NOT NULL,
    message TEXT NOT NULL,
    timestamp TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    read BOOLEAN NOT NULL DEFAULT FALSE
);

-- 11. LIBRARY SETTINGS Table (Single row configuration)
CREATE TABLE IF NOT EXISTS library_settings (
    id INT PRIMARY KEY DEFAULT 1 CHECK (id = 1),
    name VARCHAR(255) NOT NULL DEFAULT 'City College of Davao Library',
    address TEXT,
    phone VARCHAR(50),
    email VARCHAR(255),
    max_borrow_days INT NOT NULL DEFAULT 14,
    max_books_per_member INT NOT NULL DEFAULT 5,
    fine_per_day DECIMAL(10, 2) NOT NULL DEFAULT 10.00,
    grace_period INT NOT NULL DEFAULT 0
);

-- Seed Initial Admin & Librarian Accounts
-- Hashed passwords correspond to:
-- admin@library.edu -> admin123
-- librarian@library.edu -> lib123
INSERT INTO users (name, email, password_hash, role, status) VALUES 
('Admin User', 'admin@library.edu', '$2a$12$Zp4Z.qg/Z4jWreQd9i3wzOa3kI0gYvCze7a12n.L9vXw926X/G44C', 'admin', 'active'),
('Jane Librarian', 'librarian@library.edu', '$2a$12$2h2/qC25n.KqFzR5j2dweOb82r473o2pSze8a12n.L9vXw926X/G44C', 'librarian', 'active')
ON CONFLICT (email) DO NOTHING;

-- Seed Default Settings
INSERT INTO library_settings (id, name, max_borrow_days, max_books_per_member, fine_per_day, grace_period)
VALUES (1, 'City College of Davao Library', 14, 5, 5.00, 3)
ON CONFLICT (id) DO NOTHING;
