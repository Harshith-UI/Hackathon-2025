import { useEffect, useState } from "react";
import axiosInstance from "../Axios/AxiosInstance";
import { toast } from "react-hot-toast";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Legend } from "recharts";
import { FileSearch, BrainCircuit } from "lucide-react";
import useAuthStore from "../../store/authStore";
import axios from "axios";

const ChildProgress = () => {
  const { token } = useAuthStore();
  const [examType, setExamType] = useState("");
  const [progressReport, setProgressReport] = useState(null);
  const [loading, setLoading] = useState(false);
  const [analysis, setAnalysis] = useState("");

  useEffect(() => {
    if (!examType) return; // Prevent API call when examType is not selected

    const fetchProgressReport = async () => {
      setLoading(true);
      try {
        const response = await axiosInstance.get(`/marks/exam/${examType}`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (!response.data || response.data.length === 0) {
          setProgressReport(null);
          setLoading(false);
          return;
        }
        setProgressReport(response.data);
      } catch (error) {
        toast.error("Failed to fetch progress report.");
        console.error("🚨 Error fetching progress report:", error);
      }
      setLoading(false);
      setAnalysis("");
    };

    fetchProgressReport();
  }, [examType, token]); // ✅ useEffect triggers API call when `examType` changes

  // 🔹 Function to generate AI-based insights
  const generateAnalysis = async () => {
    if (!progressReport) {
      toast.error("No progress data available.");
      return;
    }

    toast.loading("Generating insights...");

    try {
      const response = await axiosInstance.post("/gemini/analyze", {
        prompt: `Analyze this student's progress report:\n${JSON.stringify(progressReport)}`,
      });

      const rawText = response.data?.candidates?.[0]?.content?.parts?.[0]?.text || "No response from AI.";
      const formattedText = rawText
        .replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>") // Bold text
        .replace(/\*(.*?)\*/g, "<em>$1</em>") // Italic text
        .replace(/\n/g, "<br />"); // Preserve line breaks

      setAnalysis(formattedText);
      toast.dismiss();
      toast.success("Insights generated successfully!");
    } catch (error) {
      toast.dismiss();
      toast.error("Failed to generate insights.");
      console.error("🚨 Error generating insights:", error);
    }
  };

  return (
    <div className="p-6 bg-white shadow-md rounded-lg">
      <h2 className="text-2xl font-semibold text-gray-800 mb-4 flex items-center">
        <FileSearch className="mr-2 text-blue-500" /> {`Child's Progress Report`}
      </h2>

      {/* Exam Type Selection */}
      <label className="block text-gray-700 font-medium mb-2">Select Exam Type</label>
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

      {/* Loading State */}
      {loading && <p className="text-center mt-4">Loading...</p>}

      {/* Display Progress Report */}
      {progressReport ? (
        <div className="mt-6 p-6 bg-gray-50 rounded-lg shadow-lg">
          <h3 className="text-xl font-bold text-gray-800 mb-4">📊 Performance Report</h3>
          <p className="text-gray-600"><strong>Student:</strong> {progressReport.student.name}</p>
          <p className="text-gray-600"><strong>Roll No:</strong> {progressReport.student.rollNo}</p>
          <p className="text-gray-600"><strong>Percentage:</strong> {progressReport.percentage.toFixed(2)}%</p>
          <p className="text-gray-600"><strong>Grade:</strong> {progressReport.grade}</p>

          {/* Bar Chart for Subject-Wise Marks */}
          <div className="mt-6">
            <h3 className="text-lg font-semibold text-gray-700 mb-2">Subject-wise Marks</h3>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={Object.entries(progressReport.subjects).map(([subject, marks]) => ({ subject, marks }))}>
                <XAxis dataKey="subject" />
                <YAxis domain={[0, 100]} />
                <Tooltip />
                <Legend />
                <Bar dataKey="marks" fill="#3b82f6" />
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* AI Insights Button */}
          <button
            onClick={generateAnalysis}
            className="mt-6 w-full bg-green-500 text-white py-3 rounded-lg hover:bg-green-700 transition shadow-md flex items-center justify-center"
          >
            <BrainCircuit className="mr-2" /> Get Insights
          </button>

          {/* Display AI Insights */}
          {analysis && (
            <div className="mt-6 p-4 bg-white shadow-md rounded-lg border border-gray-300">
              <h3 className="text-lg font-semibold text-gray-800 mb-2">🔍 Insights</h3>
              <p className="text-gray-600 whitespace-pre-line" dangerouslySetInnerHTML={{ __html: analysis }}></p>
            </div>
          )}

        </div>
      ) : (
        examType && !loading && <p className="text-center text-red-500 mt-4">No records found for {examType}.</p>
      )}
    </div>
  );
};

export default ChildProgress;
