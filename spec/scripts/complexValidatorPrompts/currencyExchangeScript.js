module.exports = [
  {
    "user": "hi"
  },
  {
    "bot": "Please, enter an amount to exchange (103.45 USD or 0.05 BTC)"
  },
  { "user": "Anonymous" },
  {
    "bot": "Invalid format (Exaples: 103.45 USD or 0.05 BTC)"
  },
  { "user": "123 RUR"},
  {
    "bot": "Wrong currency name (USD or BTC allowed)",
  },
  { "user": "bla BTC" },
  {
    "bot": "I can't recognize a number"
  },
  { "user": "123.45 USD" },
  {
    "bot" : "Unfortunately, we just found that only BTC accepted right now"
  },
  { "user": "123.45 BTC" },
  {
    "bot": "{\"currency\":{\"amount\":123.45,\"currency\":\"BTC\"}}"
  }
];