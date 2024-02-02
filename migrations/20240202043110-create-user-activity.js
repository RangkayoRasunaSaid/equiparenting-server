"use strict";
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("User_Activity", {
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
      category: {
        type: Sequelize.ENUM(
          "Baby",
          "Dapur",
          "Laundry",
          "Kebun/Teras",
          "Liburan",
          "Kamar Tidur",
          "Kamar Mandi",
          "Edukasi",
          "Ruang Makan",
          "Lainnya"
        ),
        allowNull: false,
      },
      proof_picture: {
        type: Sequelize.BLOB,
      },
      date_start_act: {
        type: Sequelize.DATE,
        allowNull: false,
      },
      date_stop_act: {
        type: Sequelize.DATE,
        allowNull: false,
      },
      description: {
        type: Sequelize.TEXT,
      },
      point: {
        type: Sequelize.INTEGER(10),
        allowNull: false,
      },
      approval_by: {
        type: Sequelize.ENUM("ayah", "bunda"),
      },
      approval_date: {
        type: Sequelize.DATE,
      },
      id_member: {
        type: Sequelize.INTEGER,
        references: {
          model: "Team_Member",
          key: "id",
        },
      },
    });

    await queryInterface.addConstraint("User_Activity", {
      fields: ["id_member"],
      type: "foreign key",
      name: "fk_id_member_activity",
      references: {
        table: "Team_Member",
        field: "id",
      },
      onDelete: "CASCADE",
      onUpdate: "CASCADE",
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.removeConstraint("User_Activity", "fk_id_member_activity");
    await queryInterface.dropTable("User_Activity");
  },
};
