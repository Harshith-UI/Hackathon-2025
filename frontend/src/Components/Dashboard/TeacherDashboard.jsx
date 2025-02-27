import { useState, useEffect } from "react";
import { LogOut } from "lucide-react";
import useAuthStore from "../../store/authStore";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import interactionPlugin from "@fullcalendar/interaction";
import axiosInstance from "../Axios/AxiosInstance";

const TeacherDashboard = () => {
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

  const handleDateClick = async (selected) => {
    const title = prompt("Enter event details:");
    if (title) {
      const newEvent = { title, date: selected.dateStr };
      setEvents([...events, newEvent]);

      try {
        await axiosInstance.post("/events", newEvent);
      } catch (error) {
        console.error("Error saving event:", error);
      }
    }
  };

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <div className="w-64 bg-white shadow-lg p-5 flex flex-col h-screen fixed left-0 top-0">
        <h2 className="text-2xl font-semibold mb-6">Teacher Dashboard</h2>
        <button
          onClick={logout}
          className="w-full py-2 px-4 text-left rounded-lg text-red-500 hover:text-red-700 flex items-center justify-center"
        >
          <LogOut className="mr-2" /> Logout
        </button>
      </div>

      {/* Main Content */}
      <div className="flex-1 ml-64 p-6 overflow-y-auto h-screen">
        <h1 className="text-3xl font-semibold mb-6">Welcome, Teacher!</h1>
        <FullCalendar
          plugins={[dayGridPlugin, interactionPlugin]}
          initialView="dayGridMonth"
          dateClick={handleDateClick}
          events={events}
          eventContent={(eventInfo) => (
            <div className="bg-blue-500 text-white p-1 rounded-md">
              {eventInfo.event.title}
            </div>
          )}
        />
      </div>
    </div>
  );
};

export default TeacherDashboard;
