const builder = require('botbuilder');
module.exports = {
  create : function () {
    let connector = new builder.ConsoleConnector().listen();
    let bot = new builder.UniversalBot();
    bot.connector('console', connector);
    return bot;
  }
}