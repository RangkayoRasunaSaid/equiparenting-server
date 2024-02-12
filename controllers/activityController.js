const { User_Activity, Team_Member, Score } = require("../models");
const db = require("../models");

const getMemberActivityStats = async () => {
  try {
    const userId = req.userId;

    // Determine the current period
    const currentDate = new Date();

    const members = await Team_Member.findAll({
      where: { id_user: userId },
      attributes: ["id", "name", "member_role", "avatar"],
    });

    // Retrieve data
    const membersWithScore = await Promise.all(members.map(async (member) => {
      const approvedActivities = await User_Activity.findAll({
        where: {
          id_member: member.id,
          date_start_act: {
            [db.Sequelize.Op.lte]: currentDate // Current date is after or equal to date_start_act
          },
          date_stop_act: {
            [db.Sequelize.Op.gte]: currentDate // Current date is before or equal to date_stop_act
          },
          approval_by: {
            [db.Sequelize.Op.ne]: null // Ensures approval_by is not empty
          }
        },
        attributes: ['point']
      });

      // 3. Calculate the total points and total points that can be obtained within the current period
      const totalPoints = approvedActivities.reduce((acc, activity) => acc + activity.point, 0);
      const totalPossiblePoints = await User_Activity.sum("point", {
        where: {
          id_member: member.id,
          date_start_act: {
            [db.Sequelize.Op.lte]: currentDate // Current date is after or equal to date_start_act
          },
          date_stop_act: {
            [db.Sequelize.Op.gte]: currentDate // Current date is before or equal to date_stop_act
          }
        },
      });

      // 4. Calculate the percentage
      const percentage = (totalPoints / totalPossiblePoints) * 100;

      return {
        ...member.dataValues,
        score: totalPoints,
        percentage: isNaN(percentage) ? 0 : percentage, // Handle cases where totalPossiblePoints is 0
      };
    }));

    // Group activities by member
    const memberActivityGroups = {};
    memberActivities.forEach(activity => {
      const memberId = activity.Team_Member.id;
      if (!memberActivityGroups[memberId]) {
        memberActivityGroups[memberId] = {
          member: activity.Team_Member,
          completedCount: 0,
          categories: {},
          mostCompletedCategory: null
        };
      }
      memberActivityGroups[memberId].completedCount++;
      const category = activity.category;
      memberActivityGroups[memberId].categories[category] = (memberActivityGroups[memberId].categories[category] || 0) + 1;
      if (!memberActivityGroups[memberId].mostCompletedCategory || memberActivityGroups[memberId].categories[category] > memberActivityGroups[memberId].categories[memberActivityGroups[memberId].mostCompletedCategory]) {
        memberActivityGroups[memberId].mostCompletedCategory = category;
      }
    });

    return Object.values(memberActivityGroups);
  } catch (error) {
    console.error("Error getting member activity stats:", error);
    throw error;
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