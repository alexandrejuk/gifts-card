'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => queryInterface.createTable('transactions', {
    id: {
      type: Sequelize.UUID,
      defaultValue: Sequelize.UUIDV4,
      primaryKey: true,
    },
    description: {
      type: Sequelize.STRING,
      allowNull: true,
      defaultValue: ""
    },
    tid: {
      type: Sequelize.STRING,
      allowNull: true,
      unique: true,
    },
    amount: {
      type: Sequelize.INTEGER,
      allowNull: false,
      defaultValue: 0,
    },
    status: {
			type: Sequelize.ENUM([
				'waiting_payment',
				'paid',
				'refused',
				'processing',
        'finished',
        'waiting_processing'
			]),
			allowNull: false,
			defaultValue: 'waiting_payment'
    },
    type: {
			type: Sequelize.ENUM([
				'credit',
				'debt',
        'normalize',
        'initial_balance'
			]),
			allowNull: false,
			defaultValue: 'initial_balance'
    },
    companyId: {
      type: Sequelize.UUID,
      references: {
        model: 'companies',
        key: 'id',
      },
      onUpdate: 'cascade',
      onDelete: 'restrict',
    },
    createdAt: {
      type: Sequelize.DATE,
      allowNull: false,
    },
    updatedAt: {
      type: Sequelize.DATE,
      allowNull: false,
    },
  }),
  down: (queryInterface) => queryInterface.dropTable('transactions')
};