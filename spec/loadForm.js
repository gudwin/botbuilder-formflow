const formFlow = require('../botbuilder-formflow');
const botTester = require('./botTester');

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
  botTester.testBot(bot, messages, done);
}