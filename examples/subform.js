const builder = require('botbuilder');
const formFlow = require('botbuilder-formflow');
let subscriptionForm = [
  {
    "type": "email",
    "id": "email",
    "prompt": "Please enter your email",
    "errorPorompt": ["I can't recognize this %s email", "Do you have another one?"],
    "response": "Your email is %s"
  },
  {
    "type": "boolean",
    "id": "weeklyMagazine",
    "prompt": "Do you want to receive our weekly magazine?"
  }
];
let signupForm = [
  {
    "type": "text",
    "id": "login",
    "prompt": "Please enter your login",
    "response": "Your login is %s"
  },
  {
    "type": "text",
    "id": "password",
    "prompt": "Please enter your password",
    "response": "Your password is %s"
  },
  {
    "type": "dialog",
    "id": "subscription",
    "dialog": [
      session => builder.Prompts.confirm(session, 'Do you want to receive emails from us?'),
      (session, promptResult) => {
        if (promptResult.response) {
          session.beginDialog('/subscriptionForm')
        } else {
          session.endDialogWithResult({response: false})
        }

      }
    ]
  }
];

let connector = new builder.ConsoleConnector().listen();
let bot = new builder.UniversalBot(connector);
bot.dialog('/', [
  session => session.beginDialog('/form'),
  (session, response) => session.endDialog(`Form result: ${JSON.stringify(response.response)}`)
]);
formFlow.create(bot, '/form', signupForm);
formFlow.create(bot, '/subscriptionForm', subscriptionForm);

console.log('To start registration flow press [[ENTER]]');