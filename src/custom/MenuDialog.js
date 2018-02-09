const MenuPrompt = require('./MenuPrompt');
const botbuilder = require('botbuilder');
const uuid = require('node-uuid');
function MenuDialog(config) {
  this.type = 'dialog';
  this.bot = null;
  this.dialog = [];

  for (var key in config) {
    if (config.hasOwnProperty(key)) {
      this[key] = config[key];
    }
  }
  if (!config.items) {
    throw ('Failed to instantinate MenuDialog - property "items" undefined!')
  }
}

MenuDialog.prototype.initialize = function (bot, dialogId, config) {
  let promptDialogId = 'MenuDialog_' + dialogId;
  bot.dialog(promptDialogId, new MenuPrompt());
  this.dialog = [
    (session) => {
      config.retryPrompt =config.prompt;
      session.beginDialog( promptDialogId, config);
    },
    (session, args ) => {
      if ( args.response ) {
        session.beginDialog(args.response);
      } else {
        session.endDialogWithResult( args );
      }
    },
    (session, args ) => {
      session.endDialogWithResult( args );
    }
  ];
}
module.exports = MenuDialog;