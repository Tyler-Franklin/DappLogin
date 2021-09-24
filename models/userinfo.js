'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class userinfo extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  };
  userinfo.init({
    userAddress: {
      type: DataTypes.STRING,
      primaryKey: true,
      unique: true,
      allowNull: false
    },
    
    depositAmount: { type : DataTypes.DOUBLE,defaultValue : 0},

  }, {
    sequelize,
    modelName: 'userinfo',
  });
  return userinfo;
};