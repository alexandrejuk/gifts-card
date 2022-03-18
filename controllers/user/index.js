const { hash, compare } = require('bcrypt')
const { omit, pathOr } = require('ramda')
const database = require('../../database')

const UserModel = database.model('user')
const CompanyModel = database.model('company')

const Sequelize = require('sequelize')
const { Op } = Sequelize
const { iLike } = Op

const create = async (req, res, next) => {
  const password = await hash(pathOr("123456", ['body', 'password'], req), 10) 
  const companyIdBody = pathOr(null, ['body', 'companyId'], req) 
  const companyId = (
    companyIdBody
      ? companyIdBody
      : pathOr(null, ['decoded', 'user', 'companyId'], req)
  )
  
  try {
    const response = await UserModel.create({ ...req.body, password, companyId })
    res.json(response)
  } catch (error) {
    res.status(400).json({ error })
  }
}

const update = async (req, res, next) => {
  const payload = omit(['password'], req.body)
  try {
    const findUser = await UserModel.findByPk(req.params.id)
    await findUser.update(payload)
    const response = await findUser.reload()
    res.json(response)
  } catch (error) {
    res.status(400).json({ error })
  }
}

const getById = async (req, res, next) => {
  try {
    const response = await UserModel.findByPk(req.params.id)
    res.json(response)
  } catch (error) {
    res.status(400).json({ error })
  }
}

const getAll = async (req, res, next) => {
  const companyId = pathOr(null, ['decoded', 'user', 'companyId'], req)
  const limit = pathOr(20, ['query', 'limit'], req)
  const offset = pathOr(0, ['query', 'offset'], req)
  const email = pathOr(null, ['query', 'email'], req)
  const name = pathOr(null, ['query', 'name'], req)
  const isEmail = email ? { email } : null
  const isName = name ? { name: { [iLike]: '%' + name + '%' } } : null
  let where = { }
  
  if (isEmail) {
    where = isEmail
  }

  if (isName) {
    where = isName
  }

  try {

    const response = await UserModel.findAndCountAll({
      order: [['name', 'ASC']],
      where: {...where, companyId},
      limit,
      offset: (offset * limit),
      include: { model: CompanyModel, required: true }
    })

    res.json(response)
  } catch (error) {
    console.log(error);
    res.status(400).json({ error })
  }
}

const updatePassword = async (req, res, next) => {
  const userId = pathOr(null, ['decoded', 'user', 'id'], req)

  try {
    const findUser = await UserModel.findByPk(userId)
    const checkedPassword = await compare(req.body.password, findUser.password)

    if(!checkedPassword) {
      throw new Error('Username or password do not match')
    }

    const password = await hash(req.body.newPassword, 10)
  
    await findUser.update({ password })
    await findUser.reload()

    res.json(findUser)
  } catch (error) {
    res.status(400).json({ error: error.message })
  }
}

module.exports = {
  create,
  update,
  getById,
  getAll,
  updatePassword,
}
