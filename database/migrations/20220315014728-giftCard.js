'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => queryInterface.createTable('giftCards', {
    id: {
      type: Sequelize.UUID,
      defaultValue: Sequelize.UUIDV4,
      primaryKey: true,
    },
    card_holder_name: {
      type: Sequelize.STRING,
      allowNull: true,
    },
    card_expiration_date: {
      type: Sequelize.DATE,
      allowNull: false,
    },
    plan: {
      type: Sequelize.INTEGER,
      allowNull: true,
    },
    amount: {
      type: Sequelize.INTEGER,
      allowNull: true,
    },
    discount: {
      type: Sequelize.INTEGER,
      allowNull: true,
    },
    giftCardType: {
      type: Sequelize.ENUM([
        'plan',
        'amount',
        'discount',
      ]),
      allowNull: false,
      defaultValue: 'discount'
    },
    activated: {
      type: Sequelize.BOOLEAN,
      allowNull: false,
      defaultValue: true
    },
    status: {
      type: Sequelize.ENUM([
        'activated',
        'waiting_active',
        'waiting_validations',
        'expirated',
        'finished',
      ]),
      allowNull: false,
      defaultValue: 'waiting_active'
    },
    companyId: {
      type: Sequelize.UUID,
      references: {
        model: 'giftTemplates',
        key: 'id',
      },
      onUpdate: 'cascade',
      onDelete: 'restrict',
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
    customerId: {
      type: Sequelize.UUID,
      allowNull: true,
      references: {
        model: 'customers',
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
  down: (queryInterface) => queryInterface.dropTable('giftCards')
};