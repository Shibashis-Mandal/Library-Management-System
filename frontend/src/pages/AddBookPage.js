import React, { useEffect, useState } from 'react';

const AddBookPage = () => {
  const [formData, setFormData] = useState({
    // Books table fields
    title: '',
    isbn: '',
    category: '',
    totalCopies: '1',
    
    // Authors table fields (will be created/linked)
    authorName: '',
    shelfLocation: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });
  
  const categories = [
    'Computer Science',
    'Programming',
    'Mathematics',
    'Physics',
    'Chemistry',
    'Biology',
    'Engineering',
    'Literature',
    'History',
    'Economics',
    'Management',
    'Fiction',
    'Non-Fiction',
    'Self-Help',
    'Other'
  ];
  
  
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setMessage({ type: '', text: '' });
    
    try {
      const requiredFields = ['title', 'authorName', 'isbn', 'category', 'totalCopies'];
      const missingFields = requiredFields.filter(field => !formData[field]?.trim());
      if (missingFields.length > 0) {
        throw new Error(`Please fill in all required fields: ${missingFields.join(', ')}`);
      }
      
      const isbnPattern = /^(978|979)?[0-9]{9}[0-9X]$/;
      if (!isbnPattern.test(formData.isbn.replace(/[-\s]/g, ''))) {
        throw new Error('Please enter a valid ISBN (10 or 13 digits)');
      }
      
      if (parseInt(formData.totalCopies) < 1) {
        throw new Error('Total copies must be at least 1');
      }
      
      // Make API call to FastAPI backend
      const apiUrl = `http://localhost:8000/books/${encodeURIComponent(formData.title)}/${encodeURIComponent(formData.authorName)}/${encodeURIComponent(formData.category)}/${encodeURIComponent(formData.isbn)}/${encodeURIComponent(formData.totalCopies)}/${encodeURIComponent(formData.shelfLocation)}`;
      
      const response = await fetch(apiUrl, {
        method: 'POST',
      });
      console.log(response)
      
      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Failed to add book: ${errorText}`);
      }
      
      const result = await response.json();
      
      setMessage({
        type: 'success',
        text: result.message || 'Book added successfully to the library.'
      });
      
      setFormData({
        title: '',
        isbn: '',
        category: '',
        totalCopies: '1',
        authorName: '',
        shelfLocation: '',
      });
      
    } catch (error) {
      setMessage({
        type: 'error',
        text: error.message || 'Failed to add book. Please try again.'
      });
    } finally {
      setIsSubmitting(false);
    }
  };
  
  //   useEffect(() => {
      const generateBookId = () => {
          const randomId =  Math.floor(Math.random() * 10000).toString().padStart(10, '0');
          return randomId;
        };
      // }, []);
      
      const [bookId] = useState(() => generateBookId());
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
    <h1 className="text-3xl font-bold text-gray-900 mb-2">Add New Book</h1>
          <p className="text-gray-600">Add a new book to the library collection</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Form */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-xl shadow-md p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-6">Book Information</h2>

              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Basic Information */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Title */}
                  <div className="md:col-span-2">
                    <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-2">
                       Book Title <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      id="title"
                      name="title"
                      value={formData.title}
                      onChange={handleInputChange}
                      placeholder="Enter book title"
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                      required
                    />
                  </div>

                  {/* Author Name */}
                  <div>
                    <label htmlFor="authorName" className="block text-sm font-medium text-gray-700 mb-2">
                       Author Name <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      id="authorName"
                      name="authorName"
                      value={formData.authorName}
                      onChange={handleInputChange}
                      placeholder="Enter author name"
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                      required
                    />
                  </div>

                  {/* ISBN */}
                  <div>
                    <label htmlFor="isbn" className="block text-sm font-medium text-gray-700 mb-2">
                       ISBN <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      id="isbn"
                      name="isbn"
                      value={formData.isbn}
                      onChange={handleInputChange}
                      placeholder="978-XXXXXXXXX"
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                      required
                    />
                  </div>

                  {/* Category */}
                  <div>
                    <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-2">
                       Category <span className="text-red-500">*</span>
                    </label>
                    <select
                      id="category"
                      name="category"
                      value={formData.category}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                      required
                    >
                      <option value="">Select category</option>
                      {categories.map(cat => (
                        <option key={cat} value={cat}>{cat}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label htmlFor="totalCopies" className="block text-sm font-medium text-gray-700 mb-2">
                      Total Copies <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="number"
                      id="totalCopies"
                      name="totalCopies"
                      value={formData.totalCopies}
                      onChange={handleInputChange}
                      min="1"
                      max="100"
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                      required
                    />
                  </div>
                  
                  {/* Shelf Location */}
                  <div>
                    <label htmlFor="shelfLocation" className="block text-sm font-medium text-gray-700 mb-2">
                      Shelf Location <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      id="shelfLocation"
                      name="shelfLocation"
                      value={formData.shelfLocation}
                      onChange={handleInputChange}
                      placeholder="Enter shelf location"
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                      required
                    />
                  </div>

                </div>
                
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className={`w-full py-3 px-6 rounded-lg text-white font-medium transition-all duration-200 ${
                    isSubmitting
                      ? 'bg-gray-400 cursor-not-allowed'
                      : 'bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 hover:shadow-lg transform hover:-translate-y-0.5'
                  }`}
                >
                  {isSubmitting ? 'Adding Book...' : 'Add Book to Library'}
                </button>
              </form>

              {/* Message Display */}
              {message.text && (
                <div className={`mt-6 p-4 rounded-lg ${
                  message.type === 'success' 
                    ? 'bg-green-50 border border-green-200 text-green-800'
                    : 'bg-red-50 border border-red-200 text-red-800'
                }`}>
                  {message.text}
                </div>
              )}
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Book ID Preview */}
            <div className="bg-white rounded-xl shadow-md p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4"> Book ID Preview</h3>
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <p className="text-sm text-gray-600 mb-2">Generated ISBN:</p>
                <p className="text-lg font-mono font-bold text-blue-800">{bookId}</p>
                <p className="text-xs text-gray-500 mt-2">Auto-generated on save</p>
              </div>
            </div>

            {/* Guidelines */}
            <div className="bg-white rounded-xl shadow-md p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4"> Guidelines</h3>
              <ul className="space-y-3 text-sm text-gray-600">
                <li className="flex items-start space-x-2">
                  <span className="text-green-500 mt-1">•</span>
                  <span>Verify book details before adding</span>
                </li>
                <li className="flex items-start space-x-2">
                  <span className="text-green-500 mt-1">•</span>
                  <span>Check for duplicate ISBN numbers</span>
                </li>
                <li className="flex items-start space-x-2">
                  <span className="text-green-500 mt-1">•</span>
                  <span>Use standard ISBN format</span>
                </li>
                <li className="flex items-start space-x-2">
                  <span className="text-green-500 mt-1">•</span>
                  <span>Select appropriate category</span>
                </li>
                <li className="flex items-start space-x-2">
                  <span className="text-green-500 mt-1">•</span>
                  <span>Multiple copies create separate entries</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddBookPage;