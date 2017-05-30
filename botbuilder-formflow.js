const SupportedTypes = ['text', 'number', 'confirm', 'email', 'time', 'url', 'choice', 'dialog'];
const RequiredProperties = ['id', 'type'];
const uuid = require('node-uuid');
const builder = require('botbuilder');
const sprintf = require('sprintf');

const matchItem = function (item, type, callback) {
  return ( item.type == type ) && (callback.call(null));
}
const choicesToList = function (choices) {
  let result = [];
  if (choices) {
    if (Array.isArray(choices)) {
      choices.forEach(function (value) {
        if (typeof value === 'string') {
          result.push({value: value});
        }
        else {
          result.push(value);
        }
      });
    }
    else if (typeof choices === 'string') {
      choices.split('|').forEach(function (value) {
        result.push({value: value});
      });
    }
    else {
      for (var key in choices) {
        if (choices.hasOwnProperty(key)) {
          result.push({value: key});
        }
      }
    }
  }
  return result;
}
const isValid = function (session, response, itemConfig) {
  if ("function" == typeof itemConfig.validator) {
    return itemConfig.validator.call(null, session, response, itemConfig)
  } else {
    switch (itemConfig.type) {
      case 'text' :
        return response.response.length > 0;
        break;
      case 'number' :
        return builder.PromptRecognizers.recognizeNumbers(session, response.response).length > 0;
        break;
      case 'confirm' :
        return [true, false].lastIndexOf(response.response) > -1;
        break;
      case 'time' :
        return builder.PromptRecognizers.recognizeTimes(session).length > 0
        break;
      case 'email' :
        return /^\S+@\S+$/.test(response.response);
        break;
      case 'url' :
        return /^(ftp|http|https):\/\/[^ "]+$/.test(response.response);
        break;
      case 'choice' :
        let entities = builder.PromptRecognizers.recognizeChoices(response.response.entity, choicesToList(itemConfig.choices));
        return entities.length > 0
        break;
      default:
        throw new Error(`unknown type - ${itemConfig.type}`);
    }
  }
};
const extractValue = function (session, response, itemConfig) {
  if ("function" == typeof itemConfig.extractor) {
    return itemConfig.extractor.call(null, session, response)
  } else {
    let text = session.message.text.trim();
    let entities;
    switch (itemConfig.type) {
      case 'number' :
        return builder.PromptRecognizers.recognizeNumbers(session, response.response)[0].entity
        break;
      case 'text' :
      case 'email' :
      case 'url' :
      case 'confirm' :
      case 'dialog' :
        return response.response;
        break;
      case 'time' :
        entities = builder.PromptRecognizers.recognizeTimes(session);
        let result = entities[0].resolution.start;
        result.setMilliseconds( 0 );
        return result;
        break;
      case 'choice' :
        entities = builder.PromptRecognizers.recognizeChoices(response.response.entity, choicesToList(itemConfig.choices));
        return entities[0].entity;
        break;
      default:
        throw new Error(`unknown type - ${itemConfig.type}`);
    }
  }
};
const displayPrompt = function (session, item, message) {
  if ("function" == typeof message) {
    return message.call(null, session, item, message)
  } else {
    switch (item.type) {
      case 'number':
      case 'text':
      case 'email':
      case 'url':
        builder.Prompts.text(session, message);
        break;
      case 'confirm' :
        builder.Prompts.confirm(session, message, {
          listStyle: builder.ListStyle.buttons,
          retryPrompt: item.errorPrompt
        });
        break;
      case 'time':
        builder.Prompts.time(session, message, {
          retryPrompt: item.errorPrompt
        });
        break;
      case 'choice':
        builder.Prompts.choice(session, message, item.choices, {
          listStyle: builder.ListStyle.buttons,
          retryPrompt: item.errorPrompt
        });
        break;
      default:
        throw new Error(`Unknown formflows item type - ${item.type}`)
    }
  }
}
const displayResult = function (session, item, result) {
  if (item.response) {
    if ("function" == typeof item.response) {
      item.response.call(null, session, item, result);
    } else if ("confirm" == item.type) {
      var locale = session.preferredLocale();
      var yes = session.localizer.gettext(locale, 'confirm_yes', 'BotBuilder');
      var no = session.localizer.gettext(locale, 'confirm_no', 'BotBuilder');
      session.send(sprintf(item.response, result.response ? yes : no));
    } else if ('time' == item.type) {
      let value = result.response.resolution ? result.response.resolution.start : result.response;
      session.send(sprintf(item.response, new Date(value).toUTCString()))
    } else {
      session.send(sprintf(item.response, result.response));
    }
  }
}

const buildFieldDialog = function (bot, id, item) {
  let firstRun = true;
  if (matchItem(item, 'dialog', () => !Array.isArray(item.dialog))) {
    return ;
  }

  if (matchItem(item, 'dialog', () => Array.isArray(item.dialog))) {
    bot.dialog(id, item.dialog);
  } else {
    bot.dialog(id, [
      (session) => {
        firstRun ? displayPrompt(session, item, item.prompt) : displayPrompt(session, item, item.errorPrompt);
        firstRun = false;
      },
      (session, response) => {
        if (isValid(session, response, item)) {
          displayResult(session, item, response);
          firstRun = true;
          session.endDialogWithResult({
            response: extractValue(session, response, item)
          });
        } else {
          session.replaceDialog(id);
        }
      }
    ]);
  }

}
const getFormFlowWrapper = function (bot, config) {
  let flow = [];
  let results = {};
  flow.push(function (session, args, next) {
    results = args ? args : {};
    next();
  });
  config.forEach((item, index, next) => {
    let fieldName = item.id;
    let isDialogName = matchItem(item, 'dialog', () => "string" == typeof(item.dialog));
    let dialogId = isDialogName ? item.dialog : '/' + uuid.v4();

    flow.push((session, args, next) => {
      if ("undefined" != typeof results[fieldName]) {
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
        results[fieldName] = response.response;
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
    let throwError = ( message ) => {
      throw new Error( message + `\nObject with issues: ${JSON.stringify(item, null, 4)})`);
    }

    if (!(item instanceof Object )) {
      throwError('Every item in a config must be an object.');
    }
    RequiredProperties.forEach((propertyName) => {
      if (!item.hasOwnProperty(propertyName)) {
        let message = `Every item in a config MUST have next properties: ${RequiredProperties.join(',')}`;
        throw throwError(message);
      }
    });
    if (-1 == SupportedTypes.indexOf(item.type)) {
      throw throwError(`Type ${item.type} not supported`);
    }
    if (matchItem(item, 'choice', () => !item.choices)) {
      let message = `"choices" attribute MUST be defined.
Object with issues: ${JSON.stringify(item, null, 4)}`;
      throw throwError(message);
    }
    if (matchItem(item, 'dialog', () => !item.dialog)) {
      throw throwError(`Empty "dialog" property`);
    } else if (( item.type != 'dialog' && !item.prompt)) {
      throw throwError(`Prompt field required for non-dialogs.\nItem: ${JSON.stringify(item)}`);
    }
    config[i] = Object.assign({
      errorPrompt: item.prompt,
      response: 'Selected %s',
      validator: null,
      extractor: null
    }, item);

  });
}

module.exports.SupportedTypes = SupportedTypes;
module.exports.RequiredProperties = RequiredProperties;
module.exports.create = function (bot, dialogName, config) {
  validateConfig(config);
  let formFlow = getFormFlowWrapper(bot, config);
  //console.log(`////////////// FORM FLOW  ${dialogName} ///////////////`);
  //formFlow.forEach( ( item ) => {
  //  console.log( item.toString());
  //})
  console.log( `FormFlow Dialog - ${dialogName}`);
  bot.dialog(dialogName, formFlow);
  return formFlow;
};