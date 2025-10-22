import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "./ui/button";

export function Pagination({
  currentPage,
  totalPages,
  onPageChange,
  itemsPerPage,
  totalItems
}) {
  const startItem = (currentPage - 1) * itemsPerPage + 1;
  const endItem = Math.min(currentPage * itemsPerPage, totalItems);

  // Generate page numbers to display
  const getPageNumbers = () => {
    const pages = [];
    const maxPagesToShow = 5;

    if (totalPages <= maxPagesToShow) {
      // Show all pages if total is small
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      // Show first, last, current, and nearby pages
      if (currentPage <= 3) {
        // Near the start
        for (let i = 1; i <= 4; i++) pages.push(i);
        pages.push('...');
        pages.push(totalPages);
      } else if (currentPage >= totalPages - 2) {
        // Near the end
        pages.push(1);
        pages.push('...');
        for (let i = totalPages - 3; i <= totalPages; i++) pages.push(i);
      } else {
        // In the middle
        pages.push(1);
        pages.push('...');
        pages.push(currentPage - 1);
        pages.push(currentPage);
        pages.push(currentPage + 1);
        pages.push('...');
        pages.push(totalPages);
      }
    }

    return pages;
  };

  if (totalPages <= 1) return null;

  return (
    <div className="flex items-center justify-between bg-white/10 backdrop-blur-lg border border-white/20 rounded-lg p-4">
      {/* Items info */}
      <div className="text-white/70 text-sm">
        Showing <span className="font-semibold text-white">{startItem}</span> to{' '}
        <span className="font-semibold text-white">{endItem}</span> of{' '}
        <span className="font-semibold text-white">{totalItems}</span> results
      </div>

      {/* Page controls */}
      <div className="flex items-center gap-2">
        {/* Previous button */}
        <Button
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage === 1}
          variant="outline"
          size="sm"
          className="bg-white/10 border-white/20 text-white hover:bg-white/20 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <ChevronLeft className="w-4 h-4" />
        </Button>

        {/* Page numbers */}
        <div className="flex gap-1">
          {getPageNumbers().map((page, index) => {
            if (page === '...') {
              return (
                <span key={`ellipsis-${index}`} className="px-3 py-1 text-white/50">
                  ...
                </span>
              );
            }

            return (
              <Button
                key={page}
                onClick={() => onPageChange(page)}
                variant={currentPage === page ? 'default' : 'outline'}
                size="sm"
                className={
                  currentPage === page
                    ? 'bg-purple-500 border-purple-400 text-white hover:bg-purple-600'
                    : 'bg-white/10 border-white/20 text-white hover:bg-white/20'
                }
              >
                {page}
              </Button>
            );
          })}
        </div>

        {/* Next button */}
        <Button
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          variant="outline"
          size="sm"
          className="bg-white/10 border-white/20 text-white hover:bg-white/20 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <ChevronRight className="w-4 h-4" />
        </Button>
      </div>
    </div>
  );
}
