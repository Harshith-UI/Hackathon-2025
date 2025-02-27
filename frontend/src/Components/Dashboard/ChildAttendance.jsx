import { useEffect, useState } from "react";
import axiosInstance from "../Axios/AxiosInstance";
import { motion } from "framer-motion";
import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from "recharts";
import useAuthStore from "../../store/authStore";
const COLORS = ["#4CAF50", "#F44336"]; // Green for Present, Red for Absent

const Attendance = () => {
   const { token } = useAuthStore();
  const [attendance, setAttendance] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [attendanceSummary, setAttendanceSummary] = useState({ present: 0, absent: 0 });

  useEffect(() => {
    const fetchAttendance = async () => {
      try {
        const response = await axiosInstance.get("/attendance/child",{
      headers: { Authorization: `Bearer ${token}` },
    });
        setAttendance(response.data);

        // Calculate the attendance summary
        const presentCount = response.data.filter((record) => record.present).length;
        const absentCount = response.data.length - presentCount;
        setAttendanceSummary({ present: presentCount, absent: absentCount });

      } catch (err) {
        setError(err.response?.data?.message || "Failed to fetch attendance");
      } finally {
        setLoading(false);
      }
    };

    fetchAttendance();
  }, [token]);

  if (loading) return <p>Loading attendance...</p>;
  if (error) return <p className="text-red-500">{error}</p>;

  const data = [
    { name: "Present", value: attendanceSummary.present },
    { name: "Absent", value: attendanceSummary.absent },
  ];

  return (
    <motion.div 
      initial={{ opacity: 0, y: -20 }} 
      animate={{ opacity: 1, y: 0 }}
      className="p-6 bg-gradient-to-r from-blue-500 to-purple-500 rounded-lg shadow-2xl text-white"
    >
      <h2 className="text-2xl font-bold mb-6 text-center">👨‍🎓 Child Attendance</h2>
      
      {/* Attendance Records Table */}
      <div className="p-6 bg-white shadow-md rounded-lg">
        <h2 className="text-2xl font-semibold text-gray-800 mb-4">Attendance Records</h2>
        <div className="overflow-x-auto">
          <table className="w-full border-collapse border border-gray-300 shadow-lg">
            <thead>
              <tr className="bg-blue-600 text-white text-lg">
                <th className="p-4 border border-gray-300">Date</th>
                <th className="p-4 border border-gray-300">Student Name</th>
                <th className="p-4 border border-gray-300">Roll No</th>
                <th className="p-4 border border-gray-300">Status</th>
              </tr>
            </thead>
            <tbody>
              {attendance.map((record, index) => (
                <tr key={index} className="hover:bg-gray-100 transition-all text-black">
                  <td className="p-4 border border-gray-300">{record.date}</td>
                  <td className="p-4 border border-gray-300">{record.studentId?.name}</td>
                  <td className="p-4 border border-gray-300">{record.studentId?.rollNo}</td>
                  <td
                    className={`p-4 border border-gray-300 font-semibold ${
                      record.present ? "text-green-600" : "text-red-600"
                    }`}
                  >
                    {record.present ? "Present" : "Absent"}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Attendance Pie Chart */}
      <div className="mt-10 p-6 bg-white shadow-md rounded-lg">
        <h2 className="text-2xl font-semibold text-gray-800 mb-4 text-center">Attendance Overview</h2>
        <div className="flex justify-center">
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={data}
                dataKey="value"
                nameKey="name"
                cx="50%"
                cy="50%"
                outerRadius={100}
                fill="#8884d8"
                label
              >
                {data.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index]} />
                ))}
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

    </motion.div>
  );
};

export default Attendance;
