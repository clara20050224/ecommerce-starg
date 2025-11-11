import React from 'react';
import { useNavigate } from 'react-router-dom';
import { FaUser, FaEnvelope, FaSignOutAlt } from 'react-icons/fa';
import Heading from '../components/Shared/Heading';

const Profile = ({ user, onLogout }) => {
  const navigate = useNavigate();

  const handleLogout = () => {
    onLogout();
    navigate('/login');
  };

  return (
    <div className="container py-12 min-h-screen">
      <Heading title="Profile" subtitle="Your Account Information" />
      
      <div className="max-w-2xl mx-auto mt-8">
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-8">
          <div className="flex items-center justify-center mb-6">
            <div className="w-24 h-24 bg-primary rounded-full flex items-center justify-center">
              <FaUser className="text-white text-4xl" />
            </div>
          </div>
          
          <div className="space-y-4">
            <div className="flex items-center gap-4 p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
              <FaUser className="text-primary text-xl" />
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400">Username</p>
                <p className="text-lg font-semibold dark:text-white">{user?.username || 'admin'}</p>
              </div>
            </div>
            
            <div className="flex items-center gap-4 p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
              <FaEnvelope className="text-primary text-xl" />
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400">Email</p>
                <p className="text-lg font-semibold dark:text-white">{user?.email || 'admin@example.com'}</p>
              </div>
            </div>
          </div>
          
          <div className="mt-8 pt-6 border-t border-gray-200 dark:border-gray-700">
            <button
              onClick={handleLogout}
              className="w-full flex items-center justify-center gap-2 bg-red-500 hover:bg-red-600 text-white py-3 px-6 rounded-lg font-semibold transition-all duration-300"
            >
              <FaSignOutAlt />
              Logout
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;

