import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const HomePage = ({ userRole, setUserRole }) => {
  const [selectedRole, setSelectedRole] = useState(userRole || '');
  const navigate = useNavigate();

  const handleRoleChange = (role) => {
    setSelectedRole(role);
  };

  const handleGoToBooks = () => {
    if (selectedRole) {
      setUserRole(selectedRole);
      navigate('/books');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-100 via-white to-blue-200 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-lg p-6 w-full max-w-md mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">
            HIT Library Management System
          </h1>
          <p className="text-gray-600">
            Select your role to continue
          </p>
        </div>

        {/* Role Selection */}
        <div className="space-y-4 mb-8">
          <div className="flex items-center space-x-3">
            <input
              type="radio"
              id="admin"
              name="role"
              value="Admin"
              checked={selectedRole === 'Admin'}
              onChange={() => handleRoleChange('Admin')}
              className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500 focus:ring-2"
            />
            <label htmlFor="admin" className="text-gray-700 font-medium cursor-pointer">
              Admin
            </label>
          </div>
          
          <div className="flex items-center space-x-3">
            <input
              type="radio"
              id="student"
              name="role"
              value="Student"
              checked={selectedRole === 'Student'}
              onChange={() => handleRoleChange('Student')}
              className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500 focus:ring-2"
            />
            <label htmlFor="student" className="text-gray-700 font-medium cursor-pointer">
              Student
            </label>
          </div>
        </div>

        {/* Go to Books Button */}
        <button
          onClick={handleGoToBooks}
          disabled={!selectedRole}
          className={`w-full py-3 px-6 rounded-xl text-white font-medium transition-all duration-200 ${
            selectedRole
              ? 'bg-gradient-to-r from-blue-500 to-indigo-500 hover:opacity-90 hover:shadow-lg transform hover:-translate-y-0.5'
              : 'bg-gray-300 cursor-not-allowed'
          }`}
        >
          Go to Library
        </button>

        {/* Helper text */}
        {!selectedRole && (
          <p className="text-sm text-gray-500 text-center mt-4">
            Please select a role to continue
          </p>
        )}
      </div>
    </div>
  );
};

export default HomePage;