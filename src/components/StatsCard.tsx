import { Book } from '../types';

interface StatsCardProps {
  books: Book[];
}

export function StatsCard({ books }: StatsCardProps) {
  const totalBooks = books.reduce((sum, book) => sum + book.copies, 0);
  const availableBooks = books.reduce((sum, book) => sum + book.availableCopies, 0);
  const checkedOut = books.filter((b) => b.status === 'borrowed').length;
  const reserved = books.filter((b) => b.status === 'reserved').length;

  const stats = [
    { label: 'Total Books', value: totalBooks, color: 'bg-sky-500' },
    { label: 'Available', value: availableBooks, color: 'bg-emerald-500' },
    { label: 'Checked Out', value: checkedOut, color: 'bg-amber-500' },
    { label: 'Reserved', value: reserved, color: 'bg-violet-500' },
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      {stats.map((stat) => (
        <div
          key={stat.label}
          className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm hover:shadow-md transition-shadow duration-200"
        >
          <div className="flex items-center gap-3">
            <div className={`${stat.color} w-2 h-12 rounded-full`} />
            <div>
              <p className="text-slate-500 text-sm font-medium">{stat.label}</p>
              <p className="text-3xl font-bold text-slate-800">{stat.value}</p>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}