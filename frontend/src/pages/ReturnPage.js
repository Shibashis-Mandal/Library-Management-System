import React, { useState } from 'react';

const ReturnPage = () => {
  const [formData, setFormData] = useState({
    // Returns table fields (matching your schema)
    issueId: '',           // issue-id (FK to Issues table)
    returnDate: new Date().toISOString().split('T')[0],  // return-date
    fineAmount: 0          // fine-amount (calculated)
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });
  const [issueDetails, setIssueDetails] = useState(null);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleLookupIssue = async () => {
    if (!formData.issueId) {
      setMessage({ type: 'error', text: ' Please enter an Issue ID' });
      return;
    }

    try {
      // Mock API call to lookup issue details
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // Mock issue data from Issues table
      const mockIssue = {
        // From Issues table
        issueId: formData.issueId,
        studentId: 'STU001',
        copyId: 'COPY001',
        issueDate: '2024-10-15',
        dueDate: '2024-10-29',
        returned: 'NO',
        
        // From Students table (via studentId FK)
        studentName: 'John Doe',
        dept: 'Computer Science',
        email: 'john@example.com',
        phone: '+91-9876543210',
        
        // From Book-Copies table (via copyId FK)
        bookId: 'BOOK001',
        status: 'Issued',
        purchaseDate: '2024-01-15',
        shelfLocation: 'A-01-05',
        
        // From Books table (via bookId FK)
        bookTitle: 'Introduction to Database Systems',
        author: 'C.J. Date',
        category: 'Computer Science',
        
        // Calculated fields for Returns table
        isOverdue: new Date() > new Date('2024-10-29'),
        overdueDays: Math.max(0, Math.ceil((new Date() - new Date('2024-10-29')) / (1000 * 60 * 60 * 24))),
        fineAmount: 0
      };

      // Calculate fine for Returns table fine-amount field
      if (mockIssue.isOverdue) {
        mockIssue.fineAmount = mockIssue.overdueDays * 5; // ₹5 per day fine
      }

      // Update form data with calculated fine amount
      setFormData(prev => ({
        ...prev,
        fineAmount: mockIssue.fineAmount
      }));

      setIssueDetails(mockIssue);
      setMessage({ type: 'success', text: ' Issue details found' });
    } catch (error) {
      setMessage({ type: 'error', text: ' Issue ID not found' });
      setIssueDetails(null);
    }
  };

  const handleReturn = async (e) => {
    e.preventDefault();
    if (!issueDetails) {
      setMessage({ type: 'error', text: ' Please lookup issue details first' });
      return;
    }

    setIsSubmitting(true);
    setMessage({ type: '', text: '' });

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setMessage({ 
        type: 'success', 
        text: ` Book returned successfully! ${issueDetails.fineAmount > 0 ? `Fine: ₹${issueDetails.fineAmount}` : 'No fine applicable.'}` 
      });
      
      // Reset form according to Returns table
      setFormData({
        issueId: '',
        returnDate: new Date().toISOString().split('T')[0],
        fineAmount: 0
      });
      setIssueDetails(null);

    } catch (error) {
      setMessage({ 
        type: 'error', 
        text: ' Failed to return book. Please try again.' 
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2"> Return Book</h1>
          <p className="text-gray-600">Process book returns and calculate fines</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Return Form */}
          <div className="bg-white rounded-xl shadow-md p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-6">Book Return Form</h2>

            {/* Issue ID Lookup */}
            <div className="mb-6">
              <label htmlFor="issueId" className="block text-sm font-medium text-gray-700 mb-2">
                 Issue ID <span className="text-red-500">*</span>
              </label>
              <div className="flex space-x-2">
                <input
                  type="text"
                  id="issueId"
                  name="issueId"
                  value={formData.issueId}
                  onChange={handleInputChange}
                  placeholder="Enter issue ID (e.g., ISS001)"
                  className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                  required
                />
                <button
                  type="button"
                  onClick={handleLookupIssue}
                  className="px-4 py-3 bg-gradient-to-r from-gray-500 to-gray-600 hover:from-gray-600 hover:to-gray-700 text-white rounded-lg font-medium transition-all duration-200"
                >
                  🔍 Lookup
                </button>
              </div>
            </div>

            {/* Issue Details Display */}
            {issueDetails && (
              <div className="mb-6 bg-blue-50 border border-blue-200 rounded-lg p-4">
                <h3 className="font-semibold text-blue-900 mb-3"> Issue Details</h3>
                <div className="grid grid-cols-2 gap-2 text-sm">
                  <div><span className="font-medium">Student:</span> {issueDetails.studentName}</div>
                  <div><span className="font-medium">Student ID:</span> {issueDetails.studentId}</div>
                  <div><span className="font-medium">Book:</span> {issueDetails.bookTitle}</div>
                  <div><span className="font-medium">Book ID:</span> {issueDetails.bookId}</div>
                  <div><span className="font-medium">Issue Date:</span> {issueDetails.issueDate}</div>
                  <div><span className="font-medium">Due Date:</span> {issueDetails.dueDate}</div>
                </div>
                
                {issueDetails.isOverdue && (
                  <div className="mt-3 bg-red-50 border border-red-200 rounded p-3">
                    <p className="text-red-800 font-medium">
                       Overdue by {issueDetails.overdueDays} days
                    </p>
                    <p className="text-red-700">
                      Fine Amount: ₹{issueDetails.fineAmount}
                    </p>
                  </div>
                )}

                {!issueDetails.isOverdue && (
                  <div className="mt-3 bg-green-50 border border-green-200 rounded p-3">
                    <p className="text-green-800 font-medium">
                       Returned on time - No fine applicable
                    </p>
                  </div>
                )}
              </div>
            )}

            {/* Return Form */}
            <form onSubmit={handleReturn} className="space-y-6">
              {/* Return Date */}
              <div>
                <label htmlFor="returnDate" className="block text-sm font-medium text-gray-700 mb-2">
                   Return Date <span className="text-red-500">*</span>
                </label>
                <input
                  type="date"
                  id="returnDate"
                  name="returnDate"
                  value={formData.returnDate}
                  onChange={handleInputChange}
                  max={new Date().toISOString().split('T')[0]}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                  required
                />
              </div>

              {/* Fine Amount (Returns table field) */}
              <div>
                <label htmlFor="fineAmount" className="block text-sm font-medium text-gray-700 mb-2">
                   Fine Amount (₹)
                </label>
                <input
                  type="number"
                  id="fineAmount"
                  name="fineAmount"
                  value={formData.fineAmount}
                  onChange={handleInputChange}
                  min="0"
                  step="0.01"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-gray-50"
                  readonly
                />
                <p className="text-sm text-gray-500 mt-1">Automatically calculated based on overdue days (₹5/day)</p>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isSubmitting || !issueDetails}
                className={`w-full py-3 px-6 rounded-lg text-white font-medium transition-all duration-200 ${
                  isSubmitting || !issueDetails
                    ? 'bg-gray-400 cursor-not-allowed'
                    : 'bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 hover:shadow-lg transform hover:-translate-y-0.5'
                }`}
              >
                {isSubmitting ? ' Processing Return...' : ' Process Return'}
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
            {/* Return Guidelines */}
            <div className="bg-white rounded-xl shadow-md p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">📋 Return Guidelines</h3>
              <ul className="space-y-3 text-sm text-gray-600">
                <li className="flex items-start space-x-2">
                  <span className="text-green-500 mt-1">•</span>
                  <span>Check book condition before accepting</span>
                </li>
                <li className="flex items-start space-x-2">
                  <span className="text-green-500 mt-1">•</span>
                  <span>Verify student identity</span>
                </li>
                <li className="flex items-start space-x-2">
                  <span className="text-green-500 mt-1">•</span>
                  <span>Calculate fine for overdue books</span>
                </li>
                <li className="flex items-start space-x-2">
                  <span className="text-green-500 mt-1">•</span>
                  <span>Fine rate: ₹5 per day</span>
                </li>
                <li className="flex items-start space-x-2">
                  <span className="text-green-500 mt-1">•</span>
                  <span>Update book status to available</span>
                </li>
              </ul>
            </div>

            {/* Fine Calculator */}
            <div className="bg-gradient-to-r from-yellow-50 to-orange-50 rounded-xl p-6 border border-yellow-200">
              <h3 className="text-lg font-semibold text-gray-900 mb-4"> Fine Calculator</h3>
              <div className="text-sm text-gray-700 space-y-2">
                <div className="flex justify-between">
                  <span>Rate per day:</span>
                  <span className="font-medium">₹5</span>
                </div>
                <div className="flex justify-between">
                  <span>Grace period:</span>
                  <span className="font-medium">None</span>
                </div>
                <div className="flex justify-between">
                  <span>Maximum fine:</span>
                  <span className="font-medium">₹500</span>
                </div>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-6 border border-blue-200">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">⚡ Quick Actions</h3>
              <div className="space-y-3">
                <button className="w-full bg-white hover:bg-gray-50 border border-gray-200 text-gray-700 py-2 px-4 rounded-lg text-sm font-medium transition-colors duration-200">
                   View Pending Returns
                </button>
                <button className="w-full bg-white hover:bg-gray-50 border border-gray-200 text-gray-700 py-2 px-4 rounded-lg text-sm font-medium transition-colors duration-200">
                   Check Overdue Books
                </button>
                <button className="w-full bg-white hover:bg-gray-50 border border-gray-200 text-gray-700 py-2 px-4 rounded-lg text-sm font-medium transition-colors duration-200">
                  Generate Return Report
                </button>
              </div>
            </div>

            {/* Backend Integration */}
            <div className="bg-purple-50 border border-purple-200 rounded-xl p-6">
              <h3 className="text-lg font-semibold text-purple-800 mb-2">🔧 Backend Integration</h3>
              <p className="text-purple-700 text-sm">
                Ready for API endpoint: <code className="bg-purple-100 px-2 py-1 rounded">POST /api/return</code>
                <br />
                Updates book status and calculates fines automatically
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReturnPage;