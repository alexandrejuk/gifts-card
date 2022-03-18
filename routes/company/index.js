const router = require('express').Router()
const { companyController } = require('../../controllers')

router.get('/companies/:id', companyController.getById)
router.put('/companies/:id', companyController.update)

module.exports = router