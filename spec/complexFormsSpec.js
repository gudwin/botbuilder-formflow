const botTester = require('./botTester');
const botFactory = require('./botFactory');
const loadFlow = require('./loadForm');
const formFlow = require('../botbuilder-formflow');

describe('Tests for complex forms', function () {
  let bot = null;
  beforeEach(function () {
    bot = botFactory.create();
    jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000;
  });
  it('Test that forms with multiple prompts supported', function (done) {
    loadFlow(bot, 'complexDialogs/loginForm', done);
  });
  it('Test that prepolutated data supported', function (done) {
    let config = require('./flows/complexDialogs/loginForm.js');
    let flow = formFlow.create(bot, '/test', config);
    bot.dialog('/', [
      (session) => {
        session.beginDialog('/test', {
          "login": "Anonymous",
          "email": "email@email.com"
        });
      }, (session, result) => {
        session.endDialog(JSON.stringify(result.response));
      }]);
    let messages = require('./scripts/complexDialogs/partiallyFilledScript');
    botTester.testBot(bot, messages, done);
  });

});