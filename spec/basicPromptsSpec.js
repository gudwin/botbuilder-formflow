const botFactory = require('./botFactory');
const loadFlow = require('./loadForm');

describe('Base tests suite for formflow', function () {
  let bot = null;
  beforeEach(function () {
    bot = botFactory.create();
    jasmine.DEFAULT_TIMEOUT_INTERVAL = 5000;
  });


  it('Test for confirm field', function (done) {
    loadFlow(bot, 'basicPrompts/confirmForm', done);
  });
  it('Test for choices field', function ( done ) {
    loadFlow(bot, 'basicPrompts/choicesForm', done);
  });
  it('Test for email field', function ( done ) {
    loadFlow(bot, 'basicPrompts/emailForm', done);
  });
  it('Test for number field', function ( done ) {
    loadFlow(bot, 'basicPrompts/numberForm', done);
  });
  it('Test for text field', function ( done ) {
    loadFlow(bot,'basicPrompts/textForm', done);
  });
  it('Test for time field', function ( done ) {
    loadFlow(bot,'basicPrompts/timeForm', done);
  });
  it('Test for URL field', function ( done ) {
    loadFlow(bot,'basicPrompts/urlForm', done);
  });

})