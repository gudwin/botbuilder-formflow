const messaging = require('./messaging');
const matchItem = require('./matchItem');
const choicesToList = require('./choicesToList');

const builder = require('botbuilder');
const sprintf = require('sprintf');
const getAttachment = require('botbuilder-get-attachment');

const isValid = function (session, response, itemConfig) {
  return new Promise(function (resolve, reject) {
    let errorPrompt = itemConfig.errorPrompt;
    let all = [];

    function iterateValidators(obj, error) {
      let result = true;
      for (var key in obj) {
        if (obj.hasOwnProperty(key)) {
          if ("object" == typeof error) {
            if ("undefined" == typeof error[key]) {
              throw new Error(`Failed to find a validator message for key - "${key}"`);
            }
          }
          let keyError = error instanceof Object ? error[key] : error;
          if ("object" == typeof obj[key]) {
            result = iterateObject(obj[key], keyError);
          } else {
            result = obj[key].call(itemConfig, session, response, itemConfig, keyError);
          }
          if (result instanceof Promise) {
            all.push(result);
          } else {
            all.push(result ? Promise.resolve(true) : Promise.reject(keyError));
          }

        }
        if (!result) {
          break;
        }
      }
      return result;
    }

    function resolveError(error) {
      let result = '';
      if ("function" == typeof error) {
        result = error.call(itemConfig, session, response, itemConfig);
      } else if (error instanceof Error) {
        result = error.message;
      } else if (error) {
        result = error;
      } else {
        result = itemConfig.errorPrompt;
      }
      return result;
    }

    iterateValidators(itemConfig.validator, errorPrompt);
    result = Promise.all(all);

    if (result instanceof Promise) {
      result.then(function () {
        resolve(true);
      }, function (error) {
        reject(resolveError(error));
      }).catch(function (error) {
        throw error;
      });
    } else if (result) {
      resolve(true);
    } else {
      reject(resolveError());
    }
  }).catch((e) => {
    throw e;
  })


};
const extractValue = function (session, response, itemConfig) {
  if ("function" == typeof itemConfig.extractor) {
    return itemConfig.extractor.call(itemConfig, session, response)
  }
  else {
    let entities;
    switch (itemConfig.type) {
      case 'number' :
        return builder.PromptRecognizers.recognizeNumbers(session, response.response)[0].entity
        break;
      case 'text':
      case 'email':
      case 'url' :
      case 'boolean':
      case 'confirm' :
      case 'dialog' :
        return response.response;
        break;
      case 'attachment':
      case 'file':
        return getAttachment(session, 0);
        break;
      case 'time' :
        entities = builder.PromptRecognizers.recognizeTimes(session);
        let result = entities[0].resolution.start;
        result.setMilliseconds(0);
        return result;
        break;
      case 'choice' :
        entities = builder.PromptRecognizers.recognizeChoices(response.response.entity, choicesToList(itemConfig.choices));
        return entities[0].entity;
        break;
      case 'custom':
        return null;
        break;
      default:
        throw new Error(`Unable to extract value - ${itemConfig.type}`);
    }
  }
};


const displayPrompt = function (session, item, promptMessage, next) {
  if ("function" == typeof promptMessage) {
    return promptMessage.call(item, session, item, promptMessage, next)
  } else {
    // If array of messages provided
    // Send them all except the last one
    if (Array.isArray(promptMessage)) {
      promptMessage = promptMessage.slice();
      while (promptMessage.length > 1) {
        session.send(promptMessage.shift());
      }
    }

    let options = item.options ? Object.assign({}, item.options) : {};
    let isErrorPromptPresentAndString = (item.errorPrompt) && ("string" == typeof item.errorPrompt);
    if (isErrorPromptPresentAndString) {
      options.retryPrompt = item.errorPrompt;
    }

    switch (item.type) {
      case 'number':
      case 'text':
      case 'email':
      case 'url':
        builder.Prompts.text(session, promptMessage, options);
        break;
      case 'boolean':
      case 'confirm' :
        if (!options.listStyle) {
          options.listStyle = builder.ListStyle.buttons;
        }
        builder.Prompts.confirm(session, promptMessage, options);
        break;
      case 'time':
        builder.Prompts.time(session, promptMessage, options);
        break;
      case 'choice':
        if (!options.listStyle) {
          options.listStyle = builder.ListStyle.buttons;
        }
        builder.Prompts.choice(session, promptMessage, item.choices, options);
        break;
      case 'attachment':
      case 'file':
        builder.Prompts.attachment(session, promptMessage, options);
        break;
      case 'custom':
        session.send(promptMessage);
        next();
        break;
      case 'dialog':
        session.beginDialog(item.dialog);
        break;
      default:
        throw new Error(`Unknown formflow item type - ${item.type}`)
    }
  }
}

const displayResult = function (session, item, result) {
  if (item.response) {
    if ("function" == typeof item.response) {
      item.response.call(item, session, item, result);
    } else if (["boolean", "confirm"].indexOf(item.type) > -1) {
      var locale = session.preferredLocale();
      var yes = session.localizer.gettext(locale, 'confirm_yes', 'BotBuilder');
      var no = session.localizer.gettext(locale, 'confirm_no', 'BotBuilder');
      session.send(sprintf(item.response, result.response ? yes : no));
    } else if ('time' == item.type) {
      let value = result.response.resolution ? result.response.resolution.start : result.response;
      session.send(sprintf(item.response, new Date(value).toUTCString()))
    } else if (["attachment", "file"].indexOf(item.type) > -1) {
      session.send(sprintf(item.response, result.response[0].name));
    } else {
      session.send(sprintf(item.response, result.response));
    }
  }
}

module.exports = function (bot, id, item) {
  if (item.initialize) {
    item.initialize(bot, id, item);
  }
  if (matchItem(item, 'dialog', () => Array.isArray(item.dialog))) {
    // Subdialog flow
    bot.dialog(id, item.dialog);
  } else if (messaging.isMessaging(item)) {
    // Basic Messaging flow
    bot.dialog(id, messaging.processMessage(item));
  } else {
    // Prompts flow
    bot.dialog(id, [
      (session, args, next) => {
        let isErrorPrompt = "object" == typeof args && ( builder.ResumeReason.reprompt == args.resumed );
        displayPrompt(session, item, isErrorPrompt ? args.errorPrompt : item.prompt, next);
      },
      (session, response) => {
        isValid(session, response, item).then(function () {
            displayResult(session, item, response);
            let extractedValue = extractValue(session, response, item);
            // Wait while promise will be resolved
            if (!(extractedValue instanceof Promise )) {
              extractedValue = Promise.resolve(extractedValue);
            }
            return extractedValue;

          })
          .then((result) => {
            session.endDialogWithResult({
              response: result
            });
          })
          .catch(function (e) {
            session.replaceDialog(id, {
              resumed: builder.ResumeReason.reprompt,
              errorPrompt: e instanceof Error ? e.message : e
            });
          });
      }
    ]);
  }
}