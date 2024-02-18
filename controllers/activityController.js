const { User_Activity, Team_Member, Score, Reward } = require("../models");
const db = require('../models'); // Assuming your Sequelize instance is exported from this file

const getMemberActivityStats = async (req, res) => {
  try {
    const { id_member, start_date, end_date} = req.params;

    const activities = await User_Activity.findAll({
      where: {
        id_member: id_member,
        date_start_act: { [db.Sequelize.Op.gte]: start_date },
        date_stop_act: { [db.Sequelize.Op.lte]: end_date }
      },
    });

    // Query for activities with approval_by true
    const approvedActivities = await User_Activity.findAll({
      where: {
        id_member: id_member,
        date_start_act: { [db.Sequelize.Op.gte]: start_date },
        date_stop_act: { [db.Sequelize.Op.lte]: end_date },
        approval_by: { [db.Sequelize.Op.not]: null },
      },
    });

    const score = await Score.findAll({
      attributes: ['score'],
      where: {
        id_member: id_member,
      }
    })

    // Total count of activities
    const completedActivitiesCount = approvedActivities.length;
    const totalActivitiesCount = activities.length;

    // Total points of all activities
    const totalPoints = activities.reduce((acc, activity) => acc + activity.point, 0);
    
    // Count of different categories with approval_by
    const categoryCounts = await User_Activity.findAll({
      attributes: [
        "category",
        [db.Sequelize.fn("COUNT", "category"), "categoryCount"],
      ],
      where: {
        id_member: id_member,
        date_start_act: { [db.Sequelize.Op.gte]: start_date },
        date_stop_act: { [db.Sequelize.Op.lte]: end_date },
        approval_by: { [db.Sequelize.Op.not]: null },
      },
      group: ["category"],
      order: [[db.Sequelize.literal("categoryCount DESC")]]
    });

    const maxCount = categoryCounts.length > 0 ? categoryCounts[0].dataValues.categoryCount : 0;

    // Find all categories with the maximum categoryCount
    const categoriesWithMaxCount = categoryCounts.filter(category => category.dataValues.categoryCount === maxCount);

    res.json({
      approvedActivities: completedActivitiesCount,
      totalActivitiesCount: totalActivitiesCount,
      percentage: Math.round(score[0].dataValues.score/(totalPoints || 1)*100),
      totalPoints: totalPoints,
      categoryCounts: categoryCounts,
      maxApprovalCategory: categoriesWithMaxCount.length === 1 ? categoriesWithMaxCount[0] : null,
    });
  } catch (error) {
    // Handle errors appropriately
    console.error("Error getting stats:", error);
    res.status(500).json({ message: 'Internal server error' });
  }
};


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
    const { id_member, start_date, end_date} = req.params;

    const activities = await User_Activity.findAll({
      where: {
        id_member: id_member,
        date_start_act: { [db.Sequelize.Op.gte]: start_date },
        date_stop_act: { [db.Sequelize.Op.lte]: end_date }
      },
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

const getTotalPointsByMemberId = async (req, res) => {
  try {
    const { id_member } = req.params;
    console.log(id_member);
    const totalPoints = await User_Activity.sum("point", {
      where: {
        id_member: id_member,
      },
    });

    res.status(201).json(totalPoints);
  } catch (error) {
    console.error("Error retrieving total points:", error);
    res.status(500).json({ message: "Error retrieving total points" });
  }
};


// Define controller methods
const getAllCategories = async (req, res) => {
    try {
      // Fetch all distinct categories from the User_Activity model
      const category = User_Activity.rawAttributes.category.values
      res.status(201).json(category);
    } catch (error) {
      // Handle errors
      console.error('Error fetching categories:', error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  };

module.exports = {
  createActivity,
  getMemberActivity,
  approveActivity,
  getTotalPointsByMemberId,
  getAllCategories,
  getMemberActivityStats
};