import React from 'react';

const BookCard = ({ 
  book, 
  onAction, 
  actionLabel = "View Details", 
  showStatus = true, 
  variant = "default",
  className = ""
}) => {
  const getStatusBadge = (status, availableCopies) => {
    if (status === "Available" && availableCopies > 0) {
      return (
        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
           Available ({availableCopies})
        </span>
      );
    } else {
      return (
        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
           All Issued
        </span>
      );
    }
  };

  const cardVariants = {
    default: "bg-white hover:shadow-lg",
    compact: "bg-gray-50 hover:bg-white hover:shadow-md",
    featured: "bg-gradient-to-br from-blue-50 to-indigo-50 border-2 border-blue-200"
  };

  return (
    <div className={`rounded-xl shadow-md border border-gray-200 transition-all duration-200 ${cardVariants[variant]} ${className}`}>
      <div className="p-6">
        {/* Header */}
        <div className="flex justify-between items-start mb-4">
          <div className="flex-1">
            <h3 className="text-lg font-semibold text-gray-900 mb-1 line-clamp-2">
              {book.title}
            </h3>
            <p className="text-gray-600 text-sm mb-2">by {book.author}</p>
          </div>
          {showStatus && book.status && (
            <div className="ml-4 flex-shrink-0">
              {getStatusBadge(book.status, book.availableCopies)}
            </div>
          )}
        </div>

        {/* Book Details */}
        <div className="grid grid-cols-2 gap-3 text-sm text-gray-600 mb-4">
          <div>
            <span className="font-medium text-gray-700">ID:</span> {book.id || book.bookId}
          </div>
          <div>
            <span className="font-medium text-gray-700">Category:</span> {book.category}
          </div>
          {book.totalCopies !== undefined && (
            <>
              <div>
                <span className="font-medium text-gray-700">Total Copies:</span> {book.totalCopies}
              </div>
              <div>
                <span className="font-medium text-gray-700">Available:</span> {book.availableCopies}
              </div>
            </>
          )}
          {book.isbn && (
            <div className="col-span-2">
              <span className="font-medium text-gray-700">ISBN:</span> {book.isbn}
            </div>
          )}
        </div>

        {/* Additional Info (if present) */}
        {book.description && (
          <p className="text-gray-600 text-sm mb-4 line-clamp-3">
            {book.description}
          </p>
        )}

        {/* Action Button */}
        {onAction && (
          <button
            onClick={() => onAction(book)}
            className="w-full bg-gradient-to-r from-blue-500 to-indigo-500 hover:from-blue-600 hover:to-indigo-600 text-white py-2 px-4 rounded-lg text-sm font-medium transition-all duration-200 hover:shadow-lg transform hover:-translate-y-0.5"
          >
            {actionLabel}
          </button>
        )}

        {/* Custom Content Slot */}
        {book.customContent && (
          <div className="mt-4 pt-4 border-t border-gray-200">
            {book.customContent}
          </div>
        )}
      </div>
    </div>
  );
};

export default BookCard;
