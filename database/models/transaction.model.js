const Sequelize = require('sequelize')

const Transaction = (sequelize) => {
  const Transaction = sequelize.define('transaction', {
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
			defaultValue: 'finished'
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
  })
  
  Transaction.associate = (models) => {
    models.transaction.belongsTo(models.company, {
      foreignKey: {
        allowNull: false,
      }
    })
  }

  return Transaction
}

module.exports = Transaction
