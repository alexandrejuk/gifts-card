const router = require('express').Router()
const { giftCardController } = require('../../controllers')

router.post('/gift-cards', giftCardController.create)
router.get('/gift-cards', giftCardController.GetAll)
router.put('/validations/gift-card/:id', giftCardController.ValidationCardCompany)
router.get('/validations/gift-card', giftCardController.GetAllWatingValidations)

module.exports = router
