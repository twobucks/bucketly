'use strict'
module.exports = function (sequelize, DataTypes) {
  var User = sequelize.define('User', {
    email: DataTypes.STRING,
    s3_details: DataTypes.HSTORE,
    auth_token: DataTypes.STRING,
    twitter_id: DataTypes.INTEGER,
    github_id: DataTypes.INTEGER,
    access_token: DataTypes.STRING
  }, {
    classMethods: {
      associate: function (models) {
        // associations can be defined here
      }
    }
  })
  return User
}
