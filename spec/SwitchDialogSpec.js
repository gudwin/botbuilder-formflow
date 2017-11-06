const botFactory = require('./botFactory');
const loadFlow = require('./loadForm');
const builder = require('botbuilder');

describe('Tests for Switch Dialog', function () {
  let bot = null;
  beforeEach(function () {
    bot = botFactory.create();
    jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000;
    bot.dialog('/add', [
      (session) => {
        builder.Prompts.text(session, 'What do you want to add?')
      },
      (session, response) => {
        session.endDialogWithResult(response);
      }
    ])
  });
  it('Test that dialog able to produce dialogs and return actual value', function (done) {
    loadFlow(bot, 'SwitchDialogForm', done);
  });


});