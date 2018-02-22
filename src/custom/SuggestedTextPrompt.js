const formFlowConsts = require('../consts');
const MenuPrompt = require('./MenuPrompt');
const botbuilder = require('botbuilder');
function SuggestedTextPrompt(config) {
  this.type = 'dialog';
  this.bot = null;
  this.dialog = [];
  this.suggestedItems  = null;
  for (var key in config) {
    if (config.hasOwnProperty(key)) {
      this[key] = config[key];
    }
  }
  if (!config.items) {
    throw ('Failed to instantinate SuggestedTextPrompt - property "items" undefined!')
  }
}

SuggestedTextPrompt.prototype.initialize = function (bot, dialogId, config) {
  config = Object.assign({}, config);
  let promptDialogId = 'MenuPrompt_' + dialogId;
  bot.dialog(promptDialogId, new MenuPrompt());
  this.dialog = [
    (session) => {
      this.resolveItems(config,session)
        .then((items) => {
          config.items = items;
          if ( this.isEmptyItems(items )) {
            session.endDialog();
          }
          if (!config.retryPrompt) {
            config.retryPrompt = config.prompt;
          }
          session.beginDialog(promptDialogId, config);
        })
        .catch((error) => {
          session.logger.log(session.dialogStack(), error);
          session.send(botbuilder.Prompt.gettext(session, 'default_error', formFlowConsts.SYSTEM_NAMESPACE));
          session.endConversation();
        })

    },
    (session, args) => {
      session.beginDialog(args.response);
    },
    (session, args) => {
      session.endDialogWithResult(args);
    }
  ];


}
SuggestedTextPrompt.prototype.isEmptyItems = function ( items ) {
  for (let key in items ) {
    if ( items.hasOwnProperty(key)) {
      return false;
    }
  }
  return true;
}
SuggestedTextPrompt.prototype.resolveItems = function (options,session) {
  if (this.resolvedItems != null) {
    return Promise.resolve(this.resolvedItems);
  }
  let promise = null;
  if ("undefined" == typeof options.items) {
    throw new Error("MenuPrompt.items mandatory attribute")
  }
  if ("function" == typeof options.items) {
    promise = options.items.call(null,session);
    if (!(promise instanceof Promise)) {
      throw new Error("MenuPrompt.items callback must return a Promise");
    }
  } else {
    promise = Promise.resolve(options.items)
  }
  return promise;
}
module.exports = SuggestedTextPrompt;