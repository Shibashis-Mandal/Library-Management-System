import React, { useState } from 'react';

const AddBookPage = () => {
  const [formData, setFormData] = useState({
    // Books table fields
    title: '',
    isbn: '',
    category: '',
    totalCopies: '1',
    
    // Authors table fields (will be created/linked)
    authorName: '',
    authorBio: '',
    
    // Book-Copies table fields
    purchaseDate: new Date().toISOString().split('T')[0],
    shelfLocation: '',
    
    // Additional fields for UI
    publisher: '',
    publicationYear: '',
    description: '',
    language: 'English',
    edition: '',
    pages: '',
    price: ''
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
    'Other'
  ];

  const languages = [
    'English',
    'Hindi', 
    'Bengali',
    'Tamil',
    'Telugu',
    'Marathi',
    'Gujarati',
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
      // Validate required fields according to DB schema
      const requiredFields = ['title', 'authorName', 'isbn', 'category', 'totalCopies', 'shelfLocation'];
      const missingFields = requiredFields.filter(field => !formData[field].trim());
      
      if (missingFields.length > 0) {
        throw new Error(`Please fill in all required fields: ${missingFields.join(', ')}`);
      }

      // Validate ISBN format (basic check)
      const isbnPattern = /^(978|979)?[0-9]{9}[0-9X]$/;
      if (!isbnPattern.test(formData.isbn.replace(/[-\s]/g, ''))) {
        throw new Error('Please enter a valid ISBN (10 or 13 digits)');
      }

      // Validate copies count
      if (parseInt(formData.totalCopies) < 1) {
        throw new Error('Total copies must be at least 1');
      }

      // Simulate API call - replace with actual backend integration
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Mock success response
      setMessage({ 
        type: 'success', 
        text: `Book "${formData.title}" successfully added to library with ${formData.totalCopies} ${parseInt(formData.totalCopies) === 1 ? 'copy' : 'copies'}!` 
      });
      
      // Reset form
      setFormData({
        // Books table fields
        title: '',
        isbn: '',
        category: '',
        totalCopies: '1',
        
        // Authors table fields
        authorName: '',
        authorBio: '',
        
        // Book-Copies table fields
        purchaseDate: new Date().toISOString().split('T')[0],
        shelfLocation: '',
        
        // Additional fields
        publisher: '',
        publicationYear: '',
        description: '',
        language: 'English',
        edition: '',
        pages: '',
        price: ''
      });

    } catch (error) {
      setMessage({ 
        type: 'error', 
        text: ` ${error.message}` 
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const generateBookId = () => {
    const randomId = 'BOOK' + Math.floor(Math.random() * 10000).toString().padStart(4, '0');
    return randomId;
  };

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

                  {/* Publisher */}
                  <div>
                    <label htmlFor="publisher" className="block text-sm font-medium text-gray-700 mb-2">
                       Publisher
                    </label>
                    <input
                      type="text"
                      id="publisher"
                      name="publisher"
                      value={formData.publisher}
                      onChange={handleInputChange}
                      placeholder="Enter publisher name"
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                    />
                  </div>
                </div>

                {/* Additional Details */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {/* Publication Year */}
                  <div>
                    <label htmlFor="publicationYear" className="block text-sm font-medium text-gray-700 mb-2">
                       Publication Year
                    </label>
                    <input
                      type="number"
                      id="publicationYear"
                      name="publicationYear"
                      value={formData.publicationYear}
                      onChange={handleInputChange}
                      placeholder="2024"
                      min="1800"
                      max={new Date().getFullYear()}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                    />
                  </div>

                  {/* Edition */}
                  <div>
                    <label htmlFor="edition" className="block text-sm font-medium text-gray-700 mb-2">
                       Edition
                    </label>
                    <input
                      type="text"
                      id="edition"
                      name="edition"
                      value={formData.edition}
                      onChange={handleInputChange}
                      placeholder="1st, 2nd, etc."
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                    />
                  </div>

                  {/* Pages */}
                  <div>
                    <label htmlFor="pages" className="block text-sm font-medium text-gray-700 mb-2">
                       Pages
                    </label>
                    <input
                      type="number"
                      id="pages"
                      name="pages"
                      value={formData.pages}
                      onChange={handleInputChange}
                      placeholder="300"
                      min="1"
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {/* Language */}
                  <div>
                    <label htmlFor="language" className="block text-sm font-medium text-gray-700 mb-2">
                       Language
                    </label>
                    <select
                      id="language"
                      name="language"
                      value={formData.language}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                    >
                      {languages.map(lang => (
                        <option key={lang} value={lang}>{lang}</option>
                      ))}
                    </select>
                  </div>

                  {/* Total Copies */}
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

                  {/* Price */}
                  <div>
                    <label htmlFor="price" className="block text-sm font-medium text-gray-700 mb-2">
                      Price (₹)
                    </label>
                    <input
                      type="number"
                      id="price"
                      name="price"
                      value={formData.price}
                      onChange={handleInputChange}
                      placeholder="500"
                      min="0"
                      step="0.01"
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                    />
                  </div>
                </div>

                {/* Database Schema Specific Fields */}
                <div className="border-t pt-6">
                  <h3 className="text-lg font-medium text-gray-900 mb-4">Author & Copy Details</h3>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                    {/* Author Bio */}
                    <div className="md:col-span-2">
                      <label htmlFor="authorBio" className="block text-sm font-medium text-gray-700 mb-2">
                         Author Biography
                      </label>
                      <textarea
                        id="authorBio"
                        name="authorBio"
                        value={formData.authorBio}
                        onChange={handleInputChange}
                        rows={3}
                        placeholder="Brief biography of the author (optional)"
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                      />
                    </div>

                    {/* Purchase Date */}
                    <div>
                      <label htmlFor="purchaseDate" className="block text-sm font-medium text-gray-700 mb-2">
                         Purchase Date <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="date"
                        id="purchaseDate"
                        name="purchaseDate"
                        value={formData.purchaseDate}
                        onChange={handleInputChange}
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
                        placeholder="e.g., A-01-05, Section-A-Shelf-1"
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                        required
                      />
                    </div>
                  </div>
                </div>

                {/* Description */}
                <div>
                  <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-2">
                    Description
                  </label>
                  <textarea
                    id="description"
                    name="description"
                    value={formData.description}
                    onChange={handleInputChange}
                    rows={4}
                    placeholder="Brief description of the book (optional)"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                  />
                </div>

                {/* Submit Button */}
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
                <p className="text-sm text-gray-600 mb-2">Generated Book ID:</p>
                <p className="text-lg font-mono font-bold text-blue-800">{generateBookId()}</p>
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