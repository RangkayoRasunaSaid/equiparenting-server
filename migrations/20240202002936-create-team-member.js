"use strict";
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("Team_Member", {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      name: {
        type: Sequelize.STRING(50),
        allowNull: false,
      },
      member_role: {
        type: Sequelize.ENUM("ayah", "bunda", "others"),
        allowNull: false,
      },
      avatar: {
        type: Sequelize.BLOB,
      },
      join_date: {
        allowNull: false,
        type: Sequelize.DATE,
      },
      id_user: {
        type: Sequelize.INTEGER,
        references: {
          model: "User",
          key: "id",
        },
      },
    });
    await queryInterface.addConstraint("Team_Member", {
      fields: ["id_user"],
      type: "foreign key",
      name: "fk_id_user",
      references: {
        table: "User",
        field: "id",
      },
      onDelete: "CASCADE",
      onUpdate: "CASCADE",
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.removeConstraint("Team_Member", "fk_id_user");
    await queryInterface.dropTable("Team_Member");
  },
};
