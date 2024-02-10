const { Team_Member, Score } = require("../models");

const createMember = async (req, res) => {
  console.log(req.userId);
  try {
    const { name, member_role, avatar } = req.body;
    const id_user = req.userId;

    // Check the number of members associated with the user
    const memberCount = await Team_Member.count({ where: { id_user } });
    if (memberCount >= 2) {
      return res.status(400).json({ message: "User has reached the maximum limit of members" });
    }

    // Create the member
    const member = await Team_Member.create({
      name,
      member_role,
      avatar,
      join_date: new Date(),
      id_user,
    });

    // Create initial score for the member
    await Score.create({
      score: 0,
      id_member: member.id // Assuming member.id is the primary key of the Team_Member model
    });

    res.status(201).json({ message: "Member created successfully" });
  } catch (error) {
    console.error("Error creating member:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

const getAllMembers = async (req, res) => {
  try {
    const members = await Team_Member.findAll();
    res.status(200).json(members);
  } catch (error) {
    console.error("Error getting all members:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

const deleteMember = async (req, res) => {
  try {
    const { memberId } = req.params; // Assuming memberId is passed as a URL parameter
    
    // Delete the member
    const deletedMember = await Team_Member.destroy({ where: { id: memberId } });

    // Delete the associated score (if exists)
    await Score.destroy({ where: { id_member: memberId } });

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

module.exports = { createMember, getAllMembers, deleteMember };
