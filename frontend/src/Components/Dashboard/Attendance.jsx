import { useEffect, useState } from "react";
import axiosInstance from "../Axios/AxiosInstance";
import useAuthStore from "../../store/authStore";
import { motion } from "framer-motion";
import { Calendar, CheckSquare, Square } from "lucide-react";
import { toast } from "react-hot-toast";
import moment from "moment";

const Attendance = () => {
  const { token } = useAuthStore();
  const [students, setStudents] = useState([]);
  const [attendanceDate, setAttendanceDate] = useState(""); // YYYY-MM-DD format
  const [attendance, setAttendance] = useState({});
  const [allPresent, setAllPresent] = useState(false);

  useEffect(() => {
    const fetchStudents = async () => {
      try {
        const response = await axiosInstance.get("/students", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setStudents(response.data);
      } catch (error) {
        console.error("Error fetching students:", error);
      }
    };

    fetchStudents();
  }, [token]);

  const handleAttendanceSubmit = async () => {
    if (!attendanceDate) {
      toast.error("Please select a date.");
      return;
    }

    // Convert the date to DD-MM-YY format for backend
    const formattedDate = moment(attendanceDate, "YYYY-MM-DD").format("DD-MM-YY");
    console.log(formattedDate);

    try {
      const response = await axiosInstance.post(
        "/attendance/mark",
        {
          date: formattedDate, // Send DD-MM-YY format
          records: students.map((student) => ({
            studentId: student._id,
            present: attendance[student._id] || false,
          })),
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      toast.success(response.data.message);
    } catch (error) {
      console.error("Error posting attendance:", error);
      toast.error(error.response?.data?.message || "Failed to submit attendance.");
    }
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: -20 }} 
      animate={{ opacity: 1, y: 0 }}
      className="mt-10 p-6 bg-gradient-to-br from-indigo-500 to-purple-500 rounded-lg shadow-2xl text-white"
    >
      <h2 className="text-2xl font-bold mb-6 text-center">📅 Mark Attendance</h2>
      
      {/* Date Picker */}
      <div className="flex items-center justify-center mb-6">
        <label className="relative flex items-center bg-white text-gray-900 px-4 py-2 rounded-lg shadow-lg cursor-pointer hover:bg-gray-200 transition">
          <Calendar className="mr-3 text-indigo-600" />
          <input
            type="date"
            className="appearance-none bg-transparent text-lg font-semibold cursor-pointer outline-none"
            value={attendanceDate} // ✅ Use YYYY-MM-DD format for input
            onChange={(e) => setAttendanceDate(e.target.value)}
          />
        </label>
      </div>

      {attendanceDate && (
        <div className="bg-white p-6 rounded-lg shadow-lg text-gray-900">
          {/* Select All */}
          <label className="flex items-center mb-4 text-lg font-semibold cursor-pointer hover:text-indigo-500 transition">
            <input
              type="checkbox"
              checked={allPresent}
              onChange={(e) => {
                const isChecked = e.target.checked;
                setAllPresent(isChecked);
                const updatedAttendance = {};
                students.forEach(
                  (student) => (updatedAttendance[student._id] = isChecked)
                );
                setAttendance(updatedAttendance);
              }}
              className="hidden"
            />
            <span className="mr-3">
              {allPresent ? <CheckSquare className="text-green-600" /> : <Square />}
            </span>
            Mark All Present
          </label>

          {/* Attendance Table */}
          <div className="overflow-x-auto">
            <table className="min-w-full bg-gray-100 border border-gray-200 rounded-lg">
              <thead>
                <tr className="bg-indigo-500 text-white">
                  <th className="py-3 px-4 border">Roll No</th>
                  <th className="py-3 px-4 border">Name</th>
                  <th className="py-3 px-4 border">Present</th>
                </tr>
              </thead>
              <tbody>
                {students.map((student) => (
                  <tr
                    key={student._id}
                    className="hover:bg-gray-200 transition duration-200"
                  >
                    <td className="py-3 px-4 border text-center">{student.rollNo}</td>
                    <td className="py-3 px-4 border text-center">{student.name}</td>
                    <td className="py-3 px-4 border text-center">
                      <button
                        onClick={() =>
                          setAttendance({
                            ...attendance,
                            [student._id]: !attendance[student._id],
                          })
                        }
                        className="focus:outline-none"
                      >
                        {attendance[student._id] ? (
                          <CheckSquare className="text-green-600" />
                        ) : (
                          <Square />
                        )}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Submit Button */}
          <button
            className="mt-6 w-full bg-indigo-600 text-white py-3 rounded-lg hover:bg-indigo-700 transition shadow-md"
            onClick={handleAttendanceSubmit}
          >
            ✅ Submit Attendance
          </button>
        </div>
      )}
    </motion.div>
  );
};

export default Attendance;
