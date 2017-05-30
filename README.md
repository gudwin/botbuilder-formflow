# botbuilder-formflow
Form flow support for Microsoft Bot Framework. 

Unfortunately, this document still in a progress. Please use tests as a documentation for now. 

Tests located at **spec/**** folder. 

## Supported prompts

+ choices  
+ confirm
+ dialog 
+ email
+ number
+ text
+ time
+ url
+ custom validator 
  
## Usage Example

```javascript
const builder = require('botbuilder');
const formFlow = require('./botbuilder-formflow');
let loginForm = [
  {
    "type": "text",
    "id": "login",
    "prompt": "Please enter your login",
    "errorPrompt": "Error, Please enter your login",
    "response": "Your login is %s"
  },
  {
    "type": "text",
    "id": "password",
    "prompt": "Please enter your password",
    "errorPrompt": "Minimal password length is six symbols. Please re-enter password",
    "validator": function (session, response, itemConfig, next) {
      return response.response.length >= 6;
    },
    "response": "Your password is %s"
  },
  {
    "type" : "dialog",
    "id" : "custom_dialog",
    "dialog" : [
      function (session,args, next) {
        session.send('Hey, you are in a subdialog! ')
        session.send('In subdialogs you can inject your own logic')
        next()
      },
      function ( session ) {
        session.endDialog('Exiting the subdialog');
      }
    ]
  },
  {
    "type": "email",
    "id": "email",
    "prompt": "Please enter your email",
    "errorPrompt": "Error, Please enter your email",
    "response": "Your email is %s"
  }
];

let connector = new builder.ConsoleConnector().listen();
let bot = new builder.UniversalBot(connector);


bot.dialog('/', [
  function ( session ) {
    session.send('Please instert your credentials ')
    session.beginDialog('/form')
  },
  function (session, args ) {
    session.endDialog( JSON.stringify(args));
  }
]);
formFlow.create(bot, '/form', loginForm );
```

## Installation

```
    npm install --save botbuilder-formflow
```

## Tests
 
```
    npm test
```
