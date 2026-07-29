import React from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface PaginationControlsProps {
  currentPage: number;
  totalPages: number;
  totalItems: number;
  itemsPerPage?: number;
  onPageChange: (page: number) => void;
  className?: string;
}

export const PaginationControls: React.FC<PaginationControlsProps> = ({
  currentPage,
  totalPages,
  totalItems,
  itemsPerPage = 20,
  onPageChange,
  className = ''
}) => {
  if (totalPages <= 1) return null;

  const startItem = (currentPage - 1) * itemsPerPage + 1;
  const endItem = Math.min(currentPage * itemsPerPage, totalItems);

  // Generate page numbers array
  const pageNumbers: number[] = [];
  const maxButtons = 7;
  let startPage = Math.max(1, currentPage - 3);
  let endPage = Math.min(totalPages, startPage + maxButtons - 1);

  if (endPage - startPage < maxButtons - 1) {
    startPage = Math.max(1, endPage - maxButtons + 1);
  }

  for (let i = startPage; i <= endPage; i++) {
    pageNumbers.push(i);
  }

  return (
    <div
      className={`flex flex-col sm:flex-row items-center justify-between gap-4 p-4 bg-white rounded-2xl border border-slate-200 shadow-sm text-xs font-semibold text-slate-700 ${className}`}
    >
      <div className="text-slate-500 font-medium">
        Showing <span className="font-extrabold text-slate-900">{startItem}</span> to{' '}
        <span className="font-extrabold text-slate-900">{endItem}</span> of{' '}
        <span className="font-extrabold text-slate-900">{totalItems}</span> items
      </div>

      <div className="flex items-center gap-1.5 flex-wrap">
        <button
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage === 1}
          className="px-3 py-1.5 rounded-xl border border-slate-200 bg-slate-50 hover:bg-slate-100 disabled:opacity-40 disabled:cursor-not-allowed flex items-center gap-1 text-slate-800 font-bold transition-all"
        >
          <ChevronLeft className="w-4 h-4" />
          <span>Prev</span>
        </button>

        {startPage > 1 && (
          <>
            <button
              onClick={() => onPageChange(1)}
              className="w-8 h-8 rounded-xl border border-slate-200 bg-slate-50 hover:bg-slate-100 text-slate-800 font-extrabold transition-all"
            >
              1
            </button>
            {startPage > 2 && <span className="px-1 text-slate-400">...</span>}
          </>
        )}

        {pageNumbers.map((page) => (
          <button
            key={page}
            onClick={() => onPageChange(page)}
            className={`w-8 h-8 rounded-xl font-extrabold transition-all border ${
              page === currentPage
                ? 'bg-santic-red text-white border-santic-red shadow-md shadow-red-500/20'
                : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100 hover:text-slate-900'
            }`}
          >
            {page}
          </button>
        ))}

        {endPage < totalPages && (
          <>
            {endPage < totalPages - 1 && <span className="px-1 text-slate-400">...</span>}
            <button
              onClick={() => onPageChange(totalPages)}
              className="w-8 h-8 rounded-xl border border-slate-200 bg-slate-50 hover:bg-slate-100 text-slate-800 font-extrabold transition-all"
            >
              {totalPages}
            </button>
          </>
        )}

        <button
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          className="px-3 py-1.5 rounded-xl border border-slate-200 bg-slate-50 hover:bg-slate-100 disabled:opacity-40 disabled:cursor-not-allowed flex items-center gap-1 text-slate-800 font-bold transition-all"
        >
          <span>Next</span>
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
