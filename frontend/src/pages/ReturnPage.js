import React, { useState } from 'react';

const ReturnPage = () => {
  const [formData, setFormData] = useState({
    studentId: '',
    copyId: ''
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value
    }));
  };

  const handleReturn = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setMessage({ type: '', text: '' });

    try {
      if (!formData.studentId || !formData.copyId) {
        throw new Error('Student ID and Copy ID are required');
      }

      const response = await fetch(
        `http://localhost:8000/return-book/?student_id=${formData.studentId}&copy_id=${formData.copyId}`,
        {
          method: 'POST'
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || 'Failed to process return');
      }

      const result = await response.json();

      setMessage({
        type: 'success',
        text:
          result.message ||
          `Book copy ${formData.copyId} returned successfully for student ${formData.studentId}.`
      });

      setFormData({
        studentId: '',
        copyId: ''
      });
    } catch (error) {
      setMessage({
        type: 'error',
        text: error.message || 'An error occurred. Please try again.'
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-50">
      <div className="max-w-lg mx-auto px-4 py-10">
        <div className="bg-white rounded-xl shadow-md p-8">
          <h1 className="text-2xl font-bold text-gray-900 mb-6 text-center">
            Return Book
          </h1>

          <form onSubmit={handleReturn} className="space-y-6">
            {/* Student ID */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Student ID <span className="text-red-500">*</span>
              </label>
              <input
                type="number"
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
                type="number"
                name="copyId"
                value={formData.copyId}
                onChange={handleInputChange}
                placeholder="Enter copy ID"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={isSubmitting}
              className={`w-full py-3 rounded-lg text-white font-medium transition-all duration-200 ${
                isSubmitting
                  ? 'bg-gray-400 cursor-not-allowed'
                  : 'bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 hover:shadow-lg'
              }`}
            >
              {isSubmitting ? 'Processing Return...' : 'Return Book'}
            </button>
          </form>

          {/* Message */}
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
      </div>
    </div>
  );
};

export default ReturnPage;
