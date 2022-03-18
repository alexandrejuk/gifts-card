const router = require('express').Router()
const { giftCardController } = require('../../controllers')

router.put('/gift-cards/:id', giftCardController.activated)
router.get('/gift-cards/:id', giftCardController.GetGiftCardById)

module.exports = router
