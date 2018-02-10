const botFactory = require('./botFactory');
const formFlow = require('../botbuilder-formflow');
const unit = require('botbuilder-unit');
describe('Testing MenuDialog', function () {
  let bot = null;

  let pushDialogs = function (dialogs) {
    for (let key in dialogs ) {
      if ( !dialogs.hasOwnProperty(key)) {
        continue;
      }
      bot.dialog(key, dialogs[key]);
    }
  }
  let defaultDialogs = function ( ) {
    pushDialogs({
      '/menu0' : (session) => {
        session.endDialog('Menu Output 0');
      },
      '/menu1' : (session) => {
        session.endDialog('Menu Output 1');
      },
      '/menu2' : (session) => {
        session.endDialog('Menu Output 2');
      },
      '/menu3' : (session) => {
        session.endDialog('Menu Output 3');
      },
      '/help' : (session) => {
        session.endDialog('Help');
      },
    })
  }
  beforeEach( (done) => {
    bot = botFactory.create();
    done();
  });
  let testFlow = function ( baseName, done,reject ) {
    if ( !reject) {
      reject = function () {
        fail('Impossible case');
        done();
      }
    }
    let scriptName = `./scripts/MenuDialog/${baseName}Script`;
    let formName = `./flows/MenuDialog/${baseName}Form`;
    let flow = require(formName);
    formFlow.create(bot, '/', flow);
    let messages = require(scriptName);
    unit(bot, messages).then(done,reject);
  }

  it('Testing short form',(done) => {
    defaultDialogs();
    testFlow('Short',done);

  });
  it('Testing long form',(done) => {
    defaultDialogs();
    testFlow('Long', done);

  });
  it('Testing callbacks, promise MUST be returned',(done) => {
    defaultDialogs();
    testFlow('ShortFormWithNoPromise', done);
  });
  it('Testing callbacks, if promise rejected raising an error',(done) => {
    defaultDialogs();
    testFlow('ShortFormWithWithRejectedPromise', done);
  });
  it('Testing callbacks, promise must return key-value',(done) => {
    defaultDialogs();
    testFlow('ShortFormWithCallback', done);
  });
  it('Testing with no choices (Should exit silently)', (done) => {
    let baseName = 'EmptyChoices';
    let scriptName = `./scripts/MenuDialog/${baseName}Script`;
    let formName = `./flows/MenuDialog/${baseName}Form`;
    let flow = require(formName);
    formFlow.create(bot, '/form', flow);
    bot.dialog('/',[
      (session) => {
        session.beginDialog('/form');
      },
      (session, args) => {
        session.endDialog('Exiting menu');
      }
    ]);
    let messages = require(scriptName);
    unit(bot, messages).then(done);
  });

  it('Testing callbacks, should return response',(done) => {
    let baseName = 'ResponseValue';
    let scriptName = `./scripts/MenuDialog/${baseName}Script`;
    let formName = `./flows/MenuDialog/${baseName}Form`;
    let flow = require(formName);

    formFlow.create(bot, '/form', flow);
    bot.dialog('/',[
      (session) => {
        session.beginDialog('/form');
      },
      (session, args) => {
        session.endDialog(`Response - ${args.response.menu.toString()}`);
      }
    ]);
    bot.dialog('/menu0', (session) => {
      session.endDialog();
    })
    bot.dialog('/menu1', (session) => {
      session.endDialogWithResult({response : 'Hello world!'});
    })
    let messages = require(scriptName);
    unit(bot, messages).then(done);
  });
  it('Testing submenu', (done) => {
    bot.dialog('/submenu1', (session) => {
      session.endDialog('You are in submenu');
    })
    testFlow('Submenu', done);
  })
})