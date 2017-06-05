module.exports = [
  {
    "out": "hi"
  },
  {
    "in": "Please, enter an amount to exchange (103.45 USD or 0.05 BTC)",
    "out": "Anonymous"
  },
  {
    "in": "Invalid format (Exaples: 103.45 USD or 0.05 BTC)",
    "out": "123 RUR"
  },
  {
    "in": "Wrong currency name (USD or BTC allowed)",
    "out": "bla BTC"
  },
  {
    "in": "I can't recognize a number",
    "out": "123.45 USD"
  },
  {
    "in" : "Unfortunately, we just found that only BTC accepted right now",
    "out": "123.45 BTC"
  },
  {
    "in" : "Selected 123.45 BTC"
  },
  {
    "in": "{\"currency\":{\"amount\":123.45,\"currency\":\"BTC\"}}"
  }
];