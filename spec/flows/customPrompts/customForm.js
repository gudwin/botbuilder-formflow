const builder = require('botbuilder');
let acceptedValues = ['prefix123', 'prefix234', 'prefix345'];
module.exports = [
  {
    "type": "text",
    "id": "value",
    "prompt": function (session, itemConfig, promptMessage, next) {
      builder.Prompts.text(session,'Type prefix123 or prefix234 or prefix345');
    },
    errorPrompt: 'Please type one of these values prefix123, prefix234, prefix345',
    "validator": function (session, response, itemConfig, next) {
      return acceptedValues.lastIndexOf(response.response) >= 0;
    },
    "response": function (session, itemConfig, response) {
      let value = response.response.split('prefix')[1];
      session.send(`You selected ${value}`);
    },
    "extractor": function (session, response) {
      let value = response.response.split('prefix')[1];
      return value;
    }
  }
];