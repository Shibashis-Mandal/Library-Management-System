import React from 'react';

const ReportsPage = () => {
  // Sample data for reports - will be replaced with API calls
  const reportData = {
    topBorrowedBooks: [
      { title: "Introduction to Database Systems", author: "C.J. Date", timesIssued: 45 },
      { title: "Clean Code", author: "Robert C. Martin", timesIssued: 38 },
      { title: "Data Structures and Algorithms", author: "Thomas H. Cormen", timesIssued: 32 },
      { title: "The Pragmatic Programmer", author: "David Thomas", timesIssued: 28 },
    ],
    activeStudents: [
      { studentId: "STU001", name: "John Doe", booksIssued: 3, totalBorrows: 12 },
      { studentId: "STU002", name: "Jane Smith", booksIssued: 2, totalBorrows: 8 },
      { studentId: "STU003", name: "Mike Johnson", booksIssued: 1, totalBorrows: 15 },
      { studentId: "STU004", name: "Sarah Wilson", booksIssued: 2, totalBorrows: 6 },
    ],
    overdueBooks: [
      { 
        issueId: "ISS001", 
        studentName: "Alex Brown", 
        bookTitle: "Advanced Java Programming", 
        dueDate: "2024-10-20", 
        overdueDays: 11,
        fine: 55
      },
      { 
        issueId: "ISS002", 
        studentName: "Emma Davis", 
        bookTitle: "Web Development Basics", 
        dueDate: "2024-10-25", 
        overdueDays: 6,
        fine: 30
      },
    ],
    stats: {
      totalBooks: 1250,
      availableBooks: 890,
      issuedBooks: 360,
      totalStudents: 245,
      overdueCount: 23,
      totalFines: 1840
    }
  };

  const StatCard = ({ title, value, subtitle, icon, color = "blue" }) => {
    const colorClasses = {
      blue: "from-blue-500 to-indigo-500",
      green: "from-green-500 to-emerald-500",
      yellow: "from-yellow-500 to-orange-500",
      red: "from-red-500 to-pink-500",
      purple: "from-purple-500 to-indigo-500",
      teal: "from-teal-500 to-cyan-500"
    };

    return (
      <div className="bg-white rounded-xl shadow-md overflow-hidden">
        <div className={`bg-gradient-to-r ${colorClasses[color]} p-4`}>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-white text-sm font-medium opacity-90">{title}</p>
              <p className="text-white text-2xl font-bold">{value}</p>
              {subtitle && <p className="text-white text-xs opacity-80">{subtitle}</p>}
            </div>
            <div className="text-white text-3xl opacity-80">
              {icon}
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Reports & Analytics</h1>
          <p className="text-gray-600">Library statistics and performance insights</p>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-6 mb-8">
          <StatCard
            title="Total Books"
            value={reportData.stats.totalBooks.toLocaleString()}
            icon=""
            color="blue"
          />
          <StatCard
            title="Available"
            value={reportData.stats.availableBooks.toLocaleString()}
            icon=""
            color="green"
          />
          <StatCard
            title="Issued"
            value={reportData.stats.issuedBooks.toLocaleString()}
            icon=""
            color="yellow"
          />
          <StatCard
            title="Students"
            value={reportData.stats.totalStudents.toLocaleString()}
            icon=""
            color="purple"
          />
          <StatCard
            title="Overdue"
            value={reportData.stats.overdueCount.toLocaleString()}
            icon=""
            color="red"
          />
          <StatCard
            title="Total Fines"
            value={`₹${reportData.stats.totalFines.toLocaleString()}`}
            icon=""
            color="teal"
          />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Top Borrowed Books */}
          <div className="bg-white rounded-xl shadow-md p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold text-gray-900">Top Borrowed Books</h2>
              <button className="text-blue-600 hover:text-blue-800 text-sm font-medium">
                View All →
              </button>
            </div>
            <div className="space-y-4">
              {reportData.topBorrowedBooks.map((book, index) => (
                <div key={index} className="flex items-center justify-between p-3 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg">
                  <div className="flex-1">
                    <p className="font-medium text-gray-900 text-sm">{book.title}</p>
                    <p className="text-gray-600 text-xs">by {book.author}</p>
                  </div>
                  <div className="text-right">
                    <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-xs font-medium">
                      {book.timesIssued} times
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Most Active Students */}
          <div className="bg-white rounded-xl shadow-md p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold text-gray-900">Most Active Students</h2>
              <button className="text-blue-600 hover:text-blue-800 text-sm font-medium">
                View All →
              </button>
            </div>
            <div className="space-y-4">
              {reportData.activeStudents.map((student, index) => (
                <div key={index} className="flex items-center justify-between p-3 bg-gradient-to-r from-green-50 to-emerald-50 rounded-lg">
                  <div className="flex-1">
                    <p className="font-medium text-gray-900 text-sm">{student.name}</p>
                    <p className="text-gray-600 text-xs">ID: {student.studentId}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-medium text-gray-900">{student.booksIssued} current</p>
                    <p className="text-xs text-gray-600">{student.totalBorrows} total</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Overdue Books */}
        <div className="mt-8 bg-white rounded-xl shadow-md p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold text-gray-900">Overdue Books</h2>
            <button className="text-red-600 hover:text-red-800 text-sm font-medium">
              Send Reminders →
            </button>
          </div>
          
          {reportData.overdueBooks.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Issue Details
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Student
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Book
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Due Date
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Overdue
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Fine
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {reportData.overdueBooks.map((item, index) => (
                    <tr key={index} className="hover:bg-red-50 transition-colors duration-200">
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        {item.issueId}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {item.studentName}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {item.bookTitle}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {item.dueDate}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
                          {item.overdueDays} days
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-red-600">
                        ₹{item.fine}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="text-center py-8">
              <p className="text-gray-500">No overdue books found</p>
            </div>
          )}
        </div>

        {/* Export Options */}
        <div className="mt-8 bg-gradient-to-r from-gray-50 to-gray-100 rounded-xl p-6 border border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Export Reports</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <button className="bg-white hover:bg-gray-50 border border-gray-200 text-gray-700 py-3 px-4 rounded-lg text-sm font-medium transition-colors duration-200 flex items-center justify-center space-x-2">
              <span></span>
              <span>Export CSV</span>
            </button>
            <button className="bg-white hover:bg-gray-50 border border-gray-200 text-gray-700 py-3 px-4 rounded-lg text-sm font-medium transition-colors duration-200 flex items-center justify-center space-x-2">
              <span></span>
              <span>Export PDF</span>
            </button>
            <button className="bg-white hover:bg-gray-50 border border-gray-200 text-gray-700 py-3 px-4 rounded-lg text-sm font-medium transition-colors duration-200 flex items-center justify-center space-x-2">
              <span></span>
              <span>Email Report</span>
            </button>
            <button className="bg-white hover:bg-gray-50 border border-gray-200 text-gray-700 py-3 px-4 rounded-lg text-sm font-medium transition-colors duration-200 flex items-center justify-center space-x-2">
              <span></span>
              <span>Refresh Data</span>
            </button>
          </div>
        </div>

        {/* Backend Integration Note */}
        <div className="mt-8 bg-indigo-50 border border-indigo-200 rounded-xl p-6">
          <h3 className="text-lg font-semibold text-indigo-800 mb-2">Materialized View Integration</h3>
          <p className="text-indigo-700 text-sm">
            This page will connect to materialized views from your PostgreSQL database:
          </p>
          <ul className="text-indigo-700 text-sm mt-2 space-y-1">
            <li>• <code className="bg-indigo-100 px-2 py-1 rounded">top_borrowed_books_view</code></li>
            <li>• <code className="bg-indigo-100 px-2 py-1 rounded">active_students_view</code></li>
            <li>• <code className="bg-indigo-100 px-2 py-1 rounded">overdue_books_view</code></li>
            <li>• <code className="bg-indigo-100 px-2 py-1 rounded">library_statistics_view</code></li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default ReportsPage;