const formFlow = require('../botbuilder-formflow');
const unit = require('botbuilder-unit');

module.exports = function (bot, fileName, done) {
  let config = require('./flows/' + fileName);
  let flow = formFlow.create(bot, '/test', config);
  bot.dialog('/', [
    (session) => {
      session.beginDialog('/test');
    }, (session, result) => {
      session.endDialog(JSON.stringify(result.response));
    }]);
  let messages = require('./scripts/' + fileName.replace('Form', 'Script'));
  unit(bot, messages).then( done );
}