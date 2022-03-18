const router = require('express').Router()
const { giftCardController } = require('../../controllers')

router.get('/gifts', giftCardController.GetAllByCustomerId)

module.exports = router
