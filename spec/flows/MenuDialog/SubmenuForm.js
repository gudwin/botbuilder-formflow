const FormFlow = require('../../../botbuilder-formflow');


module.exports = [
  new FormFlow.MenuDialog({
    "prompt": "Menu items",
    "retryPrompt" : "Fuck!",
    "items" : {
      'submenu' : new FormFlow.MenuDialog({
        "prompt": "SubMenu items",
        "items" : {
          'submenu 0' : '/submenu0',
          'submenu 1' : '/submenu1'
        }
      })
    }
  })
]