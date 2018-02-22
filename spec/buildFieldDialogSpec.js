const botFactory = require('./botFactory');
const formFlow = require('../');
const botTester = require('botbuilder-unit');
const CustomClassFactory = require('./lib/CustomClassFactory');

describe('BuildFieldDialog Specification', function () {
  let bot = null;
  beforeEach((done) => {
    bot = botFactory.create();
    jasmine.DEFAULT_TIMEOUT_INTERVAL = 5000;
    done();
  });
  afterEach((done) => {
    formFlow.removeListener(formFlow.BUILD_FIELD_DIALOG_EVENT, CustomClassFactory);
    done()
  })
  it('Test that error raised in case of unknown class map', function (done) {
    let config = require('./flows/buildFieldDialog/CustomClassForm');
    try {
      formFlow.create(bot, '/', config);
      fail('Impossible');
    } catch (e) {
      console.log(e);
    }
    done();
  });
  it('Test that extension mechanism works perfectly', function (done) {
    let config = require('./flows/buildFieldDialog/CustomClassForm');
    bot.injectedValue = 'my-value';
    formFlow.on(formFlow.constants.BUILD_FIELD_DIALOG_EVENT, CustomClassFactory);
    formFlow.create(bot, '/', config);
    let messages = require('./scripts/buildFieldDialog/CustomClassScript');
    botTester(bot, messages).then(() => {
      done();
    });
  });


})