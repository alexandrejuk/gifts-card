
const { pathOr, applySpec, map, pipe } = require('ramda')

const buildItem = values => {
  const item = applySpec({
    id: pathOr("no-id", ["pastDueCode"]),
    title: pathOr("no-id", ["company", "name"]),
    unit_price: pathOr(0, ["discountAmount"]),
    quantity: pathOr(1, ["quantity"]),
    tangible: pathOr(true, ["tangible"]),
  })(values)
  return [item]
}

const buildPhone = values => {
  return [pathOr("+5511999998888", ["phoneNumber"], values)]
}

const buildDocuments = values => {
  const document = applySpec({
    type: pathOr("cpf", ["documentType"]),
    number: pathOr(null, ["personalNumber"]),
  })(values)
  return [document]
}

const buildSplitRules = applySpec({
  recipient_id: pathOr(null,["recipient_id"]),
  amount: pathOr(null,["amount"]),
  charge_processing_fee: pathOr(true,["charge_processing_fee"]),
  liable: pathOr(true,["liable"]),
  charge_remainder: pathOr(true,["charge_remainder"]),
})

const buildTransaction = applySpec({
  amount: pathOr(0, ["discountAmount"]),
  payment_method: pathOr("boleto", ["paymentMethod"]),
  customer: applySpec({
    external_id: pathOr("no_external_id", ["personalNumber"]),
    name: pathOr("Customer without name", ["customerName"]),
    type: pathOr("individual", ["individual"]),
    country: pathOr("br", ["country"]),
    email: pathOr("kollecta@kollecta.io", ["customerEmail"]),
    documents: buildDocuments,
    phone_numbers: buildPhone,
    birthday: pathOr("1965-01-01", ["birthday"]),
  }),
  split_rules: pipe(
    pathOr([], ["splitRules"]),
    map(buildSplitRules)
  ),
  items: buildItem,
  api_key: pathOr("ak_test_jwnUVcRJ0V4k3Py6K1qniuxOFNZqvl", ["apiKey"]),
  postback_url: pathOr("http://localhost:3003/api/past-dues-postback", ["postback_url"]),
  async: pathOr(false, ["async"]),
})

const makeTransactionResponse = applySpec({
  status: pathOr(0, ["data", "status"]),
  tid: pathOr(null, ["data", "tid"]),
  boleto_url: pathOr(null, ["data", "boleto_url"]),
  boleto_barcode: pathOr(null, ["data", "boleto_barcode"]),
  boleto_expiration_date: pathOr(null, ["data", "boleto_expiration_date"]),
  pix_data: pathOr(null, ["data", "pix_data"]),
  pix_qr_code: pathOr(null, ["data", "pix_qr_code"]),
  pix_expiration_date: pathOr(null, ["data", "pix_expiration_date"]),
  activated: pathOr(true, ["activated"]),
})

module.exports = {
  buildTransaction,
  makeTransactionResponse,
}
