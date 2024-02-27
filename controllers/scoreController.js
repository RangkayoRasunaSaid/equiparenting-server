const { Team_Member, Score } = require('../models');

const resetScore = async (req, res) => {
  const { memberId } = req.body; // Assuming memberId is provided in the request body

  try {
    // Find the member by ID
    const member = await Team_Member.findByPk(memberId);

    if (!member) {
      return res.status(404).json({ message: 'Member not found' });
    }

    // Find the associated score record
    const score = await Score.findOne({ where: { id_member: memberId } });

    if (!score) {
      return res.status(404).json({ message: 'Score not found for the member' });
    }

    // Reset the score to 0
    score.score = 0;
    await score.save();

    return res.status(200).json({ message: 'Member score reset successfully' });
  } catch (error) {
    console.error('Error resetting member score:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
};

module.exports = {
  resetScore,
};
