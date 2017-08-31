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
        User.hasMany(models.Image, { foreign_key: 'user_id' })
      }
    }
  })
  return User
}
