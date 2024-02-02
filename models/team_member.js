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
      // define association here
      Team_Member.belongsTo(models.Users, { foreignKey: "id_user" });
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
    }
  );
  return Team_Member;
};
