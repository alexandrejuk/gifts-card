const Sequelize = require('sequelize')

const User = (sequelize) => {
  const User = sequelize.define('user', {
    id: {
      type: Sequelize.UUID,
      defaultValue: Sequelize.UUIDV4,
      primaryKey: true,
    },
    name: {
      type: Sequelize.STRING,
      allowNull: false,
    },
    email: {
      type: Sequelize.STRING,
      allowNull: false,
      unique: true,
    },
    password: {
      type: Sequelize.STRING,
      allowNull: false,
    },
    userType: {
      type: Sequelize.ENUM([
        'operator',
        'admin',
        'customer',
      ]),
      allowNull: false,
      defaultValue: 'operator'
    },
    activated: {
      type: Sequelize.BOOLEAN,
      allowNull: false,
      defaultValue: true
    }
  })
  
  User.associate = (models) => {
    models.user.belongsTo(models.company, {
      foreignKey: {
        allowNull: false,
      }
    })
  }

  return User
}

module.exports = User
