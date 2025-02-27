import { useState, useEffect } from "react";
import axiosInstance from "../Axios/AxiosInstance";
import { Calendar, FileText, Eye } from "lucide-react";
import { motion } from "framer-motion";

const ParentAssignments = () => {
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

  return (
    <motion.div 
      initial={{ opacity: 0, y: -20 }} 
      animate={{ opacity: 1, y: 0 }}
      className="p-6 bg-white rounded-lg shadow-lg"
    >
      <h2 className="text-2xl font-semibold mb-6 text-center flex items-center">
        <FileText className="w-6 h-6 mr-2" />
        Assignments
      </h2>

      {assignments.length === 0 ? (
        <p className="text-gray-500 text-center">No assignments available.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {assignments.map((assignment) => (
            <div key={assignment._id} className="p-4 border rounded-lg shadow-md bg-gray-50">
              <img
                src={assignment.fileUrl}
                alt={assignment.title}
                className="rounded-lg w-full h-48 object-cover shadow-md"
              />
              <div className="mt-3">
                <p className="text-lg font-medium text-gray-900">{assignment.title}</p>
                <p className="text-sm text-gray-600 flex items-center">
                  <Calendar className="w-4 h-4 mr-1" /> Due Date:{" "}
                  {new Date(assignment.dueDate).toLocaleDateString()}
                </p>
                <a
                  href={assignment.fileUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-2 flex items-center text-blue-500 hover:underline"
                  download
                >
                  <Eye className="w-4 h-4 mr-1" /> View
                </a>
              </div>
            </div>
          ))}
        </div>
      )}
    </motion.div>
  );
};

export default ParentAssignments;