import React, { useEffect, useState } from "react";
import axiosInstance from "../Axios/AxiosInstance"; // ✅ Using Axios instance for API calls

const Notifications = () => {
  const [notifications, setNotifications] = useState([]);

  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const response = await axiosInstance.get("/notifications");
        setNotifications(response.data);
      } catch (error) {
        console.error("Error fetching notifications:", error);
      }
    };

    fetchNotifications();
  }, []);

  // ✅ Function to Clear All Notifications (Deletes from Database)
  const handleClearAll = async () => {
    try {
      await axiosInstance.delete("/notifications/clear");
      setNotifications([]); // ✅ Clear UI immediately
    } catch (error) {
      console.error("Error clearing notifications:", error);
    }
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-semibold">Notifications</h2>
        {notifications.length > 0 && (
          <button
            onClick={handleClearAll}
            className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600"
          >
            Clear All
          </button>
        )}
      </div>
      {notifications.length === 0 ? (
        <p>No new notifications</p>
      ) : (
        <ul>
          {notifications.map((note) => (
            <li key={note._id} className={`mb-4 p-3 rounded-lg ${!note.isRead ? 'bg-blue-100' : 'bg-gray-100'}`}>
              {/* ✅ Fix: Hide date if it's invalid */}
              {note.createdAt ? (
                <p className="text-gray-500 text-sm">{new Date(note.createdAt).toLocaleDateString()}</p>
              ) : null}
              <p className="font-medium">{note.message}</p>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default Notifications;
