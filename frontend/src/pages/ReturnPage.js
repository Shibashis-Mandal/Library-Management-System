import React, { useState, useEffect } from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';

const ReturnPage = () => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [fines, setFines] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredFines, setFilteredFines] = useState([]);

  const [formData, setFormData] = useState({
    issueId: '',
    returnDate: new Date().toISOString().split('T')[0],
    fineAmount: 0
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });

  useEffect(() => {
    fetch('http://127.0.0.1:8000/return-report/')
      .then(res => res.json())
      .then(data => {
        if (data.status === 'success') {
          setFines(data.data);
          setFilteredFines(data.data);
        }
      })
      .catch(err => console.error('Error fetching fines report:', err));
  }, []);

  const handleSearch = (e) => {
    const term = e.target.value.toLowerCase();
    setSearchTerm(term);
    setFilteredFines(
      fines.filter(
        f =>
          f.student_name.toLowerCase().includes(term) ||
          f.student_id.toString().includes(term)
      )
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-50 py-8 px-6">
      <div className="max-w-5xl mx-auto space-y-10">

        {/* Expandable Return Section */}
        <div className="bg-white rounded-xl shadow-md overflow-hidden">
          <div
            onClick={() => setIsExpanded(!isExpanded)}
            className="flex justify-between items-center p-6 cursor-pointer bg-gradient-to-r from-green-500 to-emerald-500 text-white"
          >
            <h2 className="text-xl font-semibold flex items-center gap-2">Return Book</h2>
            {isExpanded ? <ChevronUp /> : <ChevronDown />}
          </div>

          {isExpanded && (
            <div className="p-6 border-t border-gray-200 animate-fadeIn">
              <form className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Issue ID</label>
                  <input
                    type="text"
                    name="issueId"
                    value={formData.issueId}
                    onChange={(e) =>
                      setFormData({ ...formData, issueId: e.target.value })
                    }
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Return Date</label>
                  <input
                    type="date"
                    name="returnDate"
                    value={formData.returnDate}
                    onChange={(e) =>
                      setFormData({ ...formData, returnDate: e.target.value })
                    }
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg"
                  />
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className={`w-full py-3 rounded-lg text-white font-medium transition-all duration-200 ${
                    isSubmitting
                      ? 'bg-gray-400 cursor-not-allowed'
                      : 'bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 hover:shadow-lg'
                  }`}
                >
                  {isSubmitting ? 'Processing Return...' : 'Process Return'}
                </button>
              </form>
            </div>
          )}
        </div>

        {/* Searchable Fines Report */}
        <div className="bg-white rounded-xl shadow-md p-6">
          <h2 className="text-2xl font-semibold text-gray-900 mb-6">Issued Books</h2>

          <input
            type="text"
            placeholder="Search by Student ID or Name"
            value={searchTerm}
            onChange={handleSearch}
            className="mb-4 w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
          />

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
    </tr>
  ))}
</tbody>

              </table>
            </div>
          ) : (
            <p className="text-gray-600">No fines data found.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default ReturnPage;
