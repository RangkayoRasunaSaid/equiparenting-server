const { Reward, Reward_Item } = require('../models'); // Assuming your model is in the 'models' directory

// Controller to create new dates for a reward
const createRewardDates = async (req, res) => {
  const { spinned_at, start_date, end_date, id_member } = req.body;

  try {

    const reward = await Reward.create({
      spinned_at,
      start_date,
      end_date,
      id_member,
    });

    return res.status(200).json({ message: 'Reward dates created successfully', reward });
  } catch (error) {
    console.error('Error creating reward dates:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
};

const createReward = async (req, res) => {
  try {
    const { id_member, title, id_reward } = req.body;

    const newReward = await Reward_Item.create({
      id_member,
      title,
      id_reward
    });

    const id = id_reward
    const reward = await Reward.findByPk(id);
    if (!reward) return res.status(404).json({ error: "Reward not found" })

    reward.spinned_at = new Date();
    await reward.save();

    res.status(201).json(newReward);
  } catch (error) {
    console.error("Error creating reward:", error);
    res.status(500).json({ message: "Error creating reward" });
  }
};

// Controller to update start date, end date, and spinned_at date for a reward
const updateRewardDates = async (req, res) => {
  const { id } = req.params; // Assuming you pass the reward ID in the URL
  const { start_date, end_date, spinned_at } = req.body;

  try {
    const reward = await Reward.findByPk(id);

    if (!reward) {
      return res.status(404).json({ message: 'Reward not found' });
    }

    if (start_date) {
      reward.start_date = start_date;
    }

    if (end_date) {
      reward.end_date = end_date;
    }

    if (spinned_at) {
      reward.spinned_at = spinned_at;
    }

    await reward.save();

    return res.status(200).json({ message: 'Reward updated successfully' });
  } catch (error) {
    console.error('Error updating reward:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
};

// Controller to get dates for a specific reward
const getRewardDates = async (req, res) => {
  const { id } = req.params; // Assuming you pass the reward ID in the URL

  try {
    const reward = await Reward.findByPk(id);

    if (!reward) {
      return res.status(404).json({ message: 'Reward not found' });
    }

    return res.status(200).json({
      start_date: reward.start_date,
      end_date: reward.end_date,
      spinned_at: reward.spinned_at,
    });
  } catch (error) {
    console.error('Error retrieving reward dates:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
};

// Controller to get dates for all rewards
const getAllRewardDates = async (req, res) => {
  try {
    const rewards = await Reward.findAll();

    const rewardDates = rewards.map(reward => ({
      id: reward.id,
      member_id: reward.id_member,
      start_date: reward.start_date,
      end_date: reward.end_date,
      spinned_at: reward.spinned_at,
    }));

    return res.status(200).json(rewardDates);
  } catch (error) {
    console.error('Error retrieving reward dates:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
};

module.exports = {
  createRewardDates,
  updateRewardDates,
  getRewardDates,
  getAllRewardDates,
  createReward
};
