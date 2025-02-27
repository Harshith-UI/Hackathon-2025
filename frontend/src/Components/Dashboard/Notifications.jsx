import React, { useEffect, useState } from "react";
import axios from "../Axios/AxiosInstance"; // ✅ Ensures API calls work

const Notifications = () => {
  const [notifications, setNotifications] = useState([]);

  // ✅ Fetch notifications from backend
  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const response = await axios.get("/notifications"); // ✅ API call
        setNotifications(response.data);
      } catch (error) {
        console.error("Error fetching notifications:", error);
      }
    };

    fetchNotifications();

    // ✅ Poll every 30 seconds for new notifications
    const interval = setInterval(fetchNotifications, 30000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h2 className="text-2xl font-semibold mb-4">Notifications</h2>
      {notifications.length === 0 ? (
        <p className="text-gray-500">No new notifications</p>
      ) : (
        <ul>
          {notifications.map((note, index) => (
            <li key={index} className="mb-4 p-3 bg-gray-100 rounded-lg">
              <p className="text-gray-500 text-sm">
                {new Date(note.date).toLocaleString()}
              </p>
              <p className="font-medium">{note.message}</p>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default Notifications;
