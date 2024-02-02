"use strict";
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("Reward", {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      spinned_at: {
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal("CURRENT_TIMESTAMP"),
      },
      start_date: {
        type: Sequelize.DATE,
      },
      end_date: {
        type: Sequelize.DATE,
      },
      id_member: {
        type: Sequelize.INTEGER,
        references: {
          model: "Team_Member",
          key: "id",
        },
      },
      id_reward_item: {
        type: Sequelize.INTEGER,
        references: {
          model: "Reward_Item",
          key: "id",
        },
      },
    });

    await queryInterface.addConstraint("Reward", {
      fields: ["id_member"],
      type: "foreign key",
      name: "fk_id_member_reward",
      references: {
        table: "Team_Member",
        field: "id",
      },
      onDelete: "CASCADE",
      onUpdate: "CASCADE",
    });

    await queryInterface.addConstraint("Reward", {
      fields: ["id_reward_item"],
      type: "foreign key",
      name: "fk_id_reward_item",
      references: {
        table: "Reward_Item",
        field: "id",
      },
      onDelete: "CASCADE",
      onUpdate: "CASCADE",
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.removeConstraint("Reward", "fk_id_member_reward");
    await queryInterface.removeConstraint("Reward", "fk_id_reward_item");
    await queryInterface.dropTable("Reward");
  },
};
