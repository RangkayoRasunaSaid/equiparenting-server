"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Reward extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Reward.belongsTo(models.Team_Member, { foreignKey: "id_member" });
      Reward.hasMany(models.Reward_Item, { foreignKey: "id_reward_item" });
    }
  }
  Reward.init(
    {
      spinned_at: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW,
      },
      start_date: {
        type: DataTypes.DATE,
      },
      end_date: {
        type: DataTypes.DATE,
      },
      id_member: {
        type: DataTypes.INTEGER,
        references: {
          model: "Team_Member",
          key: "id",
        },
      },
      id_reward_item: {
        type: DataTypes.INTEGER,
        references: {
          model: "Reward_Item",
          key: "id",
        },
      },
    },
    {
      sequelize,
      modelName: "Reward",
    }
  );
  return Reward;
};
