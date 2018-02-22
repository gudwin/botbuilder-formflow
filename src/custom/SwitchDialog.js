const matchItem = require('../matchItem');

const botbuilder = require('botbuilder');
const uuid = require('node-uuid');

function SwitchDialog(config) {
  this.type = 'dialog';
  this.bot = null;
  this.dialog = [];
  for (var key in config) {
    if (config.hasOwnProperty(key)) {
      this[key] = config[key];
    }
  }
  if (!config.choices) {
    throw ('Failed to instantinate SwitchDialog - property "choices" undefined!')
  }
  if (!config.prompt) {
    throw ('Failed to instantinate SwitchDialog - property "prompt" undefined!')
  }

}
SwitchDialog.prototype.initialize = function (bot, dialogId, config) {
  this.bot = bot;
  this.dialog = this.buildDialog();
}
SwitchDialog.prototype.buildDialog = function () {
  let dialogChoices = {};
  for (let key in this.choices) {
    if (this.choices.hasOwnProperty(key)) {
      dialogChoices[key] = this.choices[key];
      if (Array.isArray(this.choices[key])) {
        let dialogName = `'SwitchDialog${uuid.v4()}`;
        this.bot.dialog(dialogName, this.choices[key]);
        dialogChoices[key] = dialogName;
      }
    }
  }
  return [
    (session) => {
      botbuilder.Prompts.choice(session, this.prompt, dialogChoices, {
        listStyle: botbuilder.ListStyle.button,
        retryPrompt: this.errorPrompt ? this.errorPromp : this.prompt
      });
    },
    (session, response) => {
      let dialogId = dialogChoices[response.response.entity];
      if (dialogId) {
        session.beginDialog(dialogId);
      }
    },
    (session, response) => {
      session.endDialogWithResult(response);
    }
  ]
}
SwitchDialog.factory = function (bot, id, stepConfig, steps) {
  if (matchItem(stepConfig, 'switch-dialog', () => true)) {
    let dialog = new SwitchDialog(stepConfig);
    dialog.initialize(bot, id, stepConfig )
    dialog.dialog.forEach(steps.push);
  } else if ( stepConfig instanceof SwitchDialog ) {
    stepConfig.initialize(bot, id, stepConfig );
    stepConfig.dialog.forEach((item) => {
      steps.push(item)
    });
  }
}

module.exports = SwitchDialog;