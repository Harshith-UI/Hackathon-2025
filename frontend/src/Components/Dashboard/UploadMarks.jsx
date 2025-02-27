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
  const [examType, setExamType] = useState("");
  
  // ✅ State to store marks
  const [marks, setMarks] = useState({
    English: "", Mathematics: "", Science: "", SocialStudies: ""
  });

  // ✅ State to store selected answer script files
  const [answerScripts, setAnswerScripts] = useState({
    English: null, Mathematics: null, Science: null, SocialStudies: null
  });

  // ✅ State to store uploaded answer script URLs
  const [scriptURLs, setScriptURLs] = useState({
    English: "", Mathematics: "", Science: "", SocialStudies: ""
  });

  // ✅ Fetch students when component loads
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

  // ✅ Handle Marks Input Change
  const handleMarksChange = (subject, value) => {
    setMarks({ ...marks, [subject]: value });
  };

  // ✅ Handle Answer Script File Selection
  const handleFileChange = (subject, file) => {
    setAnswerScripts({ ...answerScripts, [subject]: file });
  };

  // ✅ Upload Answer Scripts to S3 & Get URLs
  const uploadToS3 = async (file) => {
    if (!file) return null;
    try {
      const formData = new FormData();
      formData.append("file", file);

      // 🔹 Upload file to S3
      const response = await axiosInstance.post("/upload-s3", formData, {
        headers: { Authorization: `Bearer ${token}`, "Content-Type": "multipart/form-data" },
      });

      return response.data.url; // 🔹 Return uploaded file URL
    } catch (error) {
      console.error("Error uploading file:", error);
      toast.error("Failed to upload file");
      return null;
    }
  };

  // ✅ Handle Marks Submission
  const handleSubmit = async () => {
    if (!selectedStudent || !examType) {
      toast.error("Please select a student and exam type.");
      return;
    }

    try {
      toast.loading("Uploading answer scripts...");

      // 🔹 Upload all answer scripts to S3 & store URLs
      const uploadedURLs = { ...scriptURLs };
      for (const subject of Object.keys(answerScripts)) {
        if (answerScripts[subject]) {
          uploadedURLs[subject] = await uploadToS3(answerScripts[subject]);
        }
      }

      setScriptURLs(uploadedURLs); // 🔹 Update state with uploaded URLs

      toast.dismiss();
      toast.loading("Submitting marks...");

      // 🔹 Send Marks + Answer Script URLs to Backend
      const response = await axiosInstance.post("/marks/add", {
        student: selectedStudent,
        examType,
        subjects: marks,
        answerScripts: uploadedURLs, // 🔹 Include Answer Script URLs
      }, {
        headers: { Authorization: `Bearer ${token}` },
      });

      toast.dismiss();
      toast.success(response.data.message);
      
      // ✅ Reset form after successful submission
      setMarks({ English: "", Mathematics: "", Science: "", SocialStudies: "" });
      setAnswerScripts({ English: null, Mathematics: null, Science: null, SocialStudies: null });
      setScriptURLs({ English: "", Mathematics: "", Science: "", SocialStudies: "" });
      setSelectedStudent("");
      setExamType("");
    } catch (error) {
      toast.dismiss();
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
          <option value="">-- Choose Exam --</option>
          <option value="Midterm">Midterm</option>
          <option value="Final">Final</option>
          <option value="Unit Test">Unit Test</option>
        </select>

        {/* Marks Input & File Upload */}
        <div className="grid grid-cols-2 gap-6">
          {Object.keys(marks).map((subject) => (
            <div key={subject} className="border p-4 rounded-lg shadow-md">
              <label className="block text-gray-700 font-medium mb-1">{subject}</label>
              <input
                type="number"
                value={marks[subject]}
                onChange={(e) => handleMarksChange(subject, e.target.value)}
                className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                min="0"
                max="100"
              />
              <input
                type="file"
                accept="image/*"
                onChange={(e) => handleFileChange(subject, e.target.files[0])}
                className="mt-2 w-full"
              />
              {answerScripts[subject] && (
                <p className="text-sm text-green-600 mt-1">File selected: {answerScripts[subject].name}</p>
              )}
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
