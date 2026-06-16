import { Book } from '../types';
import { formatDate, formatDueDate, getStatusColor } from '../utils/helpers';
import { Button } from '../components/ui/button';
import { Clock, MapPin, User } from 'lucide-react';

interface BookCardProps {
  book: Book;
  onEdit: (book: Book) => void;
  onDelete: (id: string) => void;
  onCheckOut: (book: Book) => void;
  onCheckIn: (book: Book) => void;
}

export function BookCard({ book, onEdit, onDelete, onCheckOut, onCheckIn }: BookCardProps) {
  return (
    <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm hover:shadow-lg transition-all duration-200 group">
      <div className="flex justify-between items-start mb-3">
        <span className={`px-3 py-1 rounded-full text-xs font-semibold border ${getStatusColor(book.status)}`}>
          {book.status.replace('-', ' ')}
        </span>
        <span className="text-slate-400 text-sm font-mono">{book.isbn}</span>
      </div>

      <h3 className="text-lg font-bold text-slate-800 mb-1 line-clamp-1">{book.title}</h3>
      <p className="text-slate-600 mb-3">by {book.author}</p>

      <div className="space-y-2 mb-4">
        <div className="flex items-center gap-2 text-sm text-slate-500">
          <MapPin className="w-4 h-4" />
          <span>{book.location}</span>
        </div>
        <div className="flex items-center gap-2 text-sm text-slate-500">
          <Clock className="w-4 h-4" />
          <span>Added {formatDate(book.addedDate)}</span>
        </div>
        {book.borrower && (
          <div className="flex items-center gap-2 text-sm text-slate-500">
            <User className="w-4 h-4" />
            <span>{book.borrower} • {book.dueDate && formatDueDate(book.dueDate)}</span>
          </div>
        )}
      </div>

      <div className="flex items-center justify-between pt-3 border-t border-slate-100">
        <div className="text-sm">
          <span className="text-slate-500">Copies: </span>
          <span className="font-semibold text-slate-700">{book.availableCopies}/{book.copies}</span>
        </div>
        <div className="flex gap-2">
          {book.status === 'available' && book.availableCopies > 0 && (
            <Button
              size="sm"
              variant="outline"
              onClick={() => onCheckOut(book)}
              className="text-xs bg-emerald-50 border-emerald-200 text-emerald-700 hover:bg-emerald-100"
            >
              Check Out
            </Button>
          )}
          {book.status === 'borrowed' && (
            <Button
              size="sm"
              variant="outline"
              onClick={() => onCheckIn(book)}
              className="text-xs bg-sky-50 border-sky-200 text-sky-700 hover:bg-sky-100"
            >
              Check In
            </Button>
          )}
          <Button
            size="sm"
            variant="ghost"
            onClick={() => onEdit(book)}
            className="text-xs text-slate-600 hover:text-slate-800 hover:bg-slate-100"
          >
            Edit
          </Button>
          <Button
            size="sm"
            variant="ghost"
            onClick={() => onDelete(book.id)}
            className="text-xs text-red-500 hover:text-red-700 hover:bg-red-50"
          >
            Delete
          </Button>
        </div>
      </div>
    </div>
  );
}