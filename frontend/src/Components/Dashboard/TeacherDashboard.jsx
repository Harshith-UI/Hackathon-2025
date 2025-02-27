import { useNavigate } from 'react-router-dom';
import useAuthStore from '../../store/authStore';
import { Bell, LogOut, Users, ClipboardList } from 'lucide-react';
import { useState } from 'react';
import ManageStudents from './ManageStudents';
import Attendance from "./Attendance";
import UploadMarks from "./UploadMarks";
import Assignments from "./Assignments"; 


const TeacherDashboard = () => {
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
        <div className="flex-grow">
          <h2 className="text-2xl font-semibold mb-6">Teacher Dashboard</h2>
          <nav>
            <button
              className={`w-full py-2 px-4 mb-2 text-left rounded-lg ${activeSection === 'dashboard' ? 'bg-indigo-500 text-white' : 'hover:bg-gray-200'}`}
              onClick={() => setActiveSection('dashboard')}
            >
              Dashboard
            </button>
            <button
              className={`w-full py-2 px-4 mb-2 text-left rounded-lg ${activeSection === 'manage-students' ? 'bg-indigo-500 text-white' : 'hover:bg-gray-200'}`}
              onClick={() => setActiveSection('manage-students')}
            >
              Manage Students
            </button>
            <button
              className={`w-full py-2 px-4 mb-2 text-left rounded-lg ${
                activeSection === "attendance" ? "bg-indigo-500 text-white" : "hover:bg-gray-200"
              }`}
              onClick={() => setActiveSection("attendance")}
            >
              Attendance
            </button>
             <button
              className={`w-full py-2 px-4 mb-2 text-left rounded-lg ${
                activeSection === "upload-marks" ? "bg-indigo-500 text-white" : "hover:bg-gray-200"
              }`}
              onClick={() => setActiveSection("upload-marks")}
            >
              Upload Marks
            </button>
            <button
              className={`w-full py-2 px-4 mb-2 text-left rounded-lg ${
                activeSection === "assignments" ? "bg-indigo-500 text-white" : "hover:bg-gray-200"
              }`}
              onClick={() => setActiveSection("assignments")}
            >
              Assignments
            </button>
          </nav>
        </div>
        
        {/* Logout button at the bottom */}
        <button
          onClick={handleLogout}
          className="w-full py-2 px-4 mt-auto text-left rounded-lg text-red-500 hover:text-red-700 flex items-center justify-center"
        >
          <LogOut className="mr-2" /> Logout
        </button>
      </div>

      {/* Scrollable Content */}
      <div className="ml-64 flex-1 p-6 overflow-y-auto h-screen">
        {activeSection === 'dashboard' &&  <>
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-3xl font-semibold">Welcome, Teacher!</h1>
            <button className="relative">
              <Bell className="w-6 h-6 text-gray-600 hover:text-indigo-500" />
              <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full px-1">3</span>
            </button>
          </div>
          <div className="grid grid-cols-3 gap-6">
            <div className="bg-white p-4 rounded-lg shadow-md flex items-center">
              <Users className="w-10 h-10 text-indigo-500 mr-4" />
              <div>
                <p className="text-lg font-semibold">Total Students</p>
                <p className="text-2xl">24</p>
              </div>
            </div>
            <div className="bg-white p-4 rounded-lg shadow-md flex items-center">
              <ClipboardList className="w-10 h-10 text-yellow-500 mr-4" />
              <div>
                <p className="text-lg font-semibold">Assignments Due</p>
                <p className="text-2xl">5</p>
              </div>
            </div>
          </div>
        </>}

        {activeSection === "manage-students" && <ManageStudents />}
        {activeSection === "attendance" && <Attendance />}
        {activeSection === "upload-marks" && <UploadMarks />}
        {activeSection === "assignments" && <Assignments />}
      </div>
    </div>
  );
};

export default TeacherDashboard;
