# botbuilder-formflow
Form flow support for Microsoft Bot Framework. 

Unfortunately, I'm still struggling with myself over this documentation. 
Please use tests as a documentation for now. 

Tests located at **spec/**** folder.
 
## Glossary 

- **MBB** or **BotBuilder** - Microsoft Bot Builder Framework;
- **FormFlow Form** - as mentioned in [MBF documentation for .NET](https://docs.microsoft.com/en-us/bot-framework/dotnet/bot-builder-dotnet-formflow). 
Dialogs are very powerful and flexible, but handling a guided conversation 
such as ordering a sandwich can require a lot of effort. At each point in 
the conversation, there are many possibilities of what will happen next. 
For example, you may need to clarify an ambiguity, provide help, go back, 
or show progress. By using FormFlow within the Bot Builder SDK for .NET, 
you can greatly simplify the process of managing a guided conversation like this. 
Typical form flows: registration form, authentification form and etc
- **FormFlow Field** - a single attribute in FormFlow Form result. Could identify
a request for required value (with corresponding validator) or a route to 
another dialog or could be fully customized ( When attributes prompt, errorPrompt, validator, extractor defined)
 
- **Waterwall** - A waterfall is a specific type of dialog handler. A waterfall 
contains an array of functions where the results of the first function are 
passed as input to the next function and so on. [Official documentation](https://docs.microsoft.com/en-us/bot-framework/nodejs/bot-builder-nodejs-dialog-waterfall)

- **Prompt** - A built-in dialogs to simplify collecting input from a user. 
They return the user's response by calling session.endDialogWithresult(). 
[Official documentation](https://docs.microsoft.com/en-us/bot-framework/nodejs/bot-builder-nodejs-dialog-prompt) 

## Overview 

So, this Library will allow your bot to request information about complex forms from user. 
The Library helps to build a waterfall dialog that will handle the whole 
form flow. It will split a complex form in a list of fields. Each field evaluated separately 
and could be fully customized.
The Library features:
- Standard Prompts plus prompts for emails and urls;
- Validators, Prompts, Error Prompts and Value extractors could be customized by users;
- Support for subdialogs;
  
The Library provides a factory function `create` used to create FormFlows forms. 
This function will create and inject a Waterfall dialog into a bot.
Typical usage:
`formFlow.create(bot, '/form', exchangeForm);` 
Where:
- *bot* is an actual instance of [UniversalBot](https://docs.botframework.com/en-us/node/builder/chat-reference/classes/_botbuilder_d_.universalbot.html)
- *'/form'* - a Id for FormFlow dialog
- *echangeForm* - an array, each item contains a config for a result form field;
   
Every item in the array mentioned above should have at least two attribute: id and type: 
- *id* attribute used to identify a value in a form result. 
- *type* attribute used to identify validators and business logic

## Types
Every type could bring its own default validation, custom behaviour and 
could require additional attributes.
- **choices** - A wrapper around [builder.Prompt.choice](https://docs.botframework.com/en-us/node/builder/chat-reference/interfaces/_botbuilder_d_.__global.iprompts.html#choice) Prompt. 
Required attributes:
-- choices (string | Object | string[] | IChoice[]), Explained in [function arguments](https://docs.botframework.com/en-us/node/builder/chat-reference/interfaces/_botbuilder_d_.__global.iprompts.html#choice);
- **confirm** - A wrapper around [builder.Prompts.confirm](https://docs.botframework.com/en-us/node/builder/chat-reference/interfaces/_botbuilder_d_.__global.iprompts.html#confirm) Prompt;
- **dialog** - Allows to redirect flow execution to an external dialog
Required attributes:
-- dialog (String|Array|Function) a route to a dialog or a constructor for Waterfall dialog;
for Waterfall dialog
- **email** - A wrapper around `/^\S+@\S+$/` RegExp
- **number** - A wrapper around [builder.PromptRecognizers.recognizeNumbers()](https://docs.botframework.com/en-us/node/builder/chat-reference/interfaces/_botbuilder_d_.ipromptrecognizenumbersoptions.html) internal BotBuilder function;
- **text** - A wrapper around [builder.Prompts.text](https://docs.botframework.com/en-us/node/builder/chat-reference/interfaces/_botbuilder_d_.__global.iprompts.html#text) Prompt;
- **time** - A wrapper around [botbuilder.PromptRecognizers.recognizeTimes](https://docs.botframework.com/en-us/node/builder/chat-reference/interfaces/_botbuilder_d_.ipromptrecognizetimesoptions.html) internal BotBuilder function;
- **url** - A wrapper around `/^(ftp|http|https):\/\/[^ "]+$/` RegExp


 
## Example

### #1 Simple registration form

```javascript
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
    "response": "Your password is %s"
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

```

### #2 Custom field validation
 
```javascript
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

```
### #3 Form with subform 

```javascript
const builder = require('botbuilder');
const formFlow = require('../botbuilder-formflow');
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

```
### #4 List of validators for specific fields 

```javascript
const builder = require('botbuilder');
const formFlow = require('../../botbuilder-formflow');


let exchangeForm = [
  {
    "type": "text",
    "id": "currency",
    "prompt": "Please, enter an amount to exchange (103.45 USD or 0.05 BTC)",
    // Please take in errorPrompt could be a string, callback or an object
    // In case of object it is expected that all keys from validator object will have matching key in errorPrompt object
    // Additionally, key @default must be configured. `@default` attribute exposes message for a default type validator
    "errorPrompt": {
      "format": "Invalid format (Exaples: 103.45 USD or 0.05 BTC)",
      // Error message could also be returned by callback, Promises yet not supported
      "currency": function (session, response, itemConfig) {
        return "Wrong currency name (USD or BTC allowed)"
      },
      "not_a_number": "I can't recognize a number",
      "someRemoteValidation": "Unfortunately, we just found that only BTC accepted right now",
      "@default": 'Please enter a value'
    },
    "validator": {
      "format": function (session, response, itemConfig) {
        let values = response.response.trim().split(' ');
        return values.length == 2;
      },
      "currency": function (session, response, itemConfig) {
        let values = response.response.trim().split(' ');
        return ['USD', 'BTC'].lastIndexOf(values[1].toUpperCase()) > -1;
      },

      "not_a_number": function (session, response, itemConfig) {
        let values = response.response.trim().split(' ');
        return !Number.isNaN(parseFloat(values[0]));
      },
      // Sample validator func that returns a Promise
      "someRemoteValidation": function (session, response, itemConfig, errorPrompt) {
        return new Promise(function (resolve, reject) {
          setTimeout(function () {
            let currency = response.response.trim().split(' ')[1].toUpperCase();
            if (currency == 'BTC') {
              resolve(true);
            } else {
              reject(errorPrompt);
            }
          }, 10);
        });
      }
    },
    "extractor": function (session, response, itemConfig) {
      let values = response.response.trim().split(' ');
      return {
        "amount": parseFloat(values[0]),
        "currency": values[1]
      }
    }
  }
]


let connector = new builder.ConsoleConnector().listen();
let bot = new builder.UniversalBot(connector);
bot.dialog('/', [
  session => session.beginDialog('/form'),
  (session, response) => session.endDialog(`Form result: ${JSON.stringify(response.response)}`)
]);
formFlow.create(bot, '/form', exchangeForm);

console.log('To start exchange flow press [[ENTER]]');

```
## Installation

```
    npm install --save botbuilder-formflow
```

## Tests
 
```
    npm test
```
