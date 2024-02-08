const { Team_Member } = require("../models");

const createMember = async (req, res) => {
  console.log(req.userId);
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

module.exports = { createMember };
