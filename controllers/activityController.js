const { User_Activity } = require("../models");
const { Score } = require("../models");

const createActivity = async (req, res) => {
  try {
    const { id_member, title, category, date_start_act, date_stop_act, description, point } = req.body;

    const newActivity = await User_Activity.create({
      id_member,
      title,
      category,
      date_start_act,
      date_stop_act,
      description,
      point,
    });

    res.status(201).json(newActivity);
  } catch (error) {
    console.error("Error creating activity:", error);
    res.status(500).json({ message: "Error creating activity" });
  }
};

const getMemberActivity = async (req, res) => {
  try {
    const { id_member } = req.params;

    const activities = await User_Activity.findAll({
      where: { id_member: id_member },
    });

    res.json(activities);
  } catch (error) {
    console.error("Error retrieving activities:", error);
    res.status(500).json({ message: "Error retrieving activities" });
  }
};

const approveActivity = async (req, res) => {
  try {
    const id = req.params.id_activity;
    const { approval_by } = req.body;

    const activity = await User_Activity.findByPk(id);
    if (!activity) {
      return res.status(404).json({ error: "Activity not found" });
    }

    activity.approval_by = approval_by;
    activity.approval_date = new Date();
    await activity.save();

    const { id_member, point } = activity;

    let score = await Score.findOne({ where: { id_member } });

    if (!score) {
      score = await Score.create({
        id_member,
        score: 0,
      });
    }

    score.score += point;
    await score.save();

    res.status(200).json({ message: "Activity approved successfully" });
  } catch (error) {
    console.error("Error approving activity:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

module.exports = {
  createActivity,
  getMemberActivity,
  approveActivity,
};
