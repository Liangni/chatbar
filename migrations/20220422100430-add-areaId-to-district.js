'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.addColumn('Districts', 'AreaId', {
      type: Sequelize.INTEGER,
      allowNull: false,
      references: {
        model: 'Areas',
        key: 'id'
      }
    })
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.removeColumn('Districts', 'AreaId')
  }
};
