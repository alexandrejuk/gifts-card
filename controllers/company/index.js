const database = require('../../database')
const CompanyModel = database.model('company')
const CreditModel = database.model('credit')
const TransactionModel = database.model('transaction')

const createCompany = async (req, res, next) => {
  const transaction = await database.transaction()
  const initialBalance = 5000
  try {
    const response = await CompanyModel.create(req.body, { transaction })
    await CreditModel.create({ amount: initialBalance, companyId: response.id }, { transaction })
    await TransactionModel.create({ 
      amount: initialBalance, 
      companyId: response.id, 
      type: 'initial_balance',
      description: 'Add credit'
    }, { transaction })
    await transaction.commit()
    res.json(response)
  } catch (error) {
    await transaction.rollback()
    res.status(400).json(error)
  }
}

const getById = async (req, res, next) => {
  try {
    const response = await CompanyModel.findByPk(req.params.id)
    res.json(response)
  } catch (error) {
    res.status(404).json(error)
  }
}

const update = async (req, res, next) => {
  try {
    const response = await CompanyModel.findByPk(req.params.id)
    await response.update(req.body)
    await response.reload()
    res.json(response)
  } catch (error) {
    res.status(400).json(error)
  }
}

module.exports = {
  getById,
  createCompany,
  update,
}
