const Sequelize = require('sequelize')

const GiftCard = (sequelize) => {
  const GiftCard = sequelize.define('giftCard', {
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
    status: {
      type: Sequelize.ENUM([
        'activated',
        'waiting_active',
        'expirated',
        'finished',
        'waiting_validations'
      ]),
      allowNull: false,
      defaultValue: 'waiting_active'
    },
    activated: {
      type: Sequelize.BOOLEAN,
      allowNull: false,
      defaultValue: true
    }
  })
  
  GiftCard.associate = (models) => {
    models.giftCard.belongsTo(models.company, {
      foreignKey: {
        allowNull: false,
      }
    })

    models.giftCard.belongsTo(models.customer, {
      foreignKey: {
        allowNull: true,
      }
    })
  }

  return GiftCard
}

module.exports = GiftCard
