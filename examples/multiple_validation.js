const builder = require('botbuilder');
const formFlow = require('botbuilder-formflow');


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
