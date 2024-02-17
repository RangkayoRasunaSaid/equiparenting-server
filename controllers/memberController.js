const { Team_Member, User_Activity, Reward, Score } = require("../models");
const db = require('../models');

const createMember = async (req, res) => {
  try {
    const { name, member_role, avatar } = req.body;
    const id_user = req.userId;

    // Create the member
    const member = await Team_Member.create({
      name,
      member_role,
      avatar,
      join_date: new Date(),
      id_user,
    });

    // Add a default score of 0 for the created member
    await Score.create({
      score: 0,
      id_member: member.id,
    });

    res.status(201).json({ message: "Member created successfully" });
  } catch (error) {
    console.error("Error creating member:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

module.exports = {
  createMember,
};

const getAllMembersWithDates = async (req, res) => {
  try {
    const userId = req.userId;
    const currentDate = new Date();
    const members = await Team_Member.findAll({
      where: { id_user: userId },
      include: [
        {
          model: Reward,
          required: false,
          where: {
            start_date: { [db.Sequelize.Op.lte]: currentDate },
            end_date: { [db.Sequelize.Op.gte]: currentDate }
          },
          attributes: ['id', 'spinned_at', 'start_date', 'end_date'], // Include required attributes
        },
        {
          model: Score,
          required: false,
          attributes: ['score'],
        },
      ],
      attributes: ["id", "name", "member_role", "avatar"],
    });

    // Step 2: Extract start_date and end_date from the rewards
    const membersWithActivities = await Promise.all(members.map(async member => {
      const memberData = member.toJSON();
      const reward = memberData.Rewards[0] || [];

      const activities = await User_Activity.findAll({
        where: {
          id_member: member.id,
          date_start_act: { [db.Sequelize.Op.gte]: reward.start_date },
          date_stop_act: { [db.Sequelize.Op.lte]: reward.end_date }
        }
      });

      return { ...member.dataValues, activities };
    }));
    
    const membersData = membersWithActivities.map(member => ({
      ...member.dataValues
    }));
    console.log('******members***********',membersData);

    res.status(201).json({ members: membersWithActivities });
  } catch (error) {
    console.error("Error getting members data:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

const deleteMember = async (req, res) => {
  try {
    const { memberId } = req.params; // Assuming memberId is passed as a URL parameter

    // Delete the associated score (if exists)
    await Score.destroy({ where: { id_member: memberId } });
    await Reward.destroy({ where: { id_member: memberId } });
    
    // Delete the member
    const deletedMember = await Team_Member.destroy({ where: { id: memberId } });

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
  getAllMembersWithDates,
  deleteMember
};
