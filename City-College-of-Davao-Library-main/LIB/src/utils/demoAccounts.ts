export interface DemoAccount {
  name: string;
  role: string;
  email: string;
  password: string;
  color: string;
}

export const DEMO_ACCOUNTS: DemoAccount[] = [
  {
    name: 'Admin Account',
    role: 'Full Access',
    email: 'admin@library.edu',
    password: 'admin123',
    color: 'bg-red-100 hover:bg-red-200 text-red-700 border-red-300',
  },
  {
    name: 'Librarian Account',
    role: 'Standard',
    email: 'librarian@library.edu',
    password: 'lib123',
    color: 'bg-blue-100 hover:bg-blue-200 text-blue-700 border-blue-300',
  },
];
