const choicesToList = require('./choicesToList');
const builder = require('botbuilder');
const sprintf = require('sprintf');
const getAttachment = require('botbuilder-get-attachment');
const SUPPORTED_TYPES = [
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
  'custom'
];
const isValid = function (session, response, itemConfig) {
  return new Promise(function (resolve, reject) {
    function iterateValidators(promises, obj, error) {
      function findError(key) {
        if ("object" == typeof error) {
          if ("undefined" == typeof error[key]) {
            throw new Error(`Failed to find a validator message for key - "${key}"`);
          }
        }
        return keyError = error instanceof Object ? error[key] : error;
      }

      let result = true;
      for (let key in obj) {
        if (!obj.hasOwnProperty(key)) {
          continue;
        }
        if ("object" == typeof obj[key]) {
          result = iterateValidators(promises, obj[key], findError(key));
        } else {
          result = obj[key].call(itemConfig, session, response, itemConfig, findError(key));
        }
        if (result instanceof Promise) {
          promises.push(result);
        } else {
          promises.push(result ? Promise.resolve(result) : Promise.reject(findError(key)));
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

    let errorPrompt = itemConfig.errorPrompt;
    let allPromises = [];
    iterateValidators(allPromises, itemConfig.validator, errorPrompt)
    allPromises = Promise.all(allPromises);
    allPromises.then(resolve).catch((error) => {
      reject(resolveError(error));
    });


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
  }
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
  options.retryPrompt = promptMessage;
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
    case 'confirm':
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
  /**
   * @deprecated option
   */
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
const displayResult = function (session, item, result) {
  let callback = null;
  if (item.response) {
    if ("function" != typeof item.response) {
      callback = (session, item, result) => {
        function output(displayValue) {
          session.send(sprintf(item.response, displayValue));
        }

        function getOutputByType(type, response) {
          switch (type) {
            case "boolean":
            case 'confirm':
              let locale = session.preferredLocale();
              let yes = session.localizer.gettext(locale, 'confirm_yes', 'BotBuilder');
              let no = session.localizer.gettext(locale, 'confirm_no', 'BotBuilder');
              return (response ? yes : no);
            case "time":
              let value = response.resolution ? response.resolution.start : response;
              return (new Date(value).toUTCString())
            case "attachment":
            case "file":
              return result.response[0].name;
            default:
              return response;
          }
        }

        output(getOutputByType(item.type, result.response));
      }
    } else {
      callback = item.response;
    }
    callback.call(item, session, item, result);
  }
}


module.exports = function (id, item) {
  return [
    (session, args, next) => {
      let isErrorPrompt = "object" == typeof args && ( builder.ResumeReason.reprompt == args.resumed );
      if ( isErrorPrompt) {
        if ( "string" == typeof args.errorPrompt ) {
          displayPrompt(session, item, args.errorPrompt, next);
          return;
        }
      }
      displayPrompt(session, item, item.prompt, next);

    },
    (session, response) => {
      isValid(session, response, item)
        .then(() => {
          displayResult(session, item, response);
          return extractValue(session, response, item);
        })
        .then((result) => {
          session.endDialogWithResult({
            response: result,
            resumed: builder.ResumeReason.completed
          });
        })
        .catch((e) => {
          session.replaceDialog(id, {
            resumed: builder.ResumeReason.reprompt,
            errorPrompt: e instanceof Error ? e.message : e
          });
        });
    }
  ];
}
module.exports.isPrompt = function (stepConfig) {
  if ("undefined" != typeof stepConfig['type']) {
    return SUPPORTED_TYPES.indexOf(stepConfig['type']) >= 0;
  }
}
module.exports.SUPPORTED_TYPES = SUPPORTED_TYPES;