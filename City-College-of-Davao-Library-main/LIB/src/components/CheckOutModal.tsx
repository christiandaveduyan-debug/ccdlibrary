import { useState } from 'react';
import { Book } from '../types';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { X } from 'lucide-react';

interface CheckOutModalProps {
  book: Book;
  onConfirm: (borrower: string, dueDate: string) => void;
  onCancel: () => void;
}

export function CheckOutModal({ book, onConfirm, onCancel }: CheckOutModalProps) {
  const [borrower, setBorrower] = useState('');
  const [dueDate, setDueDate] = useState('');

  const defaultDueDate = new Date();
  defaultDueDate.setDate(defaultDueDate.getDate() + 14);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (borrower && dueDate) {
      onConfirm(borrower, dueDate);
    }
  };

  return (
    <div className="fixed inset-0 bg-slate-900/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md">
        <div className="flex items-center justify-between p-6 border-b border-slate-200">
          <div>
            <h2 className="text-xl font-bold text-slate-800">Check Out Book</h2>
            <p className="text-sm text-slate-500 mt-1">{book.title}</p>
          </div>
          <button
            onClick={onCancel}
            className="text-slate-400 hover:text-slate-600 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <Label htmlFor="borrower" className="text-slate-700 font-medium">Borrower Name</Label>
            <Input
              id="borrower"
              value={borrower}
              onChange={(e) => setBorrower(e.target.value)}
              required
              className="mt-1 border-slate-300 focus:border-sky-500"
              placeholder="Enter borrower name"
            />
          </div>

          <div>
            <Label htmlFor="dueDate" className="text-slate-700 font-medium">Due Date</Label>
            <Input
              id="dueDate"
              type="date"
              value={dueDate}
              onChange={(e) => setDueDate(e.target.value)}
              required
              className="mt-1 border-slate-300 focus:border-sky-500"
              min={new Date().toISOString().split('T')[0]}
            />
          </div>

          <div className="flex gap-3 pt-2">
            <Button
              type="submit"
              className="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold py-2.5"
            >
              Confirm Check Out
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