import { useState } from "react";
import { Mail, Lock } from "lucide-react";
import { motion } from "framer-motion";
import parentImage from "../../assets/parent2.png";
import teacherImage from "../../assets/teacher4.png";
import { useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";
import axiosInstance from "../Axios/AxiosInstance";
import useAuthStore from "../../store/authStore";

const AuthPage = ({ type, role }) => {
  const navigate = useNavigate();
  // console.log(type);
  // const isSignUp = type === "signup";
  const isParent = role === "parent";
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({ email: "", password: "" });
  const setAuth = useAuthStore((state) => state.setAuth);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleAuth = async () => {
  setLoading(true);
  try {
    const res = await axiosInstance.post(`/auth/login`, {
      ...formData,
      role,
      type,
    });

    // Use the role prop instead of response data
    localStorage.setItem("token", res.data.token);
    localStorage.setItem("role", role);  // Use the role prop
    localStorage.setItem("name", formData.email); // Or use another appropriate value for name

    // Update Zustand store with the role prop
    setAuth(res.data.token, role, formData.email);

    toast.success("Logged in successfully!");

    // Navigate using the role prop
    const dashboardPath = `/${role}/dashboard`;
    navigate(dashboardPath);

  } catch (error) {
    toast.error(error.response?.data?.message || "Something went wrong");
  } finally {
    setLoading(false);
  }
};

  return (
    <div className="h-screen flex bg-gradient-to-r from-blue-500 to-purple-700">
      <motion.div
        className="w-1/2 h-full flex justify-center items-center overflow-hidden"
        initial={{ opacity: 0, x: -50 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.8 }}
      >
        <img
          src={isParent ? parentImage : teacherImage}
          alt={`${role} Auth`}
          className="w-full h-full object-cover"
        />
      </motion.div>

      <div className="w-1/2 flex justify-center items-center">
        <motion.div
          className="w-full max-w-md bg-white bg-opacity-20 backdrop-blur-lg p-10 rounded-xl shadow-2xl border border-white border-opacity-30"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h2 className="text-white text-3xl font-extrabold mb-6 text-center">
            Sign In
          </h2>

          <div className="relative mb-6">
            <Mail className="absolute left-4 top-4 text-gray-300" />
            <input
              type="email"
              name="email"
              placeholder="Email"
              className="w-full pl-12 px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-400 focus:border-blue-400 transition-all duration-200"
              value={formData.email}
              onChange={handleChange}
              required
            />
          </div>

          <div className="relative mb-6">
            <Lock className="absolute left-4 top-4 text-gray-300" />
            <input
              type={showPassword ? "text" : "password"}
              name="password"
              placeholder="Password"
              className="w-full pl-12 px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-400 focus:border-blue-400 transition-all duration-200"
              value={formData.password}
              onChange={handleChange}
              required
            />
            <button
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-4 top-4 text-gray-300"
            >
              👁️
            </button>
          </div>

          <label className="flex items-center mb-6 text-white">
            <input type="checkbox" className="mr-2" /> Remember Me
          </label>

          <button
            onClick={handleAuth}
            className="w-full bg-blue-700 text-white py-3 rounded-lg hover:bg-blue-800 flex items-center justify-center shadow-md transition-all duration-200"
            disabled={loading}
          >
            {loading ? "Loading..." : "Sign In"}
          </button>
        </motion.div>
      </div>
    </div>
  );
};

export default AuthPage;