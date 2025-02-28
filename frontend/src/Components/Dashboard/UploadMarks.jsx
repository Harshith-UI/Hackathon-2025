import { useState, useEffect } from "react";
import axiosInstance from "../Axios/AxiosInstance";
import { toast } from "react-hot-toast";
import { motion } from "framer-motion";
import { FilePlus } from "lucide-react";
import useAuthStore from "../../store/authStore";

const UploadMarks = () => {
  const { token } = useAuthStore();
  const [students, setStudents] = useState([]);
  const [selectedStudent, setSelectedStudent] = useState("");
  const [marks, setMarks] = useState({
    Telugu: "", Hindi: "", English: "",
    Mathematics: "", Science: "", Biology: "",
    SocialStudies: ""
  });
  const [examType, setExamType] = useState("");

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

  const handleMarksChange = (subject, value) => {
    setMarks({ ...marks, [subject]: value });
  };

  const handleSubmit = async () => {
    if (!selectedStudent) {
      toast.error("Please select a student.");
      return;
    }

    try {
      const response = await axiosInstance.post("/marks/add", {
        headers: { Authorization: `Bearer ${token}` },
        student: selectedStudent,
        subjects: marks,
        examType,
      });

      toast.success(response.data.message);
      setMarks({ Telugu: "", Hindi: "", English: "",
        Mathematics: "", Science: "", Biology: "",
        SocialStudies: "" });
      setSelectedStudent("");
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to upload marks.");
    }
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: -20 }} 
      animate={{ opacity: 1, y: 0 }}
      className="p-6 bg-gradient-to-br from-blue-500 to-purple-500 rounded-lg shadow-2xl text-white"
    >
      <h2 className="text-2xl font-bold mb-6 text-center flex items-center justify-center">
        <FilePlus className="mr-2 text-white" /> Upload Marks
      </h2>

      {/* Selection Fields */}
      <div className="bg-white p-6 rounded-lg shadow-lg text-gray-900">
        
        {/* Student Selection */}
        <label className="block text-gray-700 font-medium mb-2">Select Student</label>
        <select
          value={selectedStudent}
          onChange={(e) => setSelectedStudent(e.target.value)}
          className="w-full p-3 border border-gray-300 rounded-lg mb-4 focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="">-- Choose Student --</option>
          {students.map((student) => (
            <option key={student._id} value={student._id}>
              {student.name} ({student.rollNo})
            </option>
          ))}
        </select>

        {/* Exam Type Selection */}
        <label className="block text-gray-700 font-medium mb-2">Exam Type</label>
        <select
          value={examType}
          onChange={(e) => setExamType(e.target.value)}
          className="w-full p-3 border border-gray-300 rounded-lg mb-4 focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="Midterm">Midterm</option>
          <option value="Final">Final</option>
          <option value="Unit Test">Unit Test</option>
        </select>

        {/* Marks Input Fields */}
        <div className="grid grid-cols-3 gap-6">
          {Object.keys(marks).map((subject) => (
            <div key={subject}>
              <label className="block text-gray-700 font-medium mb-1">{subject}</label>
              <input
                type="number"
                value={marks[subject]}
                onChange={(e) => handleMarksChange(subject, e.target.value)}
                className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                min="0"
                max="100"
              />
            </div>
          ))}
        </div>

        {/* Submit Button */}
        <button
          onClick={handleSubmit}
          className="mt-6 w-full bg-indigo-600 text-white py-3 rounded-lg hover:bg-indigo-700 transition shadow-md"
        >
          ✅ Submit Marks
        </button>

      </div>
    </motion.div>
  );
};

export default UploadMarks;
