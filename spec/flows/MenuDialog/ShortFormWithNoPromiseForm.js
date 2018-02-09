const FormFlow = require('../../../botbuilder-formflow');


module.exports = [
  new FormFlow.MenuDialog({
    "prompt": "Menu items",
    "items" : function () {
      return null;
    }
  })
]