import React, { useState } from 'react';

const IssuePage = () => {
  const [formData, setFormData] = useState({
    // Issues table fields (matching your schema)
    studentId: '',        // student-id (FK)
    copyId: '',          // copy-id (FK to book-copies)
    issueDate: new Date().toISOString().split('T')[0],  // issue-date
    dueDate: '',         // due-date
    returned: 'NO'       // returned ENUM ('Yes', 'NO')
  });
  
  const [studentDetails, setStudentDetails] = useState(null);
  const [copyDetails, setCopyDetails] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });

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

    // Simulate API call - replace with actual backend integration
    try {
      await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate delay
      
      // Mock validation according to Issues table
      if (!formData.studentId || !formData.copyId || !formData.dueDate) {
        throw new Error('Student ID, Copy ID, and Due Date are required');
      }

      // Mock student validation from Students table
      const mockStudent = {
        studentId: formData.studentId,
        name: 'John Doe',
        dept: 'Computer Science',
        email: 'john@example.com',
        phone: '+91-9876543210'
      };

      // Mock copy validation from Book-Copies table
      const mockCopy = {
        copyId: formData.copyId,
        bookId: 'BOOK001',
        title: 'Database Systems',
        status: 'Available',
        shelfLocation: 'A-01-05'
      };

      // Mock success response
      setMessage({ 
        type: 'success', 
        text: ` Book successfully issued to Student ID: ${formData.studentId}` 
      });
      
      // Reset form according to Issues table
      setFormData({
        studentId: '',
        copyId: '',
        issueDate: new Date().toISOString().split('T')[0],
        dueDate: '',
        returned: 'NO'
      });
      setStudentDetails(null);
      setCopyDetails(null);

    } catch (error) {
      setMessage({ 
        type: 'error', 
        text: ` ${error.message || 'Failed to issue book. Please try again.'}` 
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  // Generate default due date (14 days from now)
  const getDefaultDueDate = () => {
    const date = new Date();
    date.setDate(date.getDate() + 14);
    return date.toISOString().split('T')[0];
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">📤 Issue Book</h1>
          <p className="text-gray-600">Issue a book copy to a student</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Issue Form */}
          <div className="bg-white rounded-xl shadow-md p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-6">Book Issue Form</h2>

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Student ID */}
              <div>
                <label htmlFor="studentId" className="block text-sm font-medium text-gray-700 mb-2">
                   Student ID <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  id="studentId"
                  name="studentId"
                  value={formData.studentId}
                  onChange={handleInputChange}
                  placeholder="Enter student ID (e.g., STU001)"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                  required
                />
              </div>

              {/* Issue Date */}
              <div>
                <label htmlFor="issueDate" className="block text-sm font-medium text-gray-700 mb-2">
                   Issue Date <span className="text-red-500">*</span>
                </label>
                <input
                  type="date"
                  id="issueDate"
                  name="issueDate"
                  value={formData.issueDate}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                  required
                />
              </div>

              {/* Copy ID */}
              <div>
                <label htmlFor="copyId" className="block text-sm font-medium text-gray-700 mb-2">
                   Copy ID <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  id="copyId"
                  name="copyId"
                  value={formData.copyId}
                  onChange={handleInputChange}
                  placeholder="Enter copy ID (e.g., COPY001)"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                  required
                />
              </div>

              {/* Due Date */}
              <div>
                <label htmlFor="dueDate" className="block text-sm font-medium text-gray-700 mb-2">
                  Due Date <span className="text-red-500">*</span>
                </label>
                <input
                  type="date"
                  id="dueDate"
                  name="dueDate"
                  value={formData.dueDate || getDefaultDueDate()}
                  onChange={handleInputChange}
                  min={new Date().toISOString().split('T')[0]}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                  required
                />
                <p className="text-sm text-gray-500 mt-1">Default: 14 days from today</p>
              </div>

              {/* Returned Status (For database schema compliance) */}
              <div>
                <label htmlFor="returned" className="block text-sm font-medium text-gray-700 mb-2">
                  Return Status
                </label>
                <select
                  id="returned"
                  name="returned"
                  value={formData.returned}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                  disabled // Always NO for new issues
                >
                  <option value="NO">NO (Not Returned)</option>
                  <option value="YES">YES (Returned)</option>
                </select>
                <p className="text-sm text-gray-500 mt-1">New issues are always set to "NO"</p>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isSubmitting}
                className={`w-full py-3 px-6 rounded-lg text-white font-medium transition-all duration-200 ${
                  isSubmitting
                    ? 'bg-gray-400 cursor-not-allowed'
                    : 'bg-gradient-to-r from-blue-500 to-indigo-500 hover:from-blue-600 hover:to-indigo-600 hover:shadow-lg transform hover:-translate-y-0.5'
                }`}
              >
                {isSubmitting ? ' Issuing Book...' : 'Issue Book'}
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

          {/* Information Panel */}
          <div className="space-y-6">
            {/* Issue Guidelines */}
            <div className="bg-white rounded-xl shadow-md p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4"> Issue Guidelines</h3>
              <ul className="space-y-3 text-sm text-gray-600">
                <li className="flex items-start space-x-2">
                  <span className="text-blue-500 mt-1">•</span>
                  <span>Verify student ID before issuing</span>
                </li>
                <li className="flex items-start space-x-2">
                  <span className="text-blue-500 mt-1">•</span>
                  <span>Check book availability status</span>
                </li>
                <li className="flex items-start space-x-2">
                  <span className="text-blue-500 mt-1">•</span>
                  <span>Standard loan period is 14 days</span>
                </li>
                <li className="flex items-start space-x-2">
                  <span className="text-blue-500 mt-1">•</span>
                  <span>Maximum 3 books per student</span>
                </li>
                <li className="flex items-start space-x-2">
                  <span className="text-blue-500 mt-1">•</span>
                  <span>Late returns incur daily fine</span>
                </li>
              </ul>
            </div>

            {/* Quick Actions */}
            <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-6 border border-blue-200">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">⚡ Quick Actions</h3>
              <div className="space-y-3">
                <button className="w-full bg-white hover:bg-gray-50 border border-gray-200 text-gray-700 py-2 px-4 rounded-lg text-sm font-medium transition-colors duration-200">
                   Search Available Books
                </button>
                <button className="w-full bg-white hover:bg-gray-50 border border-gray-200 text-gray-700 py-2 px-4 rounded-lg text-sm font-medium transition-colors duration-200">
                   Verify Student Details
                </button>
                <button className="w-full bg-white hover:bg-gray-50 border border-gray-200 text-gray-700 py-2 px-4 rounded-lg text-sm font-medium transition-colors duration-200">
                   View Issue History
                </button>
              </div>
            </div>

            {/* Backend Integration */}
            <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-6">
              <h3 className="text-lg font-semibold text-yellow-800 mb-2">🔧 Backend Integration</h3>
              <p className="text-yellow-700 text-sm">
                Ready for API endpoint: <code className="bg-yellow-100 px-2 py-1 rounded">POST /api/issue</code>
                <br />
                Calls stored procedure: <code className="bg-yellow-100 px-2 py-1 rounded">IssueBook()</code>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default IssuePage;