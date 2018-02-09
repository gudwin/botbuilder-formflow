const botFactory = require('./botFactory');
const formFlow = require('../botbuilder-formflow');
const unit = require('botbuilder-unit');
describe('Testing MenuDialog', function () {
  let bot = null;

  beforeEach( (done) => {
    bot = botFactory.create();
    bot.dialog('/menu0', (session) => {
      session.endDialog('Menu Output 0');
    });
    bot.dialog('/menu1', (session) => {
      session.endDialog('Menu Output 1');
    });
    bot.dialog('/menu2', (session) => {
      session.endDialog('Menu Output 2');
    });
    bot.dialog('/menu3', (session) => {
      session.endDialog('Menu Output 3');
    });
    bot.dialog('/help', (session) => {
      session.endDialog('Help');
    });
    done();
  });

  it('Testing short form',(done) => {
    let flow = require('./flows/MenuDialog/ShortForm');
    let messages = require('./scripts/MenuDialog/ShortScript');
    formFlow.create(bot, '/', flow);
    unit(bot, messages).then( function () {
      done();
    });
  });
  it('Testing long form',(done) => {
    let flow = require('./flows/MenuDialog/LongForm');
    let messages = require('./scripts/MenuDialog/LongScript');
    formFlow.create(bot, '/', flow);
    unit(bot, messages).then( done );
  });
  it('Testing callbacks, promise MUST be returned',(done) => {
    let flow = require('./flows/MenuDialog/ShortFormWithNoPromiseForm');
    let messages = require('./scripts/MenuDialog/ShortFormWithNoPromiseScript');
    formFlow.create(bot, '/', flow);
    unit(bot, messages).then( done );
  });
  it('Testing callbacks, if promise rejected raising an error',(done) => {
    let flow = require('./flows/MenuDialog/ShortFormWithWithRejectedPromiseForm');
    let messages = require('./scripts/MenuDialog/ShortFormWithWithRejectedScript');
    formFlow.create(bot, '/', flow);
    unit(bot, messages).then( done );
  });
  it('Testing callbacks, promise must return key-value',(done) => {
    let flow = require('./flows/MenuDialog/ShortFormWithCallbackForm');
    let messages = require('./scripts/MenuDialog/ShortFormWithCallbackScript');
    formFlow.create(bot, '/', flow);
    unit(bot, messages).then( done );
  });
})