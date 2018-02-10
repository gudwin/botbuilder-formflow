const botbuilder = require('botbuilder');

module.exports = [
  {user : 'hi'},
  {
    bot : "Menu items",
    suggestedActions : [
      botbuilder.CardAction.imBack(null, "default value", "default value"),
      botbuilder.CardAction.imBack(null, "with value", "with value")
    ]
  },
  {user : "default value"},
  {bot: "Response - true"},
  {user : 'hi'},
  {
    bot : "Menu items",
    suggestedActions : [
      botbuilder.CardAction.imBack(null, "default value", "default value"),
      botbuilder.CardAction.imBack(null, "with value", "with value")
    ]
  },
  {user : 'with value'},
  {bot: "Response - Hello World!"}
];
