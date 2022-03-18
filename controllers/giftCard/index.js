const { pathOr, path, applySpec } = require('ramda')
const moment = require('moment')
const database = require('../../database')
const GiftCardModel = database.model('giftCard')
const CustomerModel = database.model('customer')
const CompanyModel = database.model('company')
const CreditModel = database.model('credit')
const TransactionModel = database.model('transaction')

const Sequelize = require('sequelize')
const { Op } = Sequelize
const { iLike } = Op

const create = async (req, res, next) => {
  const companyId = pathOr(null, ['decoded', 'user', 'companyId'], req)
  const card_expiration_date = pathOr(moment().add(180,"days").toISOString(), ['body', 'card_expiration_date'], req)

  const transaction = await database.transaction() 
  try {
    const findCompany = await CompanyModel.findOne({ id: companyId, include: [CreditModel] })
    if(!findCompany) {
      throw new Error("Cannot create gift card")
    }
    
    if(pathOr(0, ['credit', 'amount'], findCompany) < pathOr(250, ['cost'], findCompany)) {
      throw new Error("Cannot create gift card, insufficient funds")
    }
    
    const creditFunds = await CreditModel.findOne({id: findCompany.credit.id })
    await creditFunds.update({ amount: (findCompany.credit.amount - pathOr(250, ['cost'], findCompany)) }, { transaction })
    const response = await GiftCardModel.create({ ...req.body, companyId, card_expiration_date }, { transaction })
    await TransactionModel.create({
      amount: pathOr(250, ['cost'], findCompany),
      companyId: findCompany.id, 
      type: 'debt',
      status: 'finished',
      description: `Created gift card - gift card id: ${response.id}`
    }, { transaction })
    await transaction.commit()
    await findCompany.reload()
    res.json(response)
  } catch (error) {
    await transaction.rollback()
    res.status(400).json({ error: error.message })
  }
}

const GetAll = async (req, res, next) => {
  const companyId = pathOr(null, ['decoded', 'user', 'companyId'], req)
  try {
    const response = await GiftCardModel.findAll({ where: { companyId }})
    res.json(response)
  } catch (error) {
    res.status(400).json({ error })
  }
}

const GetAllWatingValidations = async (req, res, next) => {
  const companyId = pathOr(null, ['decoded', 'user', 'companyId'], req)
  const status = pathOr('waiting_validations', ['query', 'status'], req)
  try {
    const response = await GiftCardModel.findAll({ where: { companyId, status }, include: [CustomerModel]})
    res.json(response)
  } catch (error) {
    res.status(400).json({ error })
  }
}

const activated = async (req, res, next) => {
  const transaction = await database.transaction() 
  const email = pathOr(null, ['body', 'email'], req)
  const phone = pathOr(null, ['body', 'phone'], req)
  try {
    let payload = { card_expiration_date: moment().add(180, "days").toISOString() }
    const findCustomer = await CustomerModel.findOne({ where: { email, phone } })
    if(!findCustomer) {
      const customer = await CustomerModel.create(req.body, { transaction })
      payload = { ...payload, customerId: customer.id }
    } else {
      payload = { ...payload, customerId: findCustomer.id }
    }

    const response = await GiftCardModel.findByPk(req.params.id)
    if(response.status === "activated") {
      throw new Error('Card has already been activated!')
    }

    if(response) {
      payload = { 
        ...payload, 
        card_expiration_date: (
          response.giftCardType === "plan" 
            ? moment().add(response.plan, "days").toISOString() 
            : response.card_expiration_date
        ),
        status: "activated",
      }
    }
    await response.update(payload, { transaction })
    await transaction.commit()
    await response.reload()
    res.json(response)
  } catch (error) {
    await transaction.rollback()
    res.status(400).json({ error: error.message })
  }
}

const GetAllByCustomerId = async (req, res, next) => {
  const email = pathOr(null, ['query', 'email'], req)
  const phone = pathOr(null, ['query', 'phone'], req)
  let where = email ? { email } : {}
  where = phone ? {...where, phone} : where

  try {
    if(!email && !phone) {
      throw new Error("Cannot find gift card")
    }
    const response = await GiftCardModel.findAll({
      include: [{
        model: CustomerModel,
        where
      },{
        model: CompanyModel,
      }]
    })
    const makeResponse = applySpec({
      customerName: pathOr(null, [0, 'customer', 'name']),
      companyName: pathOr(null, [0, 'company', 'name']),
      giftCards: values => values,
    })
    res.json(makeResponse(response))
  } catch (error) {
    res.status(400).json({ error: error.message })
  }
}

const GetGiftCardById = async (req, res, next) => {
  const id = pathOr(null, ['params', 'id'], req)
  try {
    const response = await GiftCardModel.findByPk(id)
    res.json(response)
  } catch (error) {
    res.status(400).json({ error: error.message })
  }
}

const ValidationCardCompany = async (req, res, next) => {
  const companyId = pathOr(null, ['decoded', 'user', 'companyId'], req)
  const status = pathOr('waiting_validations', ['query', 'status'], req)
  const id = pathOr(null, ['params', 'id'], req)

  try {
    const response = await GiftCardModel.findOne({ where: { id, companyId, status }, include: [CustomerModel]})
    await response.update({ status: 'finished' })
    await response.reload({ status: 'finished' })
    res.json(response)
  } catch (error) {
    res.status(400).json({ error })
  }
}

module.exports = {
  create,
  GetAll,
  activated,
  GetAllByCustomerId,
  GetGiftCardById,
  GetAllWatingValidations,
  ValidationCardCompany,
}
