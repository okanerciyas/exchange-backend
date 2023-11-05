'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('portfolio_shares', {
      id: {
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4(),
        primaryKey: true,
        allowNull: false,
        unique: true,
      },
      portfolioId: {
        type: Sequelize.UUID,
        references: {
          model: 'portfolio',
          key: 'id',
        },
        allowNull: false,
      },
      shareId: {
        type: Sequelize.UUID,
        references: {
          model: 'share',
          key: 'id',
        },
        allowNull: false,
      },
      amount: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },
      createdAt: {
        type: Sequelize.DATE,
        allowNull: false,
      },
      updatedAt: {
        type: Sequelize.DATE,
        allowNull: false,
      },
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('portfolio_shares');
  },
};
