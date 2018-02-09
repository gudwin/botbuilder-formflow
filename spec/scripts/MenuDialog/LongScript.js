const botbuilder = require('botbuilder');

module.exports = [
  {user : 'hi'},
  {
    bot : "Menu items",
    suggestedActions : [
      botbuilder.CardAction.imBack(null, "menu 0", "menu 0"),
      botbuilder.CardAction.imBack(null, "menu 1", "menu 1"),
      botbuilder.CardAction.imBack(null, "exit", "exit"),
      botbuilder.CardAction.imBack(null, "menu 3", "menu 3"),
      botbuilder.CardAction.imBack(null, "->", "->")
    ]
  },
  {user : "->"},
  {
    bot : "Menu items",
    suggestedActions : [
      botbuilder.CardAction.imBack(null, "<-", "<-"),
      botbuilder.CardAction.imBack(null, "menu 4", "menu 4"),
      botbuilder.CardAction.imBack(null, "menu 5", "menu 5"),
      botbuilder.CardAction.imBack(null, "help", "help")
    ]
  },

  {user : "<-"},
  {
    bot : "Menu items",
    suggestedActions : [
      botbuilder.CardAction.imBack(null, "menu 0", "menu 0"),
      botbuilder.CardAction.imBack(null, "menu 1", "menu 1"),
      botbuilder.CardAction.imBack(null, "exit", "exit"),
      botbuilder.CardAction.imBack(null, "menu 3", "menu 3"),
      botbuilder.CardAction.imBack(null, "->", "->")
    ]
  },
  {"user" : 'menu 3'},
  {"bot" : "Menu Output 3"},
  {"user" : "hi"},
  {
    bot : "Menu items",
    suggestedActions : [
      botbuilder.CardAction.imBack(null, "menu 0", "menu 0"),
      botbuilder.CardAction.imBack(null, "menu 1", "menu 1"),
      botbuilder.CardAction.imBack(null, "exit", "exit"),
      botbuilder.CardAction.imBack(null, "menu 3", "menu 3"),
      botbuilder.CardAction.imBack(null, "->", "->")
    ]
  },
  {user : "exit"},
  {endConversation: true}
];
