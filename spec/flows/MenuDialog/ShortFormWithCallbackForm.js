const FormFlow = require('../../../botbuilder-formflow');


module.exports = [
  new FormFlow.MenuDialog({
    "prompt": "Menu items",
    "items" : function () {
      return Promise.resolve({
        'menu 0' : '/menu0',
        'menu 1' : '/menu1',
        'menu 2' : '/menu2',
        'menu 3' : '/menu3'
      });
    }
  })
]