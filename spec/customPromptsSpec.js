const botTester = require('./botTester');
const botFactory = require('./botFactory');
const loadFlow = require('./loadForm');
const builder = require('botbuilder');
const formFlow = require('../botbuilder-formflow');

describe('Tests for custom prompts', function () {
  let bot = null;
  beforeEach(function () {
    bot = botFactory.create();
    jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000;
  });
  it('Test for custom validators, prompts and extractor', function (done) {
    loadFlow(bot, 'customPrompts/customForm', done);
  });
  it('Test that subdialogs supported', function (done) {

    let config = require('./flows/customPrompts/subdialogForm.js');
    formFlow.create(bot, '/test', config);
    bot.dialog('/', [
      (session) => {
        session.beginDialog('/test')
      },
      (session, result) => session.endDialog(JSON.stringify(result.response))
    ]);

    bot.dialog('/getUserName', [
      (session) => builder.Prompts.text(session, 'Please enter your login'),
      (session,response) => {
        session.send(`Your login is ${response.response}`);
        session.endDialogWithResult( response);
      }
    ]);
    let messages = require('./scripts/customPrompts/subdialogScript');
    botTester.testBot(bot, messages, done);
  });
});