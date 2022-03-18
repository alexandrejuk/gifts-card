const User = require('./user.model')
const Company = require('./company.model')
const Credit = require('./credit.model')
const Customer = require('./customer.model')
const GiftCard = require('./giftCard.model')
const Transactions = require('./transaction.model')

module.exports = [
  Company,
  User,
  Credit,
  Customer,
  GiftCard,
  Transactions,
]
