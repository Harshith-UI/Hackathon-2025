// This page contains two btns, one for parent and one for teacher
// When we click on the btns, we will be redirected to the respective pages to sign in or sign up

import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";

const RoleSelection = () => {
  const navigate = useNavigate();

  return (
    <div className="h-screen flex items-center justify-center bg-gradient-to-r from-purple-500 to-blue-500">
      <motion.div
        className="bg-white p-10 rounded-xl shadow-lg text-center flex flex-col gap-6"
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 1 }}
      >
        <h2 className="text-3xl font-bold text-gray-700">Select Your Role</h2>
        <p className="text-gray-500">Are you a parent or a teacher?</p>

        <div className="flex gap-6">
          {/* Path: frontend/src/pages/ParentSignIn.jsx */}
          <button
            onClick={() => navigate("/parent/signin")}
            className="bg-blue-600 text-white py-3 px-6 rounded-lg text-lg hover:bg-blue-700 transition-all"
          >
            👨‍👩‍👧 Parent
          </button>
          {/* Path: frontend/src/pages/TeacherSignIn.jsx */}
          <button
            onClick={() => navigate("/teacher/signin")}
            className="bg-purple-600 text-white py-3 px-6 rounded-lg text-lg hover:bg-purple-700 transition-all"
          >
            🎓 Teacher
          </button>
        </div>
      </motion.div>
    </div>
  );
};

export default RoleSelection;



