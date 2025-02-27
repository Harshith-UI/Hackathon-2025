import { useState, useEffect } from "react";
import axiosInstance from "../Axios/AxiosInstance";
import { toast } from "react-hot-toast";
import { MessageCircle } from "lucide-react";

const SolveQuery = () => {
  const [query, setQuery] = useState(null);
  const [answer, setAnswer] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchNextQuery();
  }, []);

  const fetchNextQuery = async () => {
    try {
      const response = await axiosInstance.get("/query/get-next-query");
      setQuery(response.data);
      setAnswer(""); // Reset answer input
    } catch (error) {
      console.error("Error fetching query:", error);
      setQuery(null); // No more queries left
    }
  };

  const solveQuery = async () => {
    if (!answer.trim()) {
      toast.error("Please enter a response.");
      return;
    }

    setLoading(true);
    try {
      await axiosInstance.post(`/query/solve-query/${query._id}`, { answer });
      toast.success("Query solved successfully!");
      fetchNextQuery(); // Fetch next query after solving
    } catch (error) {
      toast.error(error.response?.data?.message || "Error solving query.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 bg-white rounded-lg shadow-md mt-6">
      <h2 className="text-2xl font-semibold flex items-center">
        <MessageCircle className="w-6 h-6 mr-2" /> Solve Parent Query
      </h2>
      {query ? (
        <>
          <p className="mt-4"><strong>Parent:</strong> {query.parentName}</p>
          <p><strong>Child:</strong> {query.childName}</p>
          <p className="mt-2 bg-gray-100 p-3 rounded-lg">{query.question}</p>
          <textarea
            className="w-full p-3 border rounded-lg mt-3"
            rows="3"
            placeholder="Enter your response..."
            value={answer}
            onChange={(e) => setAnswer(e.target.value)}
          />
          <button
            onClick={solveQuery}
            className="mt-3 w-full bg-green-500 text-white py-2 rounded-lg hover:bg-green-600 transition"
            disabled={loading}
          >
            {loading ? "Submitting..." : "Mark as Solved"}
          </button>
        </>
      ) : (
        <p className="text-gray-500 text-center mt-4">No pending queries.</p>
      )}
    </div>
  );
};

export default SolveQuery;