import React, { useState, useEffect } from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';

const IssuePage = () => {
  const [formData, setFormData] = useState({
    studentId: '',
    copyId: '',
    issueDate: new Date().toISOString().split('T')[0],
    dueDate: '',
    returned: 'NO'
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });
  const [isExpanded, setIsExpanded] = useState(false);
  const [fines, setFines] = useState([]);

  // Fetch fines report
  useEffect(() => {
    fetch('http://127.0.0.1:8000/fines-report/')
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

  const getDefaultDueDate = () => {
    const date = new Date();
    date.setDate(date.getDate() + 14);
    return date.toISOString().split('T')[0];
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setMessage({ type: '', text: '' });

    try {
      if (!formData.studentId || !formData.copyId || !formData.dueDate) {
        throw new Error('Student ID, Copy ID, and Due Date are required');
      }

      // Replace this mock with actual POST call
      await new Promise(resolve => setTimeout(resolve, 1000));

      setMessage({
        type: 'success',
        text: `Book successfully issued to Student ID: ${formData.studentId}`
      });

      setFormData({
        studentId: '',
        copyId: '',
        issueDate: new Date().toISOString().split('T')[0],
        dueDate: '',
        returned: 'NO'
      });
    } catch (error) {
      setMessage({
        type: 'error',
        text: error.message || 'Failed to issue book. Please try again.'
      });
    } finally {
      setIsSubmitting(false);
    }
  };

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

                {/* Issue Date */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Issue Date
                  </label>
                  <input
                    type="date"
                    name="issueDate"
                    value={formData.issueDate}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg"
                  />
                </div>

                {/* Due Date */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Due Date
                  </label>
                  <input
                    type="date"
                    name="dueDate"
                    value={formData.dueDate || getDefaultDueDate()}
                    onChange={handleInputChange}
                    min={new Date().toISOString().split('T')[0]}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg"
                  />
                  <p className="text-sm text-gray-500 mt-1">Default: 14 days from today</p>
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
          <h2 className="text-2xl font-semibold text-gray-900 mb-6">
            Fines Report
          </h2>

          {fines.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200 text-sm">
                <thead className="bg-gradient-to-r from-blue-50 to-indigo-50">
                  <tr>
                    <th className="px-6 py-3 text-left font-medium text-gray-500 uppercase tracking-wider">
                      Student ID
                    </th>
                    <th className="px-6 py-3 text-left font-medium text-gray-500 uppercase tracking-wider">
                      Name
                    </th>
                    <th className="px-6 py-3 text-left font-medium text-gray-500 uppercase tracking-wider">
                      Total Fines
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {fines.map((row) => (
                    <tr key={row.student_id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 text-gray-800">{row.student_id}</td>
                      <td className="px-6 py-4 text-gray-800">{row.student_name}</td>
                      <td className="px-6 py-4 text-red-600 font-semibold">
                        ₹{row.total_fines}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <p className="text-gray-600">No fines data available.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default IssuePage;
