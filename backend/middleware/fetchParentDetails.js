const User = require("../models/User"); // Adjust this based on your user model
const Student = require("../models/Student"); // Adjust based on your student model

const fetchParentDetails = async (req, res, next) => {
  try {
    const { parentId } = req.body;

    // Fetch parent details
    const parent = await User.findById(parentId);
    if (!parent) {
      return res.status(404).json({ message: "Parent not found" });
    }

    // Fetch the child associated with the parent
    const child = await Student.findOne({ parentId: parent._id });

    if (!child) {
      return res.status(404).json({ message: "No child associated with this parent" });
    }

    // Attach parent and child name to request
    req.parentName = parent.name;
    req.childName = child.name;
    
    next();
  } catch (error) {
    console.error("Error fetching parent details:", error);
    res.status(500).json({ message: "Error fetching parent details", error });
  }
};

module.exports = fetchParentDetails;