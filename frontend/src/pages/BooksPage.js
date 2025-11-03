import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const BooksPage = ({ userRole }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterBy, setFilterBy] = useState('all');
  const [sampleBooks, setSampleBooks] = useState([]);  // initialize as empty array
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    // test connection
    fetch("http://localhost:8000/")
      .then(res => res.json())
      .then(data => console.log("BACKEND CONNECTED:", data))
      .catch(err => console.error("CONNECTION ERROR:", err));

    // fetch books
    fetch("http://localhost:8000/all-books/")
      .then(res => res.json())
      .then(data => {
        console.log("BOOKS DATA:", data);
        if (data.status === "success" && Array.isArray(data.data)) {
          setSampleBooks(data.data);
        } else if (Array.isArray(data)) {
          // In case backend directly returns array
          setSampleBooks(data);
        } else {
          setSampleBooks([]);
          setError("Invalid data format from backend");
        }
      })
      .catch(err => {
        console.error("ERROR FETCHING BOOKS:", err);
        setError("Failed to load books");
      })
      .finally(() => setLoading(false));
  }, []);

  // Helper for badges
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

  // Prevent filtering if books not loaded yet
  const filteredBooks = sampleBooks.filter(book => {
    const matchesSearch =
      book.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      book.author_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      String(book.book_id).toLowerCase().includes(searchTerm.toLowerCase()) ||
      book.isbn?.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesFilter =
      filterBy === 'all' ||
      (filterBy === 'available' && book.available_copies > 0) ||
      (filterBy === 'issued' && book.available_copies === 0);

    return matchesSearch && matchesFilter;
  });

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen text-lg text-gray-700">
        Loading books...
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center h-screen text-lg text-red-600">
        {error}
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">Books Collection</h1>
              <p className="text-gray-600">Browse and search through our library collection</p>
            </div>
            {userRole === 'Admin' && (
              <div className="mt-4 sm:mt-0">
                <button
                  onClick={() => navigate('/add-book')}
                  className="bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white px-6 py-3 rounded-lg font-medium transition-all duration-200 hover:shadow-lg transform hover:-translate-y-0.5 flex items-center space-x-2"
                >
                  <span>+</span>
                  <span>Add New Book</span>
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Search and Filter */}
        <div className="bg-white rounded-xl shadow-md p-6 mb-8">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <label htmlFor="search" className="block text-base pb-3 font-medium text-gray-700 mb-2">
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

            {/* <div className="sm:w-48">
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
            </div> */}
          </div>
        </div>

        {/* Books Table */}
        <div className="bg-white rounded-xl shadow-md overflow-hidden">
          <div className="hidden md:block overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gradient-to-r from-blue-50 to-indigo-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Title
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Author
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Category
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    ISBN
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Total Copies
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredBooks.map((book) => (
                  <tr
                    key={book.book_id}
                    className="hover:bg-gray-50 transition-colors duration-200"
                  >
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-base font-medium text-gray-900">
                        {book.title}
                      </div>
                      <div className="text-sm text-gray-500">
                        ID: {book.book_id}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {book.author_name}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {book.category_name}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {book.isbn}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {book.total_copies}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Mobile Card View */}
          <div className="md:hidden">
            {filteredBooks.map((book) => (
              <div
                key={book.book_id}
                className="p-6 border-b border-gray-200 last:border-b-0"
              >
                <h3 className="text-lg font-semibold text-gray-900 mb-1">
                  {book.title}
                </h3>
                <p className="text-sm text-gray-600">
                  Author: <span className="font-medium">{book.author_name}</span>
                </p>
                <p className="text-sm text-gray-600">
                  Category: <span className="font-medium">{book.category_name}</span>
                </p>
                <p className="text-sm text-gray-600">ISBN: {book.isbn}</p>
                <p className="text-sm text-gray-600">
                  Total Copies: <span className="font-medium">{book.total_copies}</span>
                </p>
                <p className="text-xs text-gray-500 mt-2">Book ID: {book.book_id}</p>
              </div>
            ))}
          </div>
        </div>


        <div className="mt-6 text-center text-gray-600">
          Showing {filteredBooks.length} of {sampleBooks.length} books
        </div>
      </div>
    </div>
  );
};

export default BooksPage;
