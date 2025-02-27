import { useEffect, useState } from "react";
import axiosInstance from "../Axios/AxiosInstance";
import useAuthStore from "../../store/authStore";
import { motion } from "framer-motion";
import { Eye, XCircle } from "lucide-react";

const ManageStudents = () => {
  const { token } = useAuthStore();
  const [students, setStudents] = useState([]);
  const [selectedStudent, setSelectedStudent] = useState(null);

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

  return (
    <motion.div 
      initial={{ opacity: 0, y: -20 }} 
      animate={{ opacity: 1, y: 0 }}
      className="p-6 bg-gradient-to-r from-blue-500 to-purple-500 rounded-lg shadow-2xl text-white"
    >
      <h2 className="text-2xl font-bold mb-6 text-center">👨‍🎓 Manage Students</h2>

      <div className="overflow-x-auto">
        <table className="min-w-full bg-white border border-gray-200 rounded-lg shadow-md">
          <thead>
            <tr className="bg-indigo-600 text-white">
              <th className="py-3 px-4 border">Roll No</th>
              <th className="py-3 px-4 border">Name</th>
              <th className="py-3 px-4 border">Class</th>
              <th className="py-3 px-4 border">Section</th>
              <th className="py-3 px-4 border">Parent</th>
              <th className="py-3 px-4 border">Actions</th>
            </tr>
          </thead>
          <tbody>
            {students.map((student) => (
              <tr
                key={student._id}
                className="text-black hover:bg-gray-200 transition duration-200 cursor-pointer"
              >
                <td className="py-3 px-4 border text-center">{student.rollNo}</td>
                <td className="py-3 px-4 border text-center">{student.name}</td>
                <td className="py-3 px-4 border text-center">{student.class}</td>
                <td className="py-3 px-4 border text-center">{student.section}</td>
                <td className="py-3 px-4 border text-center">{student.parentName || "N/A"}</td>
                <td className="py-3 px-4 border text-center">
                  <button
                    onClick={() => setSelectedStudent(student)}
                    className="bg-indigo-500 text-white px-3 py-1 rounded-lg hover:bg-indigo-700 transition"
                  >
                    <Eye />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Student Details Modal */}
      {selectedStudent && (
        <motion.div 
          initial={{ opacity: 0, y: -20 }} 
          animate={{ opacity: 1, y: 0 }}
          className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50"
          onClick={() => setSelectedStudent(null)}
        >
          <div className="bg-white p-6 rounded-lg shadow-lg w-96" onClick={(e) => e.stopPropagation()}>
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-bold text-gray-900">Student Details</h2>
              <button onClick={() => setSelectedStudent(null)} className="text-gray-500 hover:text-red-600">
                <XCircle />
              </button>
            </div>
            <img
              src={"/assets/default-avatar.jpg"}
              alt="Student"
              className="w-24 h-24 rounded-full mx-auto my-4"
            />
            <div className="text-gray-700">
              <p><strong>Name:</strong> {selectedStudent.name}</p>
              <p><strong>Roll No:</strong> {selectedStudent.rollNo}</p>
              <p><strong>Class:</strong> {selectedStudent.class}</p>
              <p><strong>Section:</strong> {selectedStudent.section}</p>
              <p><strong>Parent Name:</strong> {selectedStudent.parentName || "N/A"}</p>
              <p><strong>Contact:</strong> {selectedStudent.parentContact || "N/A"}</p>
              <p><strong>Alternate Contact:</strong> {selectedStudent.alternateContact || "N/A"}</p>
              <p><strong>Address:</strong> {selectedStudent.address || "N/A"}</p>
            </div>
            <button
              className="mt-4 w-full bg-red-500 text-white px-4 py-2 rounded hover:bg-red-700 transition"
              onClick={() => setSelectedStudent(null)}
            >
              Close
            </button>
          </div>
        </motion.div>
      )}
    </motion.div>
  );
};

export default ManageStudents;
