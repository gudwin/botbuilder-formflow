const SupportedTypes = [
  'text',
  'number',
  'boolean',
  'confirm',
  'email',
  'time',
  'url',
  'choice',
  'dialog',
  'file',
  'attachment',
  'custom'];
const uuid = require('node-uuid');
const builder = require('botbuilder');
const buildFieldDialog = require('./src/buildFieldDialog');
const matchItem = require('./src/matchItem');
const getDefaultValidatorForType = require('./src/getDefaultValidatorForType');

const getFormFlowWrapper = function (bot, config) {
  let flow = [];
  let results = {};
  flow.push(function (session, args, next) {
    results = args ? args : {};
    next();
  });
  config.forEach((item, index, next) => {
    let dialogId = `/FormFlow_${item.id}_${uuid.v4()}`;

    flow.push((session, args, next) => {
      if ("undefined" != typeof results[item.id]) {
        next({
          resumed: builder.ResumeReason.forward,
          response: null
        });
      } else {
        session.beginDialog(dialogId);
      }
    });
    flow.push((session, response, next) => {
      if (builder.ResumeReason.forward != response.resumed) {
        if (item.id) {
          results[item.id] = response.response;
        }
      }
      next();
    });

    buildFieldDialog(bot, dialogId, item);

  });
  flow.push((session) => {
    session.endDialogWithResult({
      response: results
    });
  });
  return flow;
}

const validateConfig = function (config) {
  config.forEach((item, i) => {
    let throwError = (message) => {
      throw new Error(message + `\nObject with issues: ${JSON.stringify(item, null, 4)})`);
    }

    if (matchItem(item, 'choice', () => !item.choices)) {
      let message = `"choice" attribute MUST be defined.
Object with issues: ${JSON.stringify(item, null, 4)}`;
      throw throwError(message);
    }
    if (matchItem(item, 'dialog', () => !item.dialog)) {
      throw throwError(`Empty "dialog" property`);
    }

    let validator = {};
    if (item.validator) {
      if ("function" == typeof item.validator) {
        validator['callback'] = item.validator;
      } else {
        validator = item.validator;
      }
    }
    item.validator = Object.assign({
      '@default': getDefaultValidatorForType(item.type)
    }, validator);

    // If user typed "error" by mistake (errorPrompt should be used)
    if ( item.error && (!item.errorPrompt)) {
      item.errorPrompt = item.error;
    }
  });
}

module.exports.SupportedTypes = SupportedTypes;
module.exports.create = function (bot, dialogName, config) {
  validateConfig(config);
  let formFlow = getFormFlowWrapper(bot, config);
  bot.dialog(dialogName, formFlow);
  return formFlow;
};
module.exports.SwitchDialog = require('./src/prompts/SwitchDialog');