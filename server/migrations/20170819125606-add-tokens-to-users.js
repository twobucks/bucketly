'use strict'

module.exports = {
  up: function (queryInterface, Sequelize) {
    queryInterface.addColumn('users', 'access_token', Sequelize.STRING)
    queryInterface.addColumn('users', 'twitter_id', Sequelize.INTEGER)
    return queryInterface.addColumn('users', 'github_id', Sequelize.INTEGER)
    /*
      Add altering commands here.
      Return a promise to correctly handle asynchronicity.

      Example:
      return queryInterface.createTable('users', { id: Sequelize.INTEGER });
    */
  },

  down: function (queryInterface, Sequelize) {
    queryInterface.removeColumn('users', 'access_token', Sequelize.STRING)
    queryInterface.removeColumn('users', 'twitter_id', Sequelize.INTEGER)
    return queryInterface.removeColumn('users', 'github_id', Sequelize.INTEGER)
    /*
      Add reverting commands here.
      Return a promise to correctly handle asynchronicity.

      Example:
      return queryInterface.dropTable('users');
    */
  }
}
