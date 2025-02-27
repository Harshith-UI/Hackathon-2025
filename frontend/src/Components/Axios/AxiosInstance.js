import axios from "axios";

const axiosInstance = axios.create({
  baseURL: "http://localhost:5000/api",
});

axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

export const markAttendance = async (date, records) => {
  try {
    await axiosInstance.post("/attendance/mark", { date, records });
    return { success: true, message: "Attendance marked successfully" };
  } catch (error) {
    return { success: false, message: error.response?.data?.message || "Error marking attendance" };
  }
};

export default axiosInstance;
