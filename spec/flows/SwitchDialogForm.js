const FormFlow = require('../../../botbuilder-formflow');
module.exports = [
  new FormFlow.SwitchDialog({
    id : 'subdialog',
    prompt : 'Please, select subdialog',
    choices : {
      'Add' : '/add',
      'Remove' : [
        function ( session ) {
          session.endDialogWithResult({
            "response":'Hello world!'
          });
        }
      ]
    }
  })
]