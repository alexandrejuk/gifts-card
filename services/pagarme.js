const axios = require('axios')
const { buildTransaction } = require('../utils/transactionSpec')

const transactionBaseUrl = "https://api.pagar.me/1/transactions"

const createTransaction = async (values) => {
  return await axios.post(transactionBaseUrl, buildTransaction(values))
}

module.exports = createTransaction
