"use strict";
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("Score", {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      score: {
        type: Sequelize.INTEGER,
        defaultValue: 0,
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

    await queryInterface.addConstraint("Score", {
      fields: ["id_member"],
      type: "foreign key",
      name: "fk_id_member_score",
      references: {
        table: "Team_Member",
        field: "id",
      },
      onDelete: "CASCADE",
      onUpdate: "CASCADE",
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.removeConstraint("Score", "fk_id_member_score");
    await queryInterface.dropTable("Score");
  },
};
