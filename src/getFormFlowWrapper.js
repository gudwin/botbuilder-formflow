const constants = require('./constants');
const matchItem = require('./matchItem');
const getDefaultValidatorForType = require('./getDefaultValidatorForType');
const builder = require('botbuilder');
const uuid = require('node-uuid');

const validateFlow = function (flow) {
  flow.forEach((item, i) => {
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

    // both fields supported
    if (item.error && (!item.errorPrompt)) {
      item.errorPrompt = item.error;
    }
  });
}
const buildFieldDialog = function (library, bot, id, stepConfig) {
  let steps = [];
  library.emit(constants.BUILD_FIELD_DIALOG_EVENT, bot, id, stepConfig, steps);
  if (steps.length != 0) {
    return bot.dialog(id, steps);
  }
  throw new Error(`Unable to produce waterfall dialog for next step: ${JSON.stringify(stepConfig)}`);
}

module.exports = function (library, bot, config) {
  let flow = [];
  let results = {};
  validateFlow(config);
  flow.push((session, args, next) => {
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
    buildFieldDialog(library, bot, dialogId, item);
  });
  flow.push((session) => {
    session.endDialogWithResult({
      response: results
    });
  });
  return flow;
}