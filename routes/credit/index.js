const router = require('express').Router()
const { creditController } = require('../../controllers')

router.put('/credits/:id', creditController.update)
router.get('/credits', creditController.getByCompanyId)
router.get('/credits/transactions', creditController.getByCompanyIdTransactions)

module.exports = router
