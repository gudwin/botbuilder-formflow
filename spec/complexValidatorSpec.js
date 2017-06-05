
const botFactory = require('./botFactory');
const loadFlow = require('./loadForm');


describe('Tests for complex validators in forms', function () {
  let bot = null;
  beforeEach(function () {
    bot = botFactory.create();
    jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000;
  });
  it('Test that forms with multiple prompts supported', function (done) {
    loadFlow(bot, 'complexValidatorPrompts/currencyExchangeForm', done);
  });

});