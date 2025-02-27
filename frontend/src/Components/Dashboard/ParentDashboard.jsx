import { useState, useEffect } from "react";
import { LogOut } from "lucide-react";
import useAuthStore from "../../store/authStore";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import axiosInstance from "../Axios/AxiosInstance";

const ParentDashboard = () => {
  const { logout } = useAuthStore();
  const [events, setEvents] = useState([]);

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const response = await axiosInstance.get("/events");
        setEvents(response.data);
      } catch (error) {
        console.error("Error fetching events:", error);
      }
    };

    fetchEvents();
  }, []);

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <div className="w-64 bg-white shadow-lg p-5 flex flex-col h-screen fixed left-0 top-0">
        <h2 className="text-2xl font-semibold mb-6">Parent Dashboard</h2>
        <button
          onClick={logout}
          className="w-full py-2 px-4 text-left rounded-lg text-red-500 hover:text-red-700 flex items-center justify-center"
        >
          <LogOut className="mr-2" /> Logout
        </button>
      </div>

      {/* Main Content */}
      <div className="flex-1 ml-64 p-6 overflow-y-auto h-screen">
        <h1 className="text-3xl font-semibold mb-6">Welcome, Parent!</h1>
        <FullCalendar
          plugins={[dayGridPlugin]}
          initialView="dayGridMonth"
          events={events}
          eventContent={(eventInfo) => (
            <div className="relative group">
              <div className="bg-blue-500 text-white p-1 rounded-md">
                {eventInfo.event.title}
              </div>
              <div className="absolute top-6 left-0 bg-gray-700 text-white p-2 rounded-md text-sm hidden group-hover:block">
                {eventInfo.event.title}
              </div>
            </div>
          )}
        />
      </div>
    </div>
  );
};

export default ParentDashboard;
