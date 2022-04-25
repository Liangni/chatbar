'use strict';
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('Users', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      account: {
        allowNull: false,
        type: Sequelize.STRING
      },
      password: {
        allowNull: false,
        type: Sequelize.STRING
      },
      birthdate: {
        allowNull: false,
        type: Sequelize.DATE
      },
      occupation: {
        type: Sequelize.STRING
      },
      avatar: {
        type: Sequelize.STRING
      },
      intro: {
        type: Sequelize.TEXT
      },
      is_admin: {  // 設定資料庫欄位用snake_case
        type: Sequelize.BOOLEAN,
        defaulValue: false
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      }
    });
  },
  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('Users');
  }
};