const { Team_Member, User_Activity, Reward } = require("../models");
const db = require("../models");

const createMember = async (req, res) => {
  try {
    const { name, member_role, avatar } = req.body;
    const id_user = req.userId;

    const member = await Team_Member.create({
      name,
      member_role,
      avatar,
      join_date: new Date(),
      id_user,
    });

    res.status(201).json({ message: "Member created successfully" });
  } catch (error) {
    console.error("Error creating member:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

const getAllMembersWithScores = async (req, res) => {
  try {
    const userId = req.userId;

    // 1. Get the current date
    const currentDate = new Date();

    const members = await Team_Member.findAll({
      where: { id_user: userId },
      // include: [
      //   {
      //     model: Score,
      //     required: false,
      //   },
      // ],
      attributes: ["id", "name", "member_role", "avatar"],
    });

    // 2. Query activities where the current date is between date_start_act and date_stop_act for each member
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

    res.status(201).json({ members: membersWithScore });
  } catch (error) {
    console.error("Error getting members data:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

const deleteMember = async (req, res) => {
  try {
    const { memberId } = req.params; // Assuming memberId is passed as a URL parameter
    
    // Delete the member
    const deletedMember = await Team_Member.destroy({ where: { id: memberId } });

    // Delete the associated score (if exists)
    // await Score.destroy({ where: { id_member: memberId } });

    if (deletedMember) {
      res.status(200).json({ message: "Member deleted successfully" });
    } else {
      res.status(404).json({ message: "Member not found" });
    }
  } catch (error) {
    console.error("Error deleting member:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

module.exports = {
  createMember,
  getAllMembersWithScores,
  deleteMember
};
