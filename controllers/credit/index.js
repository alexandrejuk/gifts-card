const database = require('../../database')
const CreditModel = database.model('credit')
const TransactionModel = database.model('transaction')

const Sequelize = require('sequelize')
const { pathOr } = require('ramda')

const getByCompanyId = async (req, res, next) => {
  const companyId = pathOr(null, ['decoded', 'user', 'companyId'], req)
  try {
    const response = await CreditModel.findOne({ where: { companyId }})
    res.json(response)
  } catch (error) {
    res.status(404).json(error)
  }
}

const update = async (req, res, next) => {
  const id = pathOr(null, ['params', 'id'], req)
  const companyId = pathOr(null, ['decoded', 'user', 'companyId'], req)
  const amount = pathOr(null, ['body', 'amount'], req)
  const transaction = await database.transaction() 

  try {
    const response = await CreditModel.findOne({ where: { id, companyId }})
    await response.update({ amount: (amount + response.amount)}, { transaction })
    await TransactionModel.create({ 
      amount, 
      companyId: response.id, 
      type: 'credit',
      description: 'Add credit',
      tid: "pagarme id"
    }, { transaction })
    await transaction.commit()
    await response.reload()
    res.json(response)
  } catch (error) {
    await transaction.rollback()
    res.status(400).json(error)
  }
}

const getByCompanyIdTransactions = async (req, res, next) => {
  const companyId = pathOr(null, ['decoded', 'user', 'companyId'], req)
  try {
    const response = await TransactionModel.findAll({ where: { companyId }})
    res.json(response)
  } catch (error) {
    res.status(404).json(error)
  }
} 

module.exports = {
  getByCompanyId,
  update,
  getByCompanyIdTransactions,
}
