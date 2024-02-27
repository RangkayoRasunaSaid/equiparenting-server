'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    // Add association between Reward and Reward_Item
    await queryInterface.addColumn('Reward_Item', 'id_reward', {
      type: Sequelize.INTEGER,
      allowNull: false,
      references: {
        model: 'Reward',
        key: 'id'
      },
      onUpdate: 'CASCADE',
      onDelete: 'CASCADE'
    });
  },

  async down(queryInterface, Sequelize) {
    // If needed, you could remove the association here, but it's not included in this migration.
    // This down method is empty as it's not reversing the up method.
  }
};