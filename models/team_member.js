"use strict";
const { Model } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
  class Team_Member extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // Define association with User model
      Team_Member.belongsTo(models.User, { foreignKey: "id_user" });
    }
  }

  Team_Member.init(
    {
      name: {
        type: DataTypes.STRING(50),
        allowNull: false,
      },
      member_role: {
        type: DataTypes.ENUM("ayah", "bunda", "others"),
        allowNull: false,
      },
      avatar: {
        type: DataTypes.BLOB,
      },
      join_date: {
        allowNull: false,
        type: DataTypes.DATE,
      },
      id_user: {
        type: DataTypes.INTEGER,
        references: {
          model: "User",
          key: "id",
        },
      },
    },
    {
      sequelize,
      modelName: "Team_Member",
      freezeTableName: true,
      timestamps: false,
    }
  );
  return Team_Member;
};
