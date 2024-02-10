const { Score } = require("../models");

const getAllScores = async (req, res) => {
  try {
    const scores = await Score.findAll();
    res.status(200).json(scores);
  } catch (error) {
    console.error("Error getting all scores:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

module.exports = { getAllScores };
