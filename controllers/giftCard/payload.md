### Gift card
Para criar um giftCard  utilize o payload abaixo, como exemplo:

```json
// giftCardType plan
  {
    "card_expiration_date": "2022-03-21T21:10:40.391Z",
    "plan": 7,
    "giftCardType": "plan", 
    "activated": true
  }
```

```json
// giftCardType discount
  {
    "card_expiration_date": "2022-03-21T21:10:40.391Z",
    "discount": 10,
    "giftCardType": "plan", 
    "activated": true
  }
```

```json
// giftCardType amount
  {
    "card_expiration_date": "2022-03-21T21:10:40.391Z",
    "amount": 10,
    "giftCardType": "plan", 
    "activated": true
  }
```