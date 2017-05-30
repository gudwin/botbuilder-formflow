const builder = require('botbuilder');
module.exports = [
  {
    "type": "dialog",
    "id": "login",
    "dialog": "/getUserName"
  },
  {
    "type": "dialog",
    "id": "password",
    "dialog": [
      function (session) {
        builder.Prompts.text(session, 'Please enter your password')
      },
      function (session, results) {
        session.send(`Your password is ${results.response}`);
        session.endDialogWithResult(results);
      }
    ]
  },
  {
    "type": "email",
    "id": "email",
    "prompt": "Please enter your email",
    "errorPrompt": "Error, Please enter your email",
    "response": "Your email is %s"
  },


]