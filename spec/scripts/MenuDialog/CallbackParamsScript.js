const botbuilder = require('botbuilder');

module.exports = [
  {user : 'hi'},
  {
    bot : "Menu items",
    suggestedActions : [
      botbuilder.CardAction.imBack(null, "User1", "User1"),
    ]
  },
  {user : "User1"},
  {bot: "Menu Output 0"},
];
