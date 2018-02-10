const botbuilder = require('botbuilder');

module.exports = [
  {user : 'hi'},
  {
    bot : "Menu items",
    suggestedActions : [
      botbuilder.CardAction.imBack(null, "submenu", "submenu"),
    ]
  },
  {user : "submenu"},
  {
    bot : "SubMenu items",
    suggestedActions : [
      botbuilder.CardAction.imBack(null, "submenu 0", "submenu 0"),
      botbuilder.CardAction.imBack(null, "submenu 1", "submenu 1")
    ]
  },
  {user : 'submenu 1'},
  {bot: "You are in submenu"}
];
