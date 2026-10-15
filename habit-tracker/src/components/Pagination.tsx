'use client';

import React from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  totalItems: number;
  itemsPerPage: number;
  onPageChange: (page: number) => void;
  label?: string;
}

export function Pagination({
  currentPage,
  totalPages,
  totalItems,
  itemsPerPage,
  onPageChange,
  label = 'habits',
}: PaginationProps) {
  if (totalPages <= 1) return null;

  const startItem = (currentPage - 1) * itemsPerPage + 1;
  const endItem = Math.min(currentPage * itemsPerPage, totalItems);

  const pages: number[] = [];
  for (let i = 1; i <= totalPages; i++) {
    pages.push(i);
  }

  return (
    <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-4 border-t border-white/10 text-slate-400">
      <div className="text-xs font-medium">
        Showing <span className="font-bold text-white">{startItem}</span> to{' '}
        <span className="font-bold text-white">{endItem}</span> of{' '}
        <span className="font-bold text-white">{totalItems}</span> {label}
      </div>

      <div className="flex items-center gap-1.5">
        <button
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage === 1}
          className="p-1.5 rounded-xl border border-white/10 bg-white/5 hover:bg-white/10 disabled:opacity-30 text-white transition-all shadow-xs"
          title="Previous Page"
        >
          <ChevronLeft className="w-4 h-4" />
        </button>

        {pages.map((p) => (
          <button
            key={p}
            onClick={() => onPageChange(p)}
            className={`w-8 h-8 rounded-xl text-xs font-bold transition-all shadow-xs ${
              p === currentPage
                ? 'bg-emerald-600 text-white border border-emerald-400/50 shadow-emerald-950/50'
                : 'bg-white/5 border border-white/10 text-slate-300 hover:bg-white/10 hover:text-white'
            }`}
          >
            {p}
          </button>
        ))}

        <button
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          className="p-1.5 rounded-xl border border-white/10 bg-white/5 hover:bg-white/10 disabled:opacity-30 text-white transition-all shadow-xs"
          title="Next Page"
        >
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
