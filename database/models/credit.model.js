const Sequelize = require('sequelize')

const Credit = (sequelize) => {
  const Credit = sequelize.define('credit', {
    id: {
      type: Sequelize.UUID,
      defaultValue: Sequelize.UUIDV4,
      primaryKey: true,
    },
    amount: {
      type: Sequelize.INTEGER,
      allowNull: false,
      default: 500
    },
  })
  
  Credit.associate = (models) => {
    models.credit.belongsTo(models.company, {
      foreignKey: {
        allowNull: false,
        unique: true
      }
    })
  }

  return Credit
}

module.exports = Credit
