import { useNavigate } from 'react-router-dom';
import useAuthStore from '../../store/authStore';
import { Bell, LogOut, Calendar, LineChart } from 'lucide-react';
import { useState } from 'react';
import ChildAttendance from './ChildAttendance';
import ChildProgress from './ChildProgress';
import ParentCommunication from './ParentCommunication';
import Notifications from './Notifications';

const ParentDashboard = () => {
  const navigate = useNavigate();
  const { logout } = useAuthStore();
  const [activeSection, setActiveSection] = useState('dashboard');

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Fixed Sidebar */}
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
              className={`w-full py-2 px-4 mb-2 text-left rounded-lg ${activeSection === 'attendance' ? 'bg-indigo-500 text-white' : 'hover:bg-gray-200'}`}
              onClick={() => setActiveSection('attendance')}
            >
              Attendance
            </button>
            <button
              className={`w-full py-2 px-4 mb-2 text-left rounded-lg ${activeSection === 'progress' ? 'bg-indigo-500 text-white' : 'hover:bg-gray-200'}`}
              onClick={() => setActiveSection('progress')}
            >
              Progress Reports
            </button>
            <button
              className={`w-full py-2 px-4 mb-2 text-left rounded-lg ${activeSection === 'communication' ? 'bg-indigo-500 text-white' : 'hover:bg-gray-200'}`}
              onClick={() => setActiveSection('communication')}
            >
              Communication
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

      {/* Scrollable Content */}
      <div className="flex-1 ml-64 p-6 overflow-y-auto h-screen">
        {activeSection === 'dashboard' && (
          <>
            <div className="flex justify-between items-center mb-6">
              <h1 className="text-3xl font-semibold">Welcome, Parent!</h1>
              <button className="relative">
                <Bell className="w-6 h-6 text-gray-600 hover:text-indigo-500" />
                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full px-1">2</span>
              </button>
            </div>
            <div className="grid grid-cols-3 gap-6">
              <div className="bg-white p-4 rounded-lg shadow-md flex items-center">
                <Calendar className="w-10 h-10 text-indigo-500 mr-4" />
                <div>
                  <p className="text-lg font-semibold">Attendance</p>
                  <p className="text-2xl">95%</p>
                </div>
              </div>
              <div className="bg-white p-4 rounded-lg shadow-md flex items-center">
                <LineChart className="w-10 h-10 text-green-500 mr-4" />
                <div>
                  <p className="text-lg font-semibold">Progress</p>
                  <p className="text-2xl">A-</p>
                </div>
              </div>
            </div>
          </>
        )}
        {activeSection === 'attendance' && <ChildAttendance />}
        {activeSection === 'progress' && <ChildProgress />}
        {activeSection === 'communication' && <ParentCommunication />}
        {activeSection === 'notifications' && <Notifications />}
      </div>
    </div>
  );
};

export default ParentDashboard;
