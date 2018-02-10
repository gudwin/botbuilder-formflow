const FormFlow = require('../../../botbuilder-formflow');

module.exports = [
  new FormFlow.MenuDialog({
    "prompt": "Menu items",
    "items" : {
      'Menu 0' : '/menu0',
      'Menu 1' : '/menu1'
    }
  })
]