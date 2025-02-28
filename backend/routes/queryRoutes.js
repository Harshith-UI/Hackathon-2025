const express = require("express");
const Query = require("../models/Query");
const fetchParentDetails = require("../middleware/fetchParentDetails"); // ✅ Import middleware
const router = express.Router();

// ✅ Parent Asks a Query (With Middleware)
router.post("/ask", fetchParentDetails, async (req, res) => {
  try {
    const { parentId, question } = req.body;

    // Check if parent has already asked a query this week
    const oneWeekAgo = new Date();
    oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);

    const existingQuery = await Query.findOne({ parentId, createdAt: { $gte: oneWeekAgo } });

    if (existingQuery) {
      return res.status(400).json({ message: "You can only ask one question per week." });
    }

    // Save the new query with parent and child names
    const newQuery = new Query({
      parentId,
      parentName: req.parentName, // ✅ Fetched from middleware
      childName: req.childName, // ✅ Fetched from middleware
      question,
    });

    await newQuery.save();
    res.status(201).json({ message: "Query submitted successfully", query: newQuery });
  } catch (error) {
    console.error("Error submitting query:", error);
    res.status(500).json({ message: "Error submitting query", error });
  }
});




// ✅ Get the Oldest Unsolved Query for the Teacher
router.get("/get-next-query", async (req, res) => {
  try {
    console.log("Fetching next unsolved query...");
    const query = await Query.findOne({ status: "unsolved" }).sort({ createdAt: 1 });

    if (!query) {
      console.log("No unsolved queries found.");
      return res.status(200).json({ message: "No unsolved queries available." });
    }

    console.log("Query found:", query);
    res.json(query);
  } catch (error) {
    console.error("Error fetching query:", error);
    res.status(500).json({ message: "Error fetching query", error });
  }
});

// ✅ Mark Query as Solved
router.post("/solve-query/:queryId", async (req, res) => {
  try {
    const { queryId } = req.params;
    const { answer } = req.body;

    const updatedQuery = await Query.findByIdAndUpdate(
      queryId,
      { answer, status: "solved" },
      { new: true }
    );

    if (!updatedQuery) {
      return res.status(200).json({ message: "Query not found." });
    }

    res.json({ message: "Query solved successfully!", query: updatedQuery });
  } catch (error) {
    console.error("Error solving query:", error);
    res.status(500).json({ message: "Error solving query", error });
  }
});


module.exports = router;
