const assert = require('assert');
const MESSAGE_TIMEOUT = 200;

function testBot(bot, messages, done) {
  return new Promise(function (resolve, reject) {
    var step = 0;
    var connector = bot.connector('console');

    bot.on('send', function (message, content) {
      if (step <= messages.length && step >= 0) {
        var check = messages[step];
        console.log(`Step: #${step}`);
        console.log(`BOT >> ${message.text}`);
        checkInMessage(message, check, assert, (err) => {
          if (err) {
            assert(false);
            done();
            reject();
          }
          proceedNextStep(check, done);
        });
      } else {
        assert(false);
        setTimeout(() => {
          done();
          resolve(true);
        }, MESSAGE_TIMEOUT); // Enable message from connector to appear in current test suite
      }
    });
    if (messages.length) {
      proceedNextStep(messages[0]);
    }
    function proceedNextStep(check) {
      if (check.out) {
        console.log(`Step: #${step}`);
        console.log('User >> ' + check.out);
        connector.processMessage(check.out);
      }
      step++;
      if (step == messages.length) {
        setTimeout(() => {
          done();
          resolve(true);
        }, MESSAGE_TIMEOUT); // Enable message from connector to appear in current test suite

      }

    }
  });

  function checkInMessage(message, check, assert, callback) {
    if (typeof check.in === 'function') {
      return check.in(message, assert, callback);
    } else {
      if (check.in) {
        if (check.in.test ? check.in.test(message.text) : message.text === check.in) {
          assert(true);
        } else {
          console.error('<%s> does not match <%s>', message.text, check.in);
          assert(false);
        }
      }
      return callback();
    }
  }


}

module.exports = {
  testBot
};