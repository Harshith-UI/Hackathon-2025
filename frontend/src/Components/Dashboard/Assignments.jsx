import { useState, useEffect } from "react";
import axiosInstance from "../Axios/AxiosInstance";
import { UploadCloud, FileText, Calendar } from "lucide-react";
import { motion } from "framer-motion";

const Assignments = () => {
  const [title, setTitle] = useState("");
  const [file, setFile] = useState(null);
  const [dueDate, setDueDate] = useState("");
  const [assignments, setAssignments] = useState([]);

  useEffect(() => {
    fetchAssignments();
  }, []);

  const fetchAssignments = async () => {
    try {
      const response = await axiosInstance.get("/assignments");
      setAssignments(response.data);
    } catch (error) {
      console.error("Error fetching assignments:", error);
    }
  };

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleUpload = async (e) => {
    e.preventDefault();
    if (!file || !title || !dueDate) {
      alert("Please enter a title, due date, and select a file.");
      return;
    }

    const formData = new FormData();
    formData.append("title", title);
    formData.append("file", file);
    formData.append("dueDate", dueDate);

    try {
      await axiosInstance.post("/assignments/upload", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${localStorage.getItem("token")}`, // ✅ Add token
        },
      });
      alert("Assignment uploaded successfully!");
      setTitle("");
      setFile(null);
      setDueDate("");
      fetchAssignments(); // Refresh list
    } catch (error) {
      console.error("Error uploading assignment:", error);
      alert("Failed to upload assignment.");
    }
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: -20 }} 
      animate={{ opacity: 1, y: 0 }}
      className="mt-10 p-6 bg-gradient-to-br from-indigo-500 to-purple-500 rounded-lg shadow-2xl text-white"
    >
      <h2 className="text-2xl font-bold mb-6 text-center flex items-center">
        <FileText className="w-6 h-6 mr-2" />
        Assignments
      </h2>

      {/* Upload Assignment Form */}
      <form onSubmit={handleUpload} className="bg-white p-6 rounded-lg shadow-lg text-gray-900">
        <label className="block text-gray-700 font-medium mb-2">Assignment Title</label>
        <input
          type="text"
          placeholder="Enter assignment title"
          className="w-full p-3 border border-gray-300 rounded-lg mb-4 focus:outline-none focus:ring-2 focus:ring-blue-500"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
        />

        <label className="block text-gray-700 font-medium mb-2">Due Date</label>
        <div className="flex items-center space-x-3 mb-4">
          <Calendar className="text-gray-700 w-6 h-6" />
          <input
            type="date"
            className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={dueDate}
            onChange={(e) => setDueDate(e.target.value)}
            required
          />
        </div>

        <label className="block text-gray-700 font-medium mb-2">Upload File</label>
        <div className="flex items-center space-x-3 mb-4">
          <input
            type="file"
            className="hidden"
            id="fileInput"
            onChange={handleFileChange}
            required
          />
          <label
            htmlFor="fileInput"
            className="cursor-pointer bg-blue-500 text-white px-4 py-2 rounded-lg flex items-center space-x-2 hover:bg-blue-600"
          >
            <UploadCloud className="w-5 h-5" />
            <span>Choose File</span>
          </label>
          {file && <span className="text-gray-700">{file.name}</span>}
        </div>

        <button
          type="submit"
          className="w-full bg-indigo-600 text-white py-3 rounded-lg hover:bg-indigo-700 transition shadow-md"
        >
          Upload Assignment
        </button>
      </form>

      {/* Display Uploaded Assignments */}
      <h3 className="text-lg font-semibold mt-6 mb-3 text-center">📄 Uploaded Assignments</h3>
      <div className="bg-white p-6 rounded-lg shadow-lg text-gray-900">
        <ul className="space-y-3">
          {assignments.length === 0 ? (
            <p className="text-gray-500">No assignments uploaded yet.</p>
          ) : (
            assignments.map((assignment) => (
              <li
                key={assignment._id}
                className="flex flex-col p-3 bg-gray-50 rounded-lg shadow-md border border-gray-200"
              >
                <span className="text-gray-800 font-medium">{assignment.title}</span>
                <span className="text-gray-600 text-sm">Due Date: {new Date(assignment.dueDate).toLocaleDateString()}</span>
                <a
                  href={`http://localhost:5000${assignment.fileUrl}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-500 hover:underline mt-1"
                >
                  View Assignment
                </a>
              </li>
            ))
          )}
        </ul>
      </div>
    </motion.div>
  );
};

export default Assignments;
