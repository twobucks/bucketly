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
    underscored: true,
    freezeTableName: true,
    tableName: 'users'
  })

  User.associate = function (models) {
    User.hasMany(models.Image, { foreignKey: 'user_id' })
  }
  return User
}
