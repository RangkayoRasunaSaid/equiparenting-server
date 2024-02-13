const { User_Activity, Team_Member, Score, Reward } = require("../models");
const db = require('../models'); // Assuming your Sequelize instance is exported from this file

const getMemberActivityStats = async (req, res) => {
  try {
    const userId = req.userId;
    const currentDate = new Date();

    // Fetch members belonging to the user
    const members = await Team_Member.findAll({
      where: { id_user: userId },
      attributes: ["id"],
    });

    // Extract member ids
    const memberIds = members.map(member => member.id);

    // Fetch completed activities for members belonging to the user
    const completedActivities = await User_Activity.findAll({
      where: {
        approval_by: { [db.Sequelize.Op.not]: null }, // Filter for completed activities
        date_start_act: { [db.Sequelize.Op.lte]: currentDate },
        date_stop_act: { [db.Sequelize.Op.gte]: currentDate },
        id_member: { [db.Sequelize.Op.in]: memberIds } // Filter activities by member ids
      },
      include: [{ model: Team_Member }]
    });

    // Calculate sum of completed activities and categories for each member
    const memberStatistics = {};
    completedActivities.forEach(activity => {
      const memberId = activity.id_member;
      const memberName = activity.Team_Member.name; // Assuming there's a 'name' field in Team_Member
      if (!memberStatistics[memberId]) {
        memberStatistics[memberId] = {
          name: memberName,
          totalActivities: 0,
          categories: new Set(),
          categoryCounts: {}
        };
      }
      memberStatistics[memberId].totalActivities++;
      memberStatistics[memberId].categories.add(activity.category);
      memberStatistics[memberId].categoryCounts[activity.category] = (memberStatistics[memberId].categoryCounts[activity.category] || 0) + 1;
    });

    // Find the category completed the most by each member
    Object.values(memberStatistics).forEach(memberStat => {
      let maxCategoryCount = 0;
      let mostCompletedCategory = '';
      Object.entries(memberStat.categoryCounts).forEach(([category, count]) => {
        if (count > maxCategoryCount) {
          maxCategoryCount = count;
          mostCompletedCategory = category;
        }
      });
      memberStat.mostCompletedCategory = mostCompletedCategory;
    });

    // Send the member statistics as a response
    res.status(201).json(memberStatistics);
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