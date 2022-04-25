'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn('Users', 'gender_id', {
      type: Sequelize.INTEGER,
      allowNull: false,
      references: {
        model: 'Genders',
        key: 'id'
      }
    })
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn('Users', 'gender_id')
  }
};
