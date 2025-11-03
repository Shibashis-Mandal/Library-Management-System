import React, { useState, useEffect } from 'react';
import { ChevronDown, ChevronUp, Search } from 'lucide-react';

const IssuePage = () => {
  const [formData, setFormData] = useState({
    studentId: '',
    copyId: '',
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });
  const [isExpanded, setIsExpanded] = useState(false);
  const [fines, setFines] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');

  // Fetch fines report
  useEffect(() => {
    fetch('http://127.0.0.1:8000/issue-report/')
      .then(res => res.json())
      .then(data => {
        if (data.status === 'success') {
          setFines(data.data);
        }
      })
      .catch(err => console.error('Error fetching fines report:', err));
  }, []);

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
    if (!formData.studentId || !formData.copyId) {
      throw new Error('Student ID and Copy ID are required');
    }

    const response = await fetch(`http://localhost:8000/add_issue/?student_id=${formData.studentId}&copy_id=${formData.copyId}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.detail || 'Failed to issue book');
    }

    const data = await response.json();

    setMessage({
      type: 'success',
      text: `Book successfully issued to Student ID: ${formData.studentId}`,
    });

    // Reset the form
    setFormData({
      studentId: '',
      copyId: '',
    });
  } catch (error) {
    setMessage({
      type: 'error',
      text: error.message || 'Failed to issue book. Please try again.',
    });
  } finally {
    setIsSubmitting(false);
  }
};


  // Filter fines based on search term
  const filteredFines = fines.filter((row) => {
    const query = searchTerm.toLowerCase();
    return (
      row.student_name?.toLowerCase().includes(query) ||
      // row.student_id?.toString().includes(query) ||
      row.issue_id?.toString().includes(query) 
      // row.copy_id?.toString().includes(query)
    );
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-50 py-8 px-6">
      <div className="max-w-5xl mx-auto space-y-10">
        {/* Expandable Section: Issue New Book */}
        <div className="bg-white rounded-xl shadow-md overflow-hidden">
          <div
            onClick={() => setIsExpanded(!isExpanded)}
            className="flex justify-between items-center p-6 cursor-pointer bg-gradient-to-r from-blue-500 to-indigo-500 text-white"
          >
            <h2 className="text-xl font-semibold flex items-center gap-2">
              Issue New Book
            </h2>
            {isExpanded ? <ChevronUp /> : <ChevronDown />}
          </div>

          {isExpanded && (
            <div className="p-6 border-t border-gray-200 animate-fadeIn">
              {/* Book Issue Form */}
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Student ID */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Student ID <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="studentId"
                    value={formData.studentId}
                    onChange={handleInputChange}
                    placeholder="Enter student ID"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>

                {/* Copy ID */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Copy ID <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="copyId"
                    value={formData.copyId}
                    onChange={handleInputChange}
                    placeholder="Enter copy ID"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className={`w-full py-3 rounded-lg text-white font-medium transition-all duration-200 ${
                    isSubmitting
                      ? 'bg-gray-400 cursor-not-allowed'
                      : 'bg-gradient-to-r from-blue-500 to-indigo-500 hover:from-blue-600 hover:to-indigo-600 hover:shadow-lg'
                  }`}
                >
                  {isSubmitting ? 'Issuing Book...' : 'Issue Book'}
                </button>
              </form>

              {/* Message Display */}
              {message.text && (
                <div
                  className={`mt-6 p-4 rounded-lg ${
                    message.type === 'success'
                      ? 'bg-green-50 border border-green-200 text-green-800'
                      : 'bg-red-50 border border-red-200 text-red-800'
                  }`}
                >
                  {message.text}
                </div>
              )}
            </div>
          )}
        </div>

        {/* Fines Report Section */}
        <div className="bg-white rounded-xl shadow-md p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-semibold text-gray-900">Books Issued</h2>

            {/* Search Bar */}
            <div className="relative">
              <input
                type="text"
                placeholder="Search by name, issue ID"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              />
              <Search className="absolute left-3 top-2.5 text-gray-400 w-5 h-5" />
            </div>
          </div>

          {filteredFines.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200 text-sm">
                <thead className="bg-gray-100">
                  <tr>
                    <th className="px-6 py-3 text-left text-gray-700 font-semibold">Student ID</th>
                    <th className="px-6 py-3 text-left text-gray-700 font-semibold">Student Name</th>
                    <th className="px-6 py-3 text-left text-gray-700 font-semibold">Issue ID</th>
                    <th className="px-6 py-3 text-left text-gray-700 font-semibold">Copy ID</th>
                    <th className="px-6 py-3 text-left text-gray-700 font-semibold">Total Fines</th>
                    <th className="px-6 py-3 text-left text-gray-700 font-semibold">Returned</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredFines.map((row) => (
                    <tr key={`${row.student_id}-${row.issue_id}-${row.copy_id}`} className="hover:bg-gray-50">
                      <td className="px-6 py-4 text-gray-800">{row.student_id}</td>
                      <td className="px-6 py-4 text-gray-800">{row.student_name}</td>
                      <td className="px-6 py-4 text-gray-800">{row.issue_id}</td>
                      <td className="px-6 py-4 text-gray-800">{row.copy_id}</td>
                      <td className="px-6 py-4 text-red-600 font-semibold">₹{row.total_fines}</td>
                      <td className="px-6 py-4 text-gray-600 font-semibold">{row.returned}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <p className="text-gray-600">No matching fines found.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default IssuePage;
