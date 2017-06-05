const builder = require('botbuilder');
const sprintf = require('sprintf');

const matchItem = require('./matchItem');
const choicesToList = require('./choicesToList');



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
            result = obj[key].call(null, session, response, itemConfig, keyError);
          }
          if ( result instanceof Promise ) {
            all.push( result );
          } else {
            all.push(result ? Promise.resolve(true) : Promise.reject(keyError));
          }

        }
        if ( !result) {
          break;
        }
      }
      return result;
    }

    function resolveError(error) {
      let result = '';
      if ("function" == typeof error) {
        result = error.call(null, session, response, itemConfig);
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
      return itemConfig.extractor.call(null, session, response)
    }
    else {
      let text = session.message.text.trim();
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
        default:
          throw new Error(`unknown type - ${itemConfig.type}`);
      }
    }
  }
  ;


const displayPrompt = function (session, item, message) {
  if ("function" == typeof message) {
    return message.call(null, session, item, message)
  } else {
    if (Array.isArray(message)) {
      message = message.slice();
      while (message.length > 1) {
        session.send(message.shift());
      }
    }
    switch (item.type) {
      case 'number':
      case 'text':
      case 'email':
      case 'url':
        builder.Prompts.text(session, message);
        break;
      case 'boolean':
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
    } else if (["boolean", "confirm"].indexOf(item.type) > -1) {
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

module.exports = function ( bot, id,item) {
  if (matchItem(item, 'dialog', () => !Array.isArray(item.dialog))) {
    return;
  }

  if (matchItem(item, 'dialog', () => Array.isArray(item.dialog))) {
    bot.dialog(id, item.dialog);
  } else {
    bot.dialog(id, [
      (session, args) => {
        let isErrorPrompt = "object" == typeof args && ( builder.ResumeReason.reprompt == args.resumed ) ;
        displayPrompt(session, item, isErrorPrompt ? args.errorPrompt : item.prompt);
      },
      (session, response) => {
        isValid(session, response, item).then(function () {
          displayResult(session, item, response);
          firstRun = true;
          session.endDialogWithResult({
            response: extractValue(session, response, item)
          });
        }, function (errorPrompt) {
          throw errorPrompt;
        }).catch(function (e) {
          session.replaceDialog(id, {
            resumed: builder.ResumeReason.reprompt,
            errorPrompt: e instanceof Error ? e.message : e
          });
        });
      }
    ]);
  }
}