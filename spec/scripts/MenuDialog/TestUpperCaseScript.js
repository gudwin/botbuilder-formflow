const botbuilder = require('botbuilder');

module.exports = [
  {user : 'hi'},
  {
    bot : "Menu items",
    suggestedActions : [
      botbuilder.CardAction.imBack(null, "Menu 0", "Menu 0"),
      botbuilder.CardAction.imBack(null, "Menu 1", "Menu 1"),
    ]
  },
  {user : "menu 0"},
  {bot: "Menu Output 0"},
  {user : 'hi!'},
  {bot : "Menu items"},
  {user : "menu 1"},
  {bot: "Menu Output 1"}
];
