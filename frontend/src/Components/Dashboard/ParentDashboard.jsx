import ParentAssignments from './ParentAssignments';
import { useNavigate } from 'react-router-dom';
import useAuthStore from '../../store/authStore';
import { Bell, LogOut } from 'lucide-react';
import { useState, useEffect } from 'react';
import Notifications from './Notifications';
import axiosInstance from '../Axios/AxiosInstance';

const ParentDashboard = () => {
  const navigate = useNavigate();
  const { logout } = useAuthStore();
  const [activeSection, setActiveSection] = useState('dashboard');
  const [notificationCount, setNotificationCount] = useState(0);
  const [childDetails, setChildDetails] = useState(null); // ✅ Store child details

  // Fetch notifications count
  useEffect(() => {
    const fetchNotificationCount = async () => {
      try {
        const response = await axiosInstance.get("/notifications");
        setNotificationCount(response.data.length);
      } catch (error) {
        console.error("Error fetching notifications:", error);
      }
    };

    fetchNotificationCount();
  }, []);

  // ✅ Fetch Child Details from Backend
  useEffect(() => {
    const fetchChildDetails = async () => {
      try {
        const response = await axiosInstance.get("/api/students/child");
        setChildDetails(response.data);
      } catch (error) {
        console.error("Error fetching child details:", error);
      }
    };

    fetchChildDetails();
  }, []);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <div className="w-64 bg-white shadow-lg p-5 flex flex-col h-screen fixed left-0 top-0">
        <div className="flex-1">
          <h2 className="text-2xl font-semibold mb-6">Parent Dashboard</h2>
          <nav>
            <button
              className={`w-full py-2 px-4 mb-2 text-left rounded-lg ${activeSection === 'dashboard' ? 'bg-indigo-500 text-white' : 'hover:bg-gray-200'}`}
              onClick={() => setActiveSection('dashboard')}
            >
              Dashboard
            </button>
            <button
              className={`w-full py-2 px-4 mb-2 text-left rounded-lg ${activeSection === 'assignments' ? 'bg-indigo-500 text-white' : 'hover:bg-gray-200'}`}
              onClick={() => setActiveSection("assignments")}
            >
              Assignments
            </button>
            <button
              className={`w-full py-2 px-4 mb-2 text-left rounded-lg ${activeSection === 'notifications' ? 'bg-indigo-500 text-white' : 'hover:bg-gray-200'}`}
              onClick={() => setActiveSection('notifications')}
            >
              Notifications
            </button>
          </nav>
        </div>
        <button
          onClick={handleLogout}
          className="w-full py-2 px-4 text-left rounded-lg text-red-500 hover:text-red-700 flex items-center justify-center"
        >
          <LogOut className="mr-2" /> Logout
        </button>
      </div>

      {/* Main Content */}
      <div className="flex-1 ml-64 p-6 overflow-y-auto h-screen">
        {activeSection === 'dashboard' && (
          <>
            <div className="flex justify-between items-center mb-6">
              <h1 className="text-3xl font-semibold">Welcome, Parent!</h1>
              <button
                className="relative"
                onClick={() => setActiveSection("notifications")} // ✅ Navigate to Notifications
              >
                <Bell className="w-6 h-6 text-gray-600 hover:text-indigo-500" />
                {notificationCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full px-1">
                    {notificationCount}
                  </span>
                )}
              </button>
            </div>

            {/* ✅ Display Child Details */}
            <div className="grid grid-cols-1 gap-6">
              {childDetails ? (
                <div className="bg-white p-4 rounded-lg shadow-md">
                  <h2 className="text-xl font-semibold">Child Details</h2>
                  <p><strong>Name:</strong> {childDetails.name}</p>
                  <p><strong>Age:</strong> {childDetails.age}</p>
                  <p><strong>Grade:</strong> {childDetails.grade}</p>
                  <p><strong>School:</strong> {childDetails.school}</p>
                </div>
              ) : (
                <p>Loading child details...</p>
              )}
            </div>
          </>
        )}
        {activeSection === "assignments" && <ParentAssignments />}
        {activeSection === 'notifications' && <Notifications />}
      </div>
    </div>
  );
};

export default ParentDashboard;
