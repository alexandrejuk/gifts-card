require('dotenv').config({})
const Express = require('express')
const bodyParser = require('body-parser')
const cors = require('cors')
const morgan = require('morgan')
const multer = require('multer')

const app = Express()

const AuthenticationRoutes = require('./routes/authentication')
const { AuthenticationController } = require('./controllers')

const companyRoutes = require('./routes/company')
const userRoutes = require('./routes/user')
const creditRoutes = require('./routes/credit')
const giftCardRoutes = require('./routes/giftCard')
const giftCardActivatedRoutes = require('./routes/activated')
const giftCustomerRoutes = require('./routes/gift')
const registerRoutes = require('./routes/register')

const baseUrl = '/api'

const upload = multer({
  dest: './uploads/',
})

app.use(cors({ origin: "*" }))
app.use(morgan('dev'))
app.use(bodyParser.text())
app.use(bodyParser.json())
app.use(bodyParser.json({ type: 'application/json' }))
app.use(bodyParser.urlencoded({ extended: true }))

// uploadfile
app.post('/upload', upload.array('file'), async (req, res) => {
  res.send({
    upload: true,
    files: req.files,
  })
})

// unprotected
app.use('/activated', giftCardActivatedRoutes)
app.use('/customer', giftCustomerRoutes)
app.use('/credentials', registerRoutes)

app.use('/auth', AuthenticationRoutes)
app.use(baseUrl, AuthenticationController.checkToken)
app.use(baseUrl, companyRoutes)
app.use(baseUrl, userRoutes)
app.use(baseUrl, creditRoutes)
app.use(baseUrl, giftCardRoutes)

module.exports = app
