'use strict'

module.exports = {
  up: function (queryInterface, Sequelize) {
    queryInterface.addColumn('Users', 'access_token', Sequelize.STRING)
    queryInterface.addColumn('Users', 'twitter_id', Sequelize.INTEGER)
    queryInterface.addColumn('Users', 'github_id', Sequelize.INTEGER)
    /*
      Add altering commands here.
      Return a promise to correctly handle asynchronicity.

      Example:
      return queryInterface.createTable('users', { id: Sequelize.INTEGER });
    */
  },

  down: function (queryInterface, Sequelize) {
    queryInterface.removeColumn('Users', 'access_token', Sequelize.STRING)
    queryInterface.removeColumn('Users', 'twitter_id', Sequelize.INTEGER)
    queryInterface.removeColumn('Users', 'github_id', Sequelize.INTEGER)
    /*
      Add reverting commands here.
      Return a promise to correctly handle asynchronicity.

      Example:
      return queryInterface.dropTable('users');
    */
  }
}
