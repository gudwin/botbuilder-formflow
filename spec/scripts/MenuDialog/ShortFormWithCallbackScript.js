const botbuilder = require('botbuilder');

module.exports = [
  {user : 'hi'},
  {
    bot : "Menu items",
    suggestedActions : [
      botbuilder.CardAction.imBack(null, "menu 0", "menu 0"),
      botbuilder.CardAction.imBack(null, "menu 1", "menu 1"),
      botbuilder.CardAction.imBack(null, "menu 2", "menu 2"),
      botbuilder.CardAction.imBack(null, "menu 3", "menu 3")
    ]
  },
  {user : "Menu 0"},
  {bot: "Menu Output 0"},
  {user : 'hi!'},
  {bot : "Menu items"},
  {user : "Menu 3"},
  {bot: "Menu Output 3"}
];
