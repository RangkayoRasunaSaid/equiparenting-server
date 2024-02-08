"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Score extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Score.belongsTo(models.Team_Member, { foreignKey: "id_member" });
    }
  }
  Score.init(
    {
      score: {
        type: DataTypes.INTEGER,
        defaultValue: 0,
        allowNull: false,
      },
      id_member: {
        type: DataTypes.INTEGER,
        references: {
          model: "Team_Member",
          key: "id",
        },
      },
    },
    {
      sequelize,
      modelName: "Score",
      freezeTableName: true,
    }
  );
  return Score;
};
