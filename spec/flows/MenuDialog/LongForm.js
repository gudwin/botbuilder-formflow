const FormFlow = require('../../../botbuilder-formflow');

module.exports = [
  new FormFlow.MenuDialog({
    "prompt": "Menu items",
    "items_per_message" : 5,
    "prevLabel" : "<-",
    "nextLabel" : "->",
    "items" : {
      'menu 0' : '/menu0',
      'menu 1' : '/menu1',
      'exit' : [function (session ) {
        session.endConversation()
      }],
      'menu 3' : '/menu3',
      'menu 4' : '/menu4',
      'menu 5' : '/menu5',
      'help' : '/help'
    }
  })
]