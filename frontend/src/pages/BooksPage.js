import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const BooksPage = ({ userRole }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterBy, setFilterBy] = useState('all');
  const navigate = useNavigate();

  // Sample data - matches your database schema (Books table with related data)
  const sampleBooks = [
    {
      // Books table fields
      bookId: 'BOOK001',
      title: "Introduction to Database Systems",
      isbn: '9780321197849',
      category: 'Computer Science',
      totalCopies: 5,
      
      // Authors table data (via author-id FK)
      authorId: 'AUTH001',
      authorName: "C.J. Date",
      authorBio: "Renowned database expert and author",
      
      // Book-Copies status summary
      availableCopies: 3,
      issuedCopies: 2,
      damagedCopies: 0,
      lostCopies: 0,
      
      // Derived status
      status: "Available"
    },
    {
      // Books table fields
      bookId: 'BOOK002',
      title: "Clean Code",
      isbn: '9780132350884',
      category: 'Programming',
      totalCopies: 3,
      
      // Authors table data
      authorId: 'AUTH002',
      authorName: "Robert C. Martin",
      authorBio: "Software engineer and author, known as Uncle Bob",
      
      // Book-Copies status summary
      availableCopies: 0,
      issuedCopies: 3,
      damagedCopies: 0,
      lostCopies: 0,
      
      // Derived status
      status: "All Issued"
    },
    {
      // Books table fields
      bookId: 'BOOK003',
      title: "Data Structures and Algorithms",
      isbn: '9780262033848',
      category: 'Computer Science',
      totalCopies: 4,
      
      // Authors table data
      authorId: 'AUTH003',
      authorName: "Thomas H. Cormen",
      authorBio: "Professor of Computer Science at Dartmouth College",
      
      // Book-Copies status summary
      availableCopies: 2,
      issuedCopies: 1,
      damagedCopies: 1,
      lostCopies: 0,
      
      // Derived status
      status: "Available"
    },
    {
      // Books table fields
      bookId: 'BOOK004',
      title: "The Pragmatic Programmer",
      isbn: '9780201616224',
      category: 'Programming',
      totalCopies: 2,
      
      // Authors table data
      authorId: 'AUTH004',
      authorName: "David Thomas",
      authorBio: "Software developer and author of programming books",
      
      // Book-Copies status summary
      availableCopies: 1,
      issuedCopies: 1,
      damagedCopies: 0,
      lostCopies: 0,
      
      // Derived status
      status: "Available"
    }
  ];

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

  const filteredBooks = sampleBooks.filter(book => {
    const matchesSearch = book.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         book.authorName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         book.bookId.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         book.isbn.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filterBy === 'all' || 
                         (filterBy === 'available' && book.availableCopies > 0) ||
                         (filterBy === 'issued' && book.availableCopies === 0);
    return matchesSearch && matchesFilter;
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">📚 Books Collection</h1>
              <p className="text-gray-600">Browse and search through our library collection</p>
            </div>
            {userRole === 'Admin' && (
              <div className="mt-4 sm:mt-0">
                <button
                  onClick={() => navigate('/add-book')}
                  className="bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white px-6 py-3 rounded-lg font-medium transition-all duration-200 hover:shadow-lg transform hover:-translate-y-0.5 flex items-center space-x-2"
                >
                  <span>➕</span>
                  <span>Add New Book</span>
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Search and Filter Controls */}
        <div className="bg-white rounded-xl shadow-md p-6 mb-8">
          <div className="flex flex-col sm:flex-row gap-4">
            {/* Search Bar */}
            <div className="flex-1">
              <label htmlFor="search" className="block text-sm font-medium text-gray-700 mb-2">
                 Search Books
              </label>
              <input
                type="text"
                id="search"
                placeholder="Search by title or author..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
              />
            </div>

            {/* Filter Dropdown */}
            <div className="sm:w-48">
              <label htmlFor="filter" className="block text-sm font-medium text-gray-700 mb-2">
                 Filter by Status
              </label>
              <select
                id="filter"
                value={filterBy}
                onChange={(e) => setFilterBy(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
              >
                <option value="all">All Books</option>
                <option value="available">Available Only</option>
                <option value="issued">Issued Only</option>
              </select>
            </div>
          </div>
        </div>

        {/* Books Display */}
        <div className="bg-white rounded-xl shadow-md overflow-hidden">
          {/* Desktop Table View */}
          <div className="hidden md:block overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gradient-to-r from-blue-50 to-indigo-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Book Details
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Author Info
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Category & ISBN
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Copy Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Availability
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredBooks.map((book) => (
                  <tr key={book.bookId} className="hover:bg-gray-50 transition-colors duration-200">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">{book.title}</div>
                      <div className="text-sm text-gray-500">Book ID: {book.bookId}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">{book.authorName}</div>
                      <div className="text-sm text-gray-500">ID: {book.authorId}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">{book.category}</div>
                      <div className="text-sm text-gray-500">ISBN: {book.isbn}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-xs text-gray-600">
                        <div>Available: {book.availableCopies}</div>
                        <div>Issued: {book.issuedCopies}</div>
                        <div>Damaged: {book.damagedCopies}</div>
                        <div>Lost: {book.lostCopies}</div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {getStatusBadge(book.status, book.availableCopies)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Mobile Card View */}
          <div className="md:hidden">
            {filteredBooks.map((book) => (
              <div key={book.bookId} className="p-6 border-b border-gray-200 last:border-b-0">
                <div className="flex justify-between items-start mb-2">
                  <h3 className="text-lg font-medium text-gray-900">{book.title}</h3>
                  {getStatusBadge(book.status, book.availableCopies)}
                </div>
                <p className="text-sm text-gray-600 mb-1"> {book.authorName} ({book.authorId})</p>
                <p className="text-sm text-gray-600 mb-1"> {book.category}   {book.isbn}</p>
                <p className="text-sm text-gray-600 mb-1"> Book ID: {book.bookId}</p>
                <div className="text-sm text-gray-600">
                  <span className="font-medium"> Status:</span> Available: {book.availableCopies} | Issued: {book.issuedCopies} | Damaged: {book.damagedCopies} | Lost: {book.lostCopies}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Results Info */}
        <div className="mt-6 text-center text-gray-600">
          Showing {filteredBooks.length} of {sampleBooks.length} books
        </div>

        {/* Backend Integration Note */}
        <div className="mt-8 bg-blue-50 border border-blue-200 rounded-xl p-6">
          <h3 className="text-lg font-semibold text-blue-800 mb-2">🔧 Ready for Backend Integration</h3>
          <p className="text-blue-700">
            This page is ready to connect to your Python backend API endpoint: 
            <code className="bg-blue-100 px-2 py-1 rounded ml-1">GET /api/books</code>
          </p>
          {userRole === 'Student' && (
            <p className="text-blue-600 text-sm mt-2">
              Students can browse and search all available books in the library collection.
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default BooksPage;