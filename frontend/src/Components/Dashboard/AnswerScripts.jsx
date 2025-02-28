import { useEffect, useState } from "react";
import axiosInstance from "../Axios/AxiosInstance";
import { toast } from "react-hot-toast";
import { motion } from "framer-motion";

const AnswerScripts = () => {
  const [answerScripts, setAnswerScripts] = useState({});
  const [selectedImage, setSelectedImage] = useState(null); // For full-screen preview

  useEffect(() => {
    const fetchAnswerScripts = async () => {
      try {
        const response = await axiosInstance.get("/marks/answer-scripts");
        setAnswerScripts(response.data);
      } catch (error) {
        console.error("Error fetching answer scripts:", error);
        toast.error("Failed to load answer scripts.");
      }
    };

    fetchAnswerScripts();
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      className="p-6 bg-white rounded-lg shadow-lg"
    >
      <h2 className="text-2xl font-bold mb-4 text-center">📄 Answer Scripts</h2>

      {/* Show answer scripts */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
        {Object.keys(answerScripts).length > 0 ? (
          Object.entries(answerScripts).map(([subject, url]) => (
            <div key={subject} className="border p-4 rounded-lg shadow-md text-center">
              <h3 className="text-lg font-semibold mb-2">{subject}</h3>
              <img
                src={url}
                alt={`${subject} Answer Script`}
                className="w-full h-32 object-cover rounded cursor-pointer hover:opacity-80"
                onClick={() => setSelectedImage(url)}
              />
            </div>
          ))
        ) : (
          <p className="col-span-4 text-gray-500 text-center">No answer scripts available.</p>
        )}
      </div>

      {/* Full-Screen Image Preview */}
      {selectedImage && (
        <div
          className="fixed inset-0 bg-black bg-opacity-80 flex justify-center items-center"
          onClick={() => setSelectedImage(null)}
        >
          <img src={selectedImage} alt="Preview" className="max-w-full max-h-full rounded-lg shadow-lg" />
        </div>
      )}
    </motion.div>
  );
};

export default AnswerScripts;
