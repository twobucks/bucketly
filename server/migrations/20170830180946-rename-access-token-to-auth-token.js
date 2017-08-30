'use strict'

module.exports = {
  up: function (queryInterface, Sequelize) {
    queryInterface.renameColumn('Users', 'access_token', 'auth_token')
    /*
      Add altering commands here.
      Return a promise to correctly handle asynchronicity.

      Example:
      return queryInterface.createTable('users', { id: Sequelize.INTEGER });
    */
  },

  down: function (queryInterface, Sequelize) {
    queryInterface.renameColumn('Users', 'auth_token', 'access_token')
    /*
      Add reverting commands here.
      Return a promise to correctly handle asynchronicity.

      Example:
      return queryInterface.dropTable('users');
    */
  }
}
