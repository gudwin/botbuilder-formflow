const FormFlow = require('../../../botbuilder-formflow');


module.exports = [
  new FormFlow.MenuDialog({
    "id" : "menu",
    "prompt": "Menu items",
    "items" : {
      'default value' : '/menu0',
      'with value' : function (session) {
        session.endDialogWithResult({
          response : 'Hello World!'
        })
      }
    }
  })
]