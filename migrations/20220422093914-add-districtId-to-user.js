'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.addColumn('Users', 'DistrictId', {
      type: Sequelize.INTEGER,
      allowNull: false,
      references: {
        model: 'Districts',
        key: 'id'
      }
    })
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.removeColumn('Users', 'DistrictId' )
  }
};
