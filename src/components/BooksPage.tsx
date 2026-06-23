import { useState } from 'react';
import { Book } from '../types';
import { filterBooks, getCategories, formatDate } from '../utils/helpers';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Search, Plus, Edit, Trash2, Eye, X } from 'lucide-react';

interface BooksPageProps {
  books: Book[];
  onAdd: (book: Omit<Book, 'id' | 'addedDate'>) => void;
  onUpdate: (book: Book) => void;
  onDelete: (id: string) => void;
}

export function BooksPage({ books, onAdd, onUpdate, onDelete }: BooksPageProps) {
  const [filters, setFilters] = useState({ search: '', status: 'all', category: '' });
  const [showForm, setShowForm] = useState(false);
  const [editingBook, setEditingBook] = useState<Book | null>(null);
  const [viewingBook, setViewingBook] = useState<Book | null>(null);

  const categories = getCategories(books);
  const filteredBooks = filterBooks(books, filters);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    
    const bookData = {
      title: formData.get('title') as string,
      author: formData.get('author') as string,
      isbn: formData.get('isbn') as string,
      category: formData.get('category') as string,
      publisher: formData.get('publisher') as string,
      callNumber: formData.get('callNumber') as string,
      status: (formData.get('status') as Book['status']) || 'available',
      location: formData.get('location') as string,
      publishedYear: parseInt(formData.get('publishedYear') as string) || new Date().getFullYear(),
      copies: parseInt(formData.get('copies') as string) || 1,
      availableCopies: (formData.get('status') as Book['status']) === 'damaged'
        ? 0
        : parseInt(formData.get('availableCopies') as string) || 1,
      barcode: formData.get('barcode') as string,
      damageNote: (formData.get('status') as Book['status']) === 'damaged'
        ? formData.get('damageNote') as string
        : '',
      repairStatus: (formData.get('status') as Book['status']) === 'damaged' ? 'Damaged' : '',
    };

    if (bookData.status === 'damaged' && !bookData.damageNote.trim()) {
      alert('Please describe the book damage before marking it as damaged.');
      return;
    }

    if (editingBook) {
      onUpdate({ ...editingBook, ...bookData });
    } else {
      onAdd(bookData);
    }
    setShowForm(false);
    setEditingBook(null);
  };

  const statusColors: Record<string, string> = {
    unprocessed: 'bg-slate-100 text-slate-600',
    available: 'bg-emerald-100 text-emerald-700',
    borrowed: 'bg-amber-100 text-amber-700',
    reserved: 'bg-sky-100 text-sky-700',
    replaced: 'bg-green-100 text-green-700',
    missing: 'bg-red-100 text-red-700',
    damaged: 'bg-orange-100 text-orange-700',
  };
  const statusLabel = (status: Book['status']) => status === 'unprocessed'
    ? 'No Status'
    : status.charAt(0).toUpperCase() + status.slice(1);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Books Catalog</h1>
          <p className="text-slate-500">Manage your library's book collection</p>
        </div>
        <Button
          onClick={() => { setEditingBook(null); setShowForm(true); }}
          className="bg-sky-600 hover:bg-sky-700 text-white gap-2"
        >
          <Plus className="w-4 h-4" />
          Add Book
        </Button>
      </div>

      <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-sm">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <Input
              placeholder="Search by title, author, or ISBN..."
              value={filters.search}
              onChange={(e) => setFilters(prev => ({ ...prev, search: e.target.value }))}
              className="pl-10"
            />
          </div>
          <select
            value={filters.status}
            onChange={(e) => setFilters(prev => ({ ...prev, status: e.target.value }))}
            className="px-4 py-2 border border-slate-300 rounded-lg text-sm bg-white"
          >
            <option value="all">All Status</option>
            <option value="unprocessed">No Status</option>
            <option value="available">Available</option>
            <option value="borrowed">Borrowed</option>
            <option value="reserved">Reserved</option>
            <option value="replaced">Replaced</option>
            <option value="missing">Missing</option>
            <option value="damaged">Damaged</option>
          </select>
          <select
            value={filters.category}
            onChange={(e) => setFilters(prev => ({ ...prev, category: e.target.value }))}
            className="px-4 py-2 border border-slate-300 rounded-lg text-sm bg-white"
          >
            <option value="">All Categories</option>
            {categories.map((cat) => (
              <option key={cat} value={cat}>{cat}</option>
            ))}
          </select>
        </div>
      </div>

      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-slate-50 border-b border-slate-200">
              <tr>
                <th className="text-left px-4 py-3 text-sm font-semibold text-slate-600">Title</th>
                <th className="text-left px-4 py-3 text-sm font-semibold text-slate-600">Author</th>
                <th className="text-left px-4 py-3 text-sm font-semibold text-slate-600">ISBN</th>
                <th className="text-left px-4 py-3 text-sm font-semibold text-slate-600">Category</th>
                <th className="text-left px-4 py-3 text-sm font-semibold text-slate-600">Status</th>
                <th className="text-left px-4 py-3 text-sm font-semibold text-slate-600">Copies</th>
                <th className="text-right px-4 py-3 text-sm font-semibold text-slate-600">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredBooks.map((book) => (
                <tr key={book.id} className="hover:bg-slate-50">
                  <td className="px-4 py-3">
                    <p className="font-medium text-slate-800">{book.title}</p>
                    <p className="text-xs text-slate-400">{book.callNumber}</p>
                  </td>
                  <td className="px-4 py-3 text-sm text-slate-600">{book.author}</td>
                  <td className="px-4 py-3 text-sm text-slate-500 font-mono">{book.isbn}</td>
                  <td className="px-4 py-3 text-sm text-slate-600">{book.category}</td>
                  <td className="px-4 py-3">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${statusColors[book.status]}`}>
                      {statusLabel(book.status)}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-sm text-slate-600">
                    <span className="font-medium">{book.availableCopies}</span>
                    <span className="text-slate-400">/{book.copies}</span>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center justify-end gap-2">
                      <button
                        onClick={() => setViewingBook(book)}
                        className="p-1.5 text-slate-500 hover:text-slate-700 hover:bg-slate-100 rounded-lg transition-colors"
                        title="View Details"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => { setEditingBook(book); setShowForm(true); }}
                        className="p-1.5 text-slate-500 hover:text-sky-600 hover:bg-sky-50 rounded-lg transition-colors"
                        title="Edit"
                      >
                        <Edit className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => { if (confirm('Are you sure you want to delete this book?')) onDelete(book.id); }}
                        className="p-1.5 text-slate-500 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                        title="Delete"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        
        {filteredBooks.length === 0 && (
          <div className="p-8 text-center text-slate-500">
            No books found matching your criteria.
          </div>
        )}
      </div>

      <div className="text-sm text-slate-500">
        Showing {filteredBooks.length} of {books.length} books
      </div>

      {/* Add/Edit Book Modal */}
      {showForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="p-4 border-b border-slate-200 flex items-center justify-between">
              <h2 className="text-lg font-semibold text-slate-800">
                {editingBook ? 'Edit Book' : 'Add New Book'}
              </h2>
              <button onClick={() => { setShowForm(false); setEditingBook(null); }} className="p-1 hover:bg-slate-100 rounded-lg">
                <X className="w-5 h-5 text-slate-500" />
              </button>
            </div>
            <form onSubmit={handleSubmit} className="p-4 space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Title *</label>
                  <Input name="title" defaultValue={editingBook?.title} required />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Author *</label>
                  <Input name="author" defaultValue={editingBook?.author} required />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">ISBN *</label>
                  <Input name="isbn" defaultValue={editingBook?.isbn} required />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Category *</label>
                  <Input name="category" defaultValue={editingBook?.category} required />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Publisher</label>
                  <Input name="publisher" defaultValue={editingBook?.publisher} />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Call Number</label>
                  <Input name="callNumber" defaultValue={editingBook?.callNumber} />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Location</label>
                  <Input name="location" defaultValue={editingBook?.location} />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Published Year</label>
                  <Input name="publishedYear" type="number" defaultValue={editingBook?.publishedYear} />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Total Copies *</label>
                  <Input name="copies" type="number" min="1" defaultValue={editingBook?.copies || 1} required />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Available Copies *</label>
                  <Input name="availableCopies" type="number" min="0" defaultValue={editingBook?.availableCopies || 1} required />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Status</label>
                  <select name="status" defaultValue={editingBook?.status || 'available'} className="w-full px-3 py-2 border border-slate-300 rounded-lg">
                    <option value="unprocessed">No Status</option>
                    <option value="available">Available</option>
                    <option value="borrowed">Borrowed</option>
                    <option value="reserved">Reserved</option>
                    <option value="replaced">Replaced</option>
                    <option value="missing">Missing</option>
                    <option value="damaged">Damaged</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Barcode</label>
                  <Input name="barcode" defaultValue={editingBook?.barcode} />
                </div>
                <div className="sm:col-span-2">
                  <label className="block text-sm font-medium text-slate-700 mb-1">Damage Note</label>
                  <Input name="damageNote" defaultValue={editingBook?.damageNote} placeholder="Required when status is Damaged" />
                </div>
              </div>
              <div className="flex justify-end gap-3 pt-4 border-t border-slate-200">
                <Button type="button" variant="outline" onClick={() => { setShowForm(false); setEditingBook(null); }}>
                  Cancel
                </Button>
                <Button type="submit" className="bg-sky-600 hover:bg-sky-700 text-white">
                  {editingBook ? 'Update Book' : 'Add Book'}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* View Book Modal */}
      {viewingBook && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-lg">
            <div className="p-4 border-b border-slate-200 flex items-center justify-between">
              <h2 className="text-lg font-semibold text-slate-800">Book Details</h2>
              <button onClick={() => setViewingBook(null)} className="p-1 hover:bg-slate-100 rounded-lg">
                <X className="w-5 h-5 text-slate-500" />
              </button>
            </div>
            <div className="p-4 space-y-3">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-xs text-slate-500">Title</p>
                  <p className="font-medium text-slate-800">{viewingBook.title}</p>
                </div>
                <div>
                  <p className="text-xs text-slate-500">Author</p>
                  <p className="font-medium text-slate-800">{viewingBook.author}</p>
                </div>
                <div>
                  <p className="text-xs text-slate-500">ISBN</p>
                  <p className="font-mono text-slate-700">{viewingBook.isbn}</p>
                </div>
                <div>
                  <p className="text-xs text-slate-500">Category</p>
                  <p className="text-slate-700">{viewingBook.category}</p>
                </div>
                <div>
                  <p className="text-xs text-slate-500">Publisher</p>
                  <p className="text-slate-700">{viewingBook.publisher || '-'}</p>
                </div>
                <div>
                  <p className="text-xs text-slate-500">Published Year</p>
                  <p className="text-slate-700">{viewingBook.publishedYear}</p>
                </div>
                <div>
                  <p className="text-xs text-slate-500">Call Number</p>
                  <p className="font-mono text-slate-700">{viewingBook.callNumber || '-'}</p>
                </div>
                <div>
                  <p className="text-xs text-slate-500">Location</p>
                  <p className="text-slate-700">{viewingBook.location || '-'}</p>
                </div>
                <div>
                  <p className="text-xs text-slate-500">Status</p>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${statusColors[viewingBook.status]}`}>
                    {statusLabel(viewingBook.status)}
                  </span>
                </div>
                <div>
                  <p className="text-xs text-slate-500">Copies</p>
                  <p className="text-slate-700">{viewingBook.availableCopies} / {viewingBook.copies} available</p>
                </div>
                <div>
                  <p className="text-xs text-slate-500">Barcode</p>
                  <p className="font-mono text-slate-700">{viewingBook.barcode || '-'}</p>
                </div>
                <div>
                  <p className="text-xs text-slate-500">Added Date</p>
                  <p className="text-slate-700">{formatDate(viewingBook.addedDate)}</p>
                </div>
              </div>
              {viewingBook.borrower && (
                <div className="mt-4 p-3 bg-amber-50 rounded-lg border border-amber-200">
                  <p className="text-xs text-amber-600 font-medium">Currently Borrowed</p>
                  <p className="text-sm text-amber-800">Borrower: {viewingBook.borrower}</p>
                  {viewingBook.dueDate && (
                    <p className="text-sm text-amber-700">Due: {formatDate(viewingBook.dueDate)}</p>
                  )}
                </div>
              )}
            </div>
            <div className="p-4 border-t border-slate-200 flex justify-end">
              <Button variant="outline" onClick={() => setViewingBook(null)}>Close</Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
