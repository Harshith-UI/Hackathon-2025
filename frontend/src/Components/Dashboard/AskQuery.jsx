import { useState, useEffect } from "react";
import axiosInstance from "../Axios/AxiosInstance";
import { toast } from "react-hot-toast";
import { MessageSquare } from "lucide-react";

const AskQuery = () => {
  const [question, setQuestion] = useState("");
  const [loading, setLoading] = useState(false);
  const [parentId, setParentId] = useState(null);

  useEffect(() => {
    const fetchUserId = async () => {
      try {
        const response = await axiosInstance.get("/auth/get-user-id", {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        });
        setParentId(response.data.userId);
      } catch (error) {
        console.error("Error fetching user ID:", error);
      }
    };

    fetchUserId();
  }, []);

  const submitQuery = async () => {
    if (!question.trim()) {
      toast.error("Please enter a question.");
      return;
    }

    if (!parentId) {
      toast.error("User ID not found.");
      return;
    }

    setLoading(true);
    try {
      const response = await axiosInstance.post("/query/ask", { parentId, question });
      toast.success(response.data.message);
      setQuestion(""); // ✅ Clear input after success
    } catch (error) {
      toast.error(error.response?.data?.message || "Error submitting query.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 bg-white rounded-lg shadow-md mt-6">
      <h2 className="text-2xl font-semibold flex items-center">
        <MessageSquare className="w-6 h-6 mr-2" /> Ask a Query
      </h2>
      <textarea
        className="w-full p-3 border rounded-lg mt-3"
        rows="3"
        placeholder="Type your question here..."
        value={question}
        onChange={(e) => setQuestion(e.target.value)}
      />
      <button
        onClick={submitQuery}
        className="mt-3 w-full bg-indigo-500 text-white py-2 rounded-lg hover:bg-indigo-600 transition"
        disabled={loading}
      >
        {loading ? "Submitting..." : "Ask Question"}
      </button>
    </div>
  );
};

export default AskQuery;