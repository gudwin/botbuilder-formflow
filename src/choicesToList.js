const choicesToList = module.exports = function (choices) {
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