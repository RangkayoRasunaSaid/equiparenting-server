"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Reward_Item extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Reward_Item.belongsTo(models.Reward, { foreignKey: "id_reward" });
      Reward_Item.belongsTo(models.Team_Member, { foreignKey: "id_member" });
    }
  }
  Reward_Item.init(
    {
      title: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      id_reward: {
        type: DataTypes.INTEGER,
        references: {
          model: "Reward",
          key: "id",
        },
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
      modelName: "Reward_Item",
      freezeTableName: true,
      timestamps: false,
    }
  );
  return Reward_Item;
};
