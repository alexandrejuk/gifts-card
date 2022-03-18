const Sequelize = require('sequelize')

const Company = (sequelize) => {
  const Company = sequelize.define('company', {
    id: {
      type: Sequelize.UUID,
      defaultValue: Sequelize.UUIDV4,
      primaryKey: true,
    },
    name: {
      type: Sequelize.STRING,
      allowNull: false,
    },
    logo: {
      type: Sequelize.STRING,
      allowNull: true,
    },
    document: {
      type: Sequelize.STRING,
      allowNull: false,
      unique: true
    },
    cost: {
      type: Sequelize.INTEGER,
      allowNull: false,
      defaultValue: 250
    },
    type: {
      type: Sequelize.ENUM(['filial', 'matriz']),
      allowNull: false,
      defaultValue: 'filial'
    },
    zipcode: {
      type: Sequelize.STRING,
      allowNull: false,
    },
    street: {
      type: Sequelize.STRING,
      allowNull: false,
    },
    streetNumber: {
      type: Sequelize.STRING,
      allowNull: false,
    },
    neighborhood: {
      type: Sequelize.STRING,
      allowNull: false,
    },
    city: {
      type: Sequelize.STRING,
      allowNull: false,
    },
    state: {
      type: Sequelize.STRING,
      allowNull: false,
    },
  })

  Company.associate = (models) => {
    models.company.hasOne(models.credit, {
      foreignKey: {
        allowNull: false,
        unique: true
      }
    })

    models.company.hasMany(models.transaction, {
      foreignKey: {
        allowNull: false,
        unique: true
      }
    })
  }

  return Company
}

module.exports = Company
