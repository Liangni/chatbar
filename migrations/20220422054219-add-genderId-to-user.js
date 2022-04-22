'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.addColumn('Users', 'GenderId', {
      type: Sequelize.INTEGER,
      allowNull: false,
      references: {
        model: 'Genders',
        key: 'id'
      } 
    })
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.removeColumn('Users', 'GenderId')
  }
};
