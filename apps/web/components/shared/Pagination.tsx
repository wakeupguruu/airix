import React from 'react';

export interface PaginationProps {
  currentPage: number;
  totalPages: number;
  totalItems: number;
  itemsPerPage: number;
  onPageChange: (page: number) => void;
}

export function Pagination({ currentPage, totalPages, totalItems, itemsPerPage, onPageChange }: PaginationProps) {
  const getPageNumbers = () => {
    const pages: (number | string)[] = [];
    if (totalPages <= 5) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      if (currentPage <= 3) {
        pages.push(1, 2, 3, 4, '...', totalPages);
      } else if (currentPage >= totalPages - 2) {
        pages.push(1, '...', totalPages - 3, totalPages - 2, totalPages - 1, totalPages);
      } else {
        pages.push(1, '...', currentPage - 1, currentPage, currentPage + 1, '...', totalPages);
      }
    }
    return pages;
  };

  const startItem = (currentPage - 1) * itemsPerPage + 1;
  const endItem = Math.min(currentPage * itemsPerPage, totalItems);

  if (totalPages <= 1 && totalItems === 0) return null;

  return (
    <div className="flex items-center justify-between w-full">
      <div className="text-xs text-[#6c6a64] dark:text-[#a09d96]">
        Showing {startItem} to {endItem} of {totalItems} items
      </div>
      
      <div className="flex items-center space-x-1.5">
        <button
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage === 1}
          className="p-1.5 rounded-md border border-[#e6dfd8] dark:border-[#2a2a2b] text-[#6c6a64] dark:text-[#a09d96] disabled:opacity-50 disabled:cursor-not-allowed hover:bg-[#efe9de]/50 dark:hover:bg-[#161618]/50 transition-colors"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
          </svg>
        </button>
        
        {getPageNumbers().map((page, index) => {
          if (page === '...') {
            return (
              <span key={`ellipsis-${index}`} className="px-2 text-[#6c6a64] dark:text-[#a09d96] text-xs font-medium">
                &hellip;
              </span>
            );
          }
          
          const isCurrent = page === currentPage;
          return (
            <button
              key={`page-${page}`}
              onClick={() => onPageChange(page as number)}
              className={`min-w-[32px] h-8 px-2 rounded-md text-xs transition-colors ${
                isCurrent 
                  ? 'bg-[#cc785c] text-white font-semibold' 
                  : 'border border-[#e6dfd8] dark:border-[#2a2a2b] text-[#6c6a64] dark:text-[#a09d96] hover:bg-[#efe9de]/50 dark:hover:bg-[#161618]/50'
              }`}
            >
              {page}
            </button>
          );
        })}

        <button
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          className="p-1.5 rounded-md border border-[#e6dfd8] dark:border-[#2a2a2b] text-[#6c6a64] dark:text-[#a09d96] disabled:opacity-50 disabled:cursor-not-allowed hover:bg-[#efe9de]/50 dark:hover:bg-[#161618]/50 transition-colors"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
          </svg>
        </button>
      </div>
    </div>
  );
}
