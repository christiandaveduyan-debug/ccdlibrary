import { useState, useEffect } from 'react';
import { Book } from '../types';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { X } from 'lucide-react';

interface BookFormProps {
  book?: Book | null;
  onSubmit: (book: Omit<Book, 'id' | 'addedDate'> & { id?: string }) => void;
  onCancel: () => void;
}

export function BookForm({ book, onSubmit, onCancel }: BookFormProps) {
  const [formData, setFormData] = useState({
    title: '',
    author: '',
    isbn: '',
    category: '',
    publisher: '',
    callNumber: '',
    location: '',
    publishedYear: new Date().getFullYear(),
    copies: 1,
    availableCopies: 1,
    status: 'available' as Book['status'],
    borrower: '',
    dueDate: '',
    barcode: '',
    damageNote: '',
    repairStatus: '',
  });

  useEffect(() => {
    if (book) {
      setFormData({
        title: book.title,
        author: book.author,
        isbn: book.isbn,
        category: book.category,
        publisher: book.publisher || '',
        callNumber: book.callNumber || '',
        location: book.location,
        publishedYear: book.publishedYear,
        copies: book.copies,
        availableCopies: book.availableCopies,
        status: book.status,
        borrower: book.borrower || '',
        dueDate: book.dueDate || '',
        barcode: book.barcode || '',
        damageNote: book.damageNote || '',
        repairStatus: book.repairStatus || '',
      });
    }
  }, [book]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.status === 'damaged' && !String(formData.damageNote || '').trim()) {
      alert('Please describe the book damage before marking it as damaged.');
      return;
    }
    onSubmit({
      ...formData,
      availableCopies: formData.status === 'damaged' ? 0 : formData.availableCopies,
      damageNote: formData.status === 'damaged' ? formData.damageNote : '',
      repairStatus: formData.status === 'damaged' ? (formData.repairStatus || 'Damaged') : '',
      id: book?.id,
    });
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === 'copies' || name === 'publishedYear' || name === 'availableCopies'
        ? parseInt(value) || 0
        : value,
    }));
  };

  return (
    <div className="fixed inset-0 bg-slate-900/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-6 border-b border-slate-200">
          <h2 className="text-xl font-bold text-slate-800">
            {book ? 'Edit Book' : 'Add New Book'}
          </h2>
          <button
            onClick={onCancel}
            className="text-slate-400 hover:text-slate-600 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="col-span-2">
              <Label htmlFor="title" className="text-slate-700 font-medium">Title</Label>
              <Input
                id="title"
                name="title"
                value={formData.title}
                onChange={handleChange}
                required
                className="mt-1 border-slate-300 focus:border-sky-500"
                placeholder="Enter book title"
              />
            </div>

            <div>
              <Label htmlFor="author" className="text-slate-700 font-medium">Author</Label>
              <Input
                id="author"
                name="author"
                value={formData.author}
                onChange={handleChange}
                required
                className="mt-1 border-slate-300 focus:border-sky-500"
                placeholder="Author name"
              />
            </div>

            <div>
              <Label htmlFor="isbn" className="text-slate-700 font-medium">ISBN</Label>
              <Input
                id="isbn"
                name="isbn"
                value={formData.isbn}
                onChange={handleChange}
                required
                className="mt-1 border-slate-300 focus:border-sky-500"
                placeholder="978-..."
              />
            </div>

            <div>
              <Label htmlFor="category" className="text-slate-700 font-medium">Category</Label>
              <select
                id="category"
                name="category"
                value={formData.category}
                onChange={handleChange}
                required
                className="mt-1 w-full px-3 py-2 border border-slate-300 rounded-lg focus:border-sky-500 focus:outline-none"
              >
                <option value="">Select category</option>
                <option value="Fiction">Fiction</option>
                <option value="Technology">Technology</option>
                <option value="Romance">Romance</option>
                <option value="Fantasy">Fantasy</option>
                <option value="Non-Fiction">Non-Fiction</option>
                <option value="History">History</option>
                <option value="Science">Science</option>
              </select>
            </div>

            <div>
              <Label htmlFor="publisher" className="text-slate-700 font-medium">Publisher</Label>
              <Input
                id="publisher"
                name="publisher"
                value={formData.publisher}
                onChange={handleChange}
                className="mt-1 border-slate-300 focus:border-sky-500"
                placeholder="Publisher name"
              />
            </div>

            <div>
              <Label htmlFor="callNumber" className="text-slate-700 font-medium">Call Number</Label>
              <Input
                id="callNumber"
                name="callNumber"
                value={formData.callNumber}
                onChange={handleChange}
                className="mt-1 border-slate-300 focus:border-sky-500"
                placeholder="Shelf A1"
              />
            </div>

            <div>
              <Label htmlFor="location" className="text-slate-700 font-medium">Location</Label>
              <Input
                id="location"
                name="location"
                value={formData.location}
                onChange={handleChange}
                required
                className="mt-1 border-slate-300 focus:border-sky-500"
                placeholder="Shelf A-1"
              />
            </div>

            <div>
              <Label htmlFor="publishedYear" className="text-slate-700 font-medium">Year</Label>
              <Input
                id="publishedYear"
                name="publishedYear"
                type="number"
                value={formData.publishedYear}
                onChange={handleChange}
                required
                className="mt-1 border-slate-300 focus:border-sky-500"
                min="1000"
                max={new Date().getFullYear()}
              />
            </div>

            <div>
              <Label htmlFor="copies" className="text-slate-700 font-medium">Total Copies</Label>
              <Input
                id="copies"
                name="copies"
                type="number"
                value={formData.copies}
                onChange={handleChange}
                required
                className="mt-1 border-slate-300 focus:border-sky-500"
                min="1"
              />
            </div>

            <div>
              <Label htmlFor="availableCopies" className="text-slate-700 font-medium">Available</Label>
              <Input
                id="availableCopies"
                name="availableCopies"
                type="number"
                value={formData.availableCopies}
                onChange={handleChange}
                required
                className="mt-1 border-slate-300 focus:border-sky-500"
                min="0"
                max={formData.copies}
              />
            </div>

            <div>
              <Label htmlFor="status" className="text-slate-700 font-medium">Status</Label>
              <select
                id="status"
                name="status"
                value={formData.status}
                onChange={handleChange}
                className="mt-1 w-full px-3 py-2 border border-slate-300 rounded-lg focus:border-sky-500 focus:outline-none"
              >
                <option value="available">Available</option>
                <option value="borrowed">Borrowed</option>
                <option value="reserved">Reserved</option>
                <option value="missing">Missing</option>
                <option value="damaged">Damaged</option>
              </select>
            </div>
          </div>

          {formData.status === 'damaged' && (
            <div className="pt-2">
              <Label htmlFor="damageNote" className="text-slate-700 font-medium">Damage Note</Label>
              <Input
                id="damageNote"
                name="damageNote"
                value={formData.damageNote || ''}
                onChange={handleChange}
                required
                className="mt-1 border-slate-300 focus:border-sky-500"
                placeholder="Describe the damage"
              />
            </div>
          )}

          {formData.status === 'borrowed' && (
            <div className="grid grid-cols-2 gap-4 pt-2">
              <div>
                <Label htmlFor="borrower" className="text-slate-700 font-medium">Borrower</Label>
                <Input
                  id="borrower"
                  name="borrower"
                  value={formData.borrower}
                  onChange={handleChange}
                  className="mt-1 border-slate-300 focus:border-sky-500"
                  placeholder="Borrower name"
                />
              </div>
              <div>
                <Label htmlFor="dueDate" className="text-slate-700 font-medium">Due Date</Label>
                <Input
                  id="dueDate"
                  name="dueDate"
                  type="date"
                  value={formData.dueDate}
                  onChange={handleChange}
                  className="mt-1 border-slate-300 focus:border-sky-500"
                />
              </div>
            </div>
          )}

          <div className="flex gap-3 pt-4">
            <Button
              type="submit"
              className="flex-1 bg-sky-600 hover:bg-sky-700 text-white font-semibold py-2.5"
            >
              {book ? 'Save Changes' : 'Add Book'}
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={onCancel}
              className="flex-1 border-slate-300 text-slate-600 hover:bg-slate-50"
            >
              Cancel
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
