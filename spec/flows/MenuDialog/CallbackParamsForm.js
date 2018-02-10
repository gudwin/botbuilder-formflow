const FormFlow = require('../../../botbuilder-formflow');


module.exports = [
  new FormFlow.MenuDialog({
    "prompt": "Menu items",
    "items" : function (session) {
      let result = {};
      result[session.message.user.name] = '/menu0';
      return Promise.resolve(result);
    }
  })
]