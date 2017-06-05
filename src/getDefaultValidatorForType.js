const builder = require('botbuilder');
const choicesToList = require('./choicesToList');

const getDefaultValidatorForType = module.exports = function (type) {
  let result = false;
  switch (type) {
    case 'text' :
      result = (session, response, itemConfig) => {
        return response.response.length > 0;
      }
      break;
    case 'number' :
      result = (session, response, itemConfig) => {
        return builder.PromptRecognizers.recognizeNumbers(session, response.response).length > 0;
      };
      break;
    case 'boolean':
    case 'confirm' :
      result = (session, response, itemConfig) => {
        return [true, false].lastIndexOf(response.response) > -1;
      }
      break;
    case 'time' :
      result = (session, response, itemConfig) => {
        return builder.PromptRecognizers.recognizeTimes(session).length > 0
      };
      break;
    case 'email' :
      result = (session, response, itemConfig) => {
        return /^\S+@\S+$/.test(response.response);
      };
      break;
    case 'url' :
      result = (session, response, itemConfig) => {
        return /^(ftp|http|https):\/\/[^ "]+$/.test(response.response);
      }
      break;
    case 'choice' :
      result = (session, response, itemConfig) => {
        entities = builder.PromptRecognizers.recognizeChoices(response.response.entity, choicesToList(itemConfig.choices));
        return entities.length > 0
      }
      break;
    default:
      result = () => true;
  }
  return result;
}