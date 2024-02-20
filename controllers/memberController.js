const { Team_Member, Reward_Item, Reward, Score } = require("../models");
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

    // Return the created member data in the response
    res.status(201).json({ message: "Member created successfully", member });
  } catch (error) {
    console.error("Error creating member:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
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
          attributes: ['id', 'spinned_at', 'start_date', 'end_date'],
          include: [
            {
              model: Reward_Item,
              required: false,
              attributes: ['title'],
            }
          ]
        },
        {
          model: Score,
          required: false,
          attributes: ['score'],
        },
      ],
      attributes: ["id", "name", "member_role", "avatar"],
      order: [['join_date', 'DESC']]
    });
    
    const membersData = members.map(member => ({
      ...member.dataValues
    }));

    res.status(201).json({ members: membersData });
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
