'use strict'

module.exports = {
  up: function (queryInterface, Sequelize) {
    queryInterface.renameColumn('users', 'createdAt', 'created_at')
    queryInterface.renameColumn('users', 'updatedAt', 'updated_at')
    queryInterface.renameColumn('images', 'createdAt', 'created_at')
    return queryInterface.renameColumn('images', 'updatedAt', 'updated_at')
    /*
      Add altering commands here.
      Return a promise to correctly handle asynchronicity.

      Example:
      return queryInterface.createTable('users', { id: Sequelize.INTEGER });
    */
  },

  down: function (queryInterface, Sequelize) {
    queryInterface.renameColumn('users', 'created_at', 'createdAt')
    queryInterface.renameColumn('users', 'updated_at', 'updatedAt')
    queryInterface.renameColumn('images', 'created_at', 'createdAt')
    return queryInterface.renameColumn('images', 'updated_at', 'updatedAt')
    /*
      Add reverting commands here.
      Return a promise to correctly handle asynchronicity.

      Example:
      return queryInterface.dropTable('users');
    */
  }
}
