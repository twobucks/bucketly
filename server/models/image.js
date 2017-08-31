'use strict'
module.exports = function (sequelize, DataTypes) {
  var Image = sequelize.define('Image', {
    url: DataTypes.STRING
  }, {
    underscored: true,
    freezeTableName: true,
    tableName: 'images'
  })

  Image.associate = function (models) {
    Image.belongsTo(models.User, { foreignKey: 'user_id' })
  }
  return Image
}
