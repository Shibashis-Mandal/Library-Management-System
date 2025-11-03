import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const ProfilePage = ({ userRole }) => {
  const [profileData, setProfileData] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editData, setEditData] = useState({});
  const navigate = useNavigate();

  // Sample profile data - will be replaced with API calls
  const sampleProfiles = {
      Admin: {
      name: 'Dr. Rajesh Kumar',
      email: 'admin@hit.edu.in',
      id: 'ADM001',
      department: 'Library Administration',
      phone: '+91 98765 43210',
      joinDate: '2020-01-15',
      role: 'Head Librarian',
  avatar: '',
      address: 'HIT Campus, Haldia, West Bengal - 721657',
      qualification: 'Ph.D in Library Science',
      experience: '15 Years',
      permissions: ['Add Books', 'Issue Books', 'Generate Reports', 'Manage Users', 'System Administration'],
      stats: {
        booksAdded: 1250,
        booksIssued: 3450,
        reportsGenerated: 89,
        activeUsers: 245
      }
    },
  Student: {
      name: 'Arjun Sharma',
      email: 'arjun.sharma@student.hit.edu.in',
      id: 'STU2024001',
      department: 'Computer Science and Engineering',
      phone: '+91 87654 32109',
      joinDate: '2024-08-01',
      role: 'B.Tech Student',
  avatar: '',
      address: 'Hostel Block-A, Room 205, HIT Campus',
      semester: '5th Semester',
      year: '3rd Year',
      cgpa: '8.75',
      guardian: 'Mr. Vikash Sharma',
      guardianPhone: '+91 98765 12345',
      stats: {
        booksIssued: 12,
        booksReturned: 8,
        currentBooks: 4,
        finesPaid: 25
      }
    }
  };

  useEffect(() => {
    const profile = sampleProfiles[userRole];
    setProfileData(profile);
    setEditData(profile);
  }, [userRole]); // eslint-disable-line react-hooks/exhaustive-deps

  const handleEditToggle = () => {
    if (isEditing) {
      // Save changes logic here
      setProfileData(editData);
    }
    setIsEditing(!isEditing);
  };

  const handleInputChange = (field, value) => {
    setEditData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const getInitials = (name) => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase();
  };

  if (!profileData) return <div>Loading...</div>;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-50">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <button
            onClick={() => navigate(-1)}
            className="mb-4 text-blue-600 hover:text-blue-800 flex items-center space-x-2 transition-colors duration-200"
          >
            <span>←</span>
            <span>Back</span>
          </button>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Profile</h1>
          <p className="text-gray-600">Manage your profile information and settings</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Profile Card */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl shadow-md p-6 text-center">
              {/* Avatar */}
              <div className="w-24 h-24 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-full flex items-center justify-center text-white font-bold text-2xl mx-auto mb-4 shadow-lg">
                {profileData.avatar || getInitials(profileData.name)}
              </div>
              
              <h2 className="text-xl font-bold text-gray-900 mb-1">{profileData.name}</h2>
              <p className="text-gray-600 mb-1">{profileData.role}</p>
              <p className="text-gray-500 text-sm mb-4">{profileData.id}</p>
              
              <div className="border-t pt-4">
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <p className="text-gray-500">Department</p>
                    <p className="font-medium text-gray-900">{profileData.department}</p>
                  </div>
                  <div>
                    <p className="text-gray-500">Joined</p>
                    <p className="font-medium text-gray-900">{new Date(profileData.joinDate).toLocaleDateString()}</p>
                  </div>
                </div>
              </div>

              {/* Edit Button */}
              <button
                onClick={handleEditToggle}
                className={`w-full mt-6 py-2 px-4 rounded-lg font-medium transition-all duration-200 ${
                  isEditing
                    ? 'bg-green-500 hover:bg-green-600 text-white'
                    : 'bg-blue-500 hover:bg-blue-600 text-white'
                }`}
              >
                {isEditing ? 'Save Changes' : 'Edit Profile'}
              </button>
            </div>

            {/* Stats Card */}
            <div className="mt-6 bg-white rounded-xl shadow-md p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Statistics</h3>
              <div className="space-y-3">
                {Object.entries(profileData.stats).map(([key, value]) => (
                  <div key={key} className="flex justify-between items-center">
                    <span className="text-gray-600 capitalize">{key.replace(/([A-Z])/g, ' $1').trim()}:</span>
                    <span className="font-semibold text-gray-900">{value}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Details Section */}
          <div className="lg:col-span-2 space-y-6">
            {/* Personal Information */}
            <div className="bg-white rounded-xl shadow-md p-6">
              <h3 className="text-xl font-semibold text-gray-900 mb-6">Personal Information</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Full Name</label>
                  {isEditing ? (
                    <input
                      type="text"
                      value={editData.name}
                      onChange={(e) => handleInputChange('name', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  ) : (
                    <p className="text-gray-900 font-medium">{profileData.name}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
                  {isEditing ? (
                    <input
                      type="email"
                      value={editData.email}
                      onChange={(e) => handleInputChange('email', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  ) : (
                    <p className="text-gray-900 font-medium">{profileData.email}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Phone</label>
                  {isEditing ? (
                    <input
                      type="tel"
                      value={editData.phone}
                      onChange={(e) => handleInputChange('phone', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  ) : (
                    <p className="text-gray-900 font-medium">{profileData.phone}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Department</label>
                  <p className="text-gray-900 font-medium">{profileData.department}</p>
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">Address</label>
                  {isEditing ? (
                    <textarea
                      value={editData.address}
                      onChange={(e) => handleInputChange('address', e.target.value)}
                      rows={2}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  ) : (
                    <p className="text-gray-900 font-medium">{profileData.address}</p>
                  )}
                </div>
              </div>
            </div>

            {/* Role Specific Information */}
            <div className="bg-white rounded-xl shadow-md p-6">
              <h3 className="text-xl font-semibold text-gray-900 mb-6">
                {userRole === 'Admin' ? 'Administrative Details' : 'Academic Details'}
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {userRole === 'Admin' ? (
                  <>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Qualification</label>
                      <p className="text-gray-900 font-medium">{profileData.qualification}</p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Experience</label>
                      <p className="text-gray-900 font-medium">{profileData.experience}</p>
                    </div>
                    <div className="md:col-span-2">
                      <label className="block text-sm font-medium text-gray-700 mb-2">Permissions</label>
                      <div className="flex flex-wrap gap-2">
                        {profileData.permissions.map((permission, index) => (
                          <span key={index} className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-medium">
                            {permission}
                          </span>
                        ))}
                      </div>
                    </div>
                  </>
                ) : (
                  <>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Current Year</label>
                      <p className="text-gray-900 font-medium">{profileData.year}</p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Semester</label>
                      <p className="text-gray-900 font-medium">{profileData.semester}</p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">CGPA</label>
                      <p className="text-gray-900 font-medium">{profileData.cgpa}/10.0</p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Guardian Name</label>
                      <p className="text-gray-900 font-medium">{profileData.guardian}</p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Guardian Phone</label>
                      <p className="text-gray-900 font-medium">{profileData.guardianPhone}</p>
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Backend Integration Note */}
        <div className="mt-8 bg-purple-50 border border-purple-200 rounded-xl p-6">
          <h3 className="text-lg font-semibold text-purple-800 mb-2">Backend Integration Ready</h3>
          <p className="text-purple-700 text-sm">
            Profile data ready for API integration:
          </p>
          <ul className="text-purple-700 text-sm mt-2 space-y-1">
            <li>• <code className="bg-purple-100 px-2 py-1 rounded">GET /api/profile</code> - Fetch user profile</li>
            <li>• <code className="bg-purple-100 px-2 py-1 rounded">PUT /api/profile</code> - Update profile details</li>
            <li>• <code className="bg-purple-100 px-2 py-1 rounded">GET /api/profile/stats</code> - User statistics</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;