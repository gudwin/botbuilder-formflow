const constants = require('./src/constants');
const MenuDialog = require('./src/custom/MenuDialog');
const MenuPrompt = require('./src/custom/MenuPrompt');
const SwitchDialog = require('./src/custom/SwitchDialog');
const messaging = require('./src/messaging');
const matchItem = require('./src/matchItem');
const PromptDialogs = require('./src/PromptDialogs');
const getFormFlowWrapper = require('./src/getFormFlowWrapper');
const EventEmitter = require('events');

const library = new EventEmitter();

library.SwitchDialog = SwitchDialog;
library.MenuDialog = MenuDialog;
library.MenuPrompt = MenuPrompt;
library.constants = constants;

/**
 * DEPRECATED since 0.5 version
 * @type {string[]}
 */
library.SupportedTypes = PromptDialogs.SUPPORTED_TYPES;

library.create = function (bot, dialogName, config) {
  let formFlow = getFormFlowWrapper(library, bot, config);
  bot.dialog(dialogName, formFlow);
  return formFlow;
};

library.on(constants.BUILD_FIELD_DIALOG_EVENT, (bot, id, stepConfig, steps) => {
  if (matchItem(stepConfig, 'dialog', () => Array.isArray(stepConfig.dialog))) {
    stepConfig.dialog.forEach((item) => steps.push(item));
  } else if (messaging.isMessaging(stepConfig)) {
    steps.push(messaging.processMessage(stepConfig));
  } else if (PromptDialogs.isPrompt(stepConfig)) {
    PromptDialogs(id, stepConfig).forEach((step) => steps.push(step));
  }
});
library.on(constants.BUILD_FIELD_DIALOG_EVENT, SwitchDialog.factory)
library.on(constants.BUILD_FIELD_DIALOG_EVENT, MenuDialog.factory)

module.exports = library;