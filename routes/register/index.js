const router = require('express').Router()
const { companyController } = require('../../controllers')

router.post('/register', companyController.createCompany)

module.exports = router