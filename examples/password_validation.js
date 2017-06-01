const builder = require('botbuilder');
const formFlow = require('../../botbuilder-formflow');

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
    "errorPrompt": ["Minimal password length is 6 symbols", "Please re-enter password"],
    "response": "Your password is %s",
    "validator": (session, response) => response.response.length >= 6,
  }
];


let connector = new builder.ConsoleConnector().listen();
let bot = new builder.UniversalBot(connector);
bot.dialog('/', [
  session => session.beginDialog('/form'),
  (session, response) => session.endDialog(`Form result: ${JSON.stringify(response.response)}`)
]);
formFlow.create(bot, '/form', signupForm);

console.log('To start registration flow press [[ENTER]]');
