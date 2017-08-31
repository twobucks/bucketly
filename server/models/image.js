'use strict'
module.exports = function (sequelize, DataTypes) {
  var Image = sequelize.define('Image', {
    url: DataTypes.STRING,
  }, {
    classMethods: {
      associate: function (models) {
        Image.belongsTo(models.User, { foreign_key: 'user_id' })
      }
    }
  })
  return Image
}
