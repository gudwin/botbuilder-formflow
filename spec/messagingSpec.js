const botFactory = require('./botFactory');
const loadFlow = require('./loadForm');

describe('Test basic messaging features', function () {
  let bot = null;
  beforeEach(function () {
    bot = botFactory.create();
    jasmine.DEFAULT_TIMEOUT_INTERVAL = 5000;
  });

  it('Test sending messages', function (done) {
    loadFlow(bot, 'messaging/messageForm', done);
  });
  it('Test ending conversation', function (done) {
    loadFlow(bot, 'messaging/endConversationForm', done);
  });
});