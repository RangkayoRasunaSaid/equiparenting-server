"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class User_Activity extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      User_Activity.belongsTo(models.Team_Member, { foreignKey: "id_member" });
    }
  }
  User_Activity.init(
    {
      title: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      category: {
        type: DataTypes.ENUM(
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
        type: DataTypes.BLOB,
      },
      date_start_act: {
        type: DataTypes.DATE,
        allowNull: false,
      },
      date_stop_act: {
        type: DataTypes.DATE,
        allowNull: false,
      },
      description: {
        type: DataTypes.TEXT,
      },
      approval_by: {
        type: DataTypes.ENUM("ayah", "bunda"),
      },
      approval_date: {
        type: DataTypes.DATE,
      },
      id_member: {
        type: DataTypes.INTEGER,
        allowNull: true,
        references: {
          model: "Team_Member",
          key: "id",
        },
      },
    },
    {
      sequelize,
      modelName: "User_Activity",
    }
  );
  return User_Activity;
};
