"use strict";
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("Reward_Item", {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      title: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      id_member: {
        type: Sequelize.INTEGER,
        references: {
          model: "Team_Member",
          key: "id",
        },
      },
    });

    await queryInterface.addConstraint("Reward_Item", {
      fields: ["id_member"],
      type: "foreign key",
      name: "fk_id_member_item",
      references: {
        table: "Team_Member",
        field: "id",
      },
      onDelete: "CASCADE",
      onUpdate: "CASCADE",
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.removeConstraint("Reward_Item", "fk_id_member_item");
    await queryInterface.dropTable("Reward_Item");
  },
};
