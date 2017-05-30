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
    loadFlow(bot, 'complexPrompts/loginForm', done);
  });
  it('Test that prepolutated data supported', function (done) {
    let config = require('./flows/complexPrompts/loginForm.js');
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
    let messages = require('./scripts/complexPrompts/partiallyFilledScript');
    botTester.testBot(bot, messages, done);
  });
  it('That all types ready to be prepopulated', function (done) {
    let config = require('./flows/complexPrompts/filledForm.js');
    let flow = formFlow.create(bot, '/test', config);
    bot.dialog('/', [
      (session) => {
        session.beginDialog('/test', {
          "choice": "beauty",
          "confirm": false,
          "dialog": "Hello from prepopulated data",
          "email": "email@email.com",
          "number": 123,
          "text": "Hello world!",
          "time": new Date("2001-01-01 00:00:00"),
          "url" : "https://example.com/"
        });
      }, (session, result) => {
        session.endDialog(JSON.stringify(result.response));
      }]);
    let messages = require('./scripts/complexPrompts/filledScript');
    botTester.testBot(bot, messages, done);
  })
});