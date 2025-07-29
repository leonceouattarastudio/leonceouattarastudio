'use client';

import React from 'react';
import { ChevronLeft, ChevronRight, MoreHorizontal } from 'lucide-react';
import { cn } from '@/lib/utils';

interface BlogPaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  className?: string;
}

export const BlogPagination: React.FC<BlogPaginationProps> = ({
  currentPage,
  totalPages,
  onPageChange,
  className = ''
}) => {
  const getVisiblePages = () => {
    const delta = 2;
    const range = [];
    const rangeWithDots = [];

    for (let i = Math.max(2, currentPage - delta); i <= Math.min(totalPages - 1, currentPage + delta); i++) {
      range.push(i);
    }

    if (currentPage - delta > 2) {
      rangeWithDots.push(1, '...');
    } else {
      rangeWithDots.push(1);
    }

    rangeWithDots.push(...range);

    if (currentPage + delta < totalPages - 1) {
      rangeWithDots.push('...', totalPages);
    } else if (totalPages > 1) {
      rangeWithDots.push(totalPages);
    }

    return rangeWithDots;
  };

  if (totalPages <= 1) return null;

  const visiblePages = getVisiblePages();

  return (
    <div className={cn("flex items-center justify-center space-x-2", className)}>
      {/* Previous Button */}
      <button
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        className={cn(
          "flex items-center space-x-2 px-4 py-2 rounded-lg transition-all",
          currentPage === 1
            ? "bg-gray-800/50 text-gray-500 cursor-not-allowed"
            : "bg-gray-800/50 text-gray-300 hover:bg-gray-700 hover:text-white border border-gray-600 hover:border-gray-500"
        )}
      >
        <ChevronLeft className="w-4 h-4" />
        <span className="hidden sm:inline">Précédent</span>
      </button>

      {/* Page Numbers */}
      <div className="flex items-center space-x-1">
        {visiblePages.map((page, index) => (
          <React.Fragment key={index}>
            {page === '...' ? (
              <div className="flex items-center justify-center w-10 h-10">
                <MoreHorizontal className="w-4 h-4 text-gray-500" />
              </div>
            ) : (
              <button
                onClick={() => onPageChange(page as number)}
                className={cn(
                  "w-10 h-10 rounded-lg transition-all font-medium",
                  currentPage === page
                    ? "bg-gradient-to-r from-[#00F5FF] to-[#9D4EDD] text-white shadow-lg"
                    : "bg-gray-800/50 text-gray-300 hover:bg-gray-700 hover:text-white border border-gray-600 hover:border-gray-500"
                )}
              >
                {page}
              </button>
            )}
          </React.Fragment>
        ))}
      </div>

      {/* Next Button */}
      <button
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        className={cn(
          "flex items-center space-x-2 px-4 py-2 rounded-lg transition-all",
          currentPage === totalPages
            ? "bg-gray-800/50 text-gray-500 cursor-not-allowed"
            : "bg-gray-800/50 text-gray-300 hover:bg-gray-700 hover:text-white border border-gray-600 hover:border-gray-500"
        )}
      >
        <span className="hidden sm:inline">Suivant</span>
        <ChevronRight className="w-4 h-4" />
      </button>
    </div>
  );
};

export default BlogPagination;