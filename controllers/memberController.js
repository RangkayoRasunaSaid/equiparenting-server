const { Team_Member, Score } = require("../models");

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

    const members = await Team_Member.findAll({
      where: { id_user: userId },
      include: [
        {
          model: Score,
          required: false,
        },
      ],
      attributes: ["name", "member_role", "avatar"],
    });

    const membersWithScore = members.map((member) => ({
      ...member.dataValues,
      score: member.Score ? member.Score.score : 0,
    }));

    res.status(201).json({ members: membersWithScore });
  } catch (error) {
    console.error("Error getting members data:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

module.exports = {
  createMember,
  getAllMembersWithScores,
};
