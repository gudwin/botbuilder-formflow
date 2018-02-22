'use strict';

function CustomDialog(bot, id, stepConfig, steps) {
  let isCustomDialog = stepConfig && stepConfig.type && ('custom-class' == stepConfig.type);
  if (isCustomDialog) {
    steps.push((session) => {
      session.send(`bot.injectedValue=${bot.injectedValue}`)
      session.send(`id=${id}`)
      session.send(`config=${JSON.stringify(stepConfig)}`)

      session.endConversation('Hello from Custom Dialog')
    });
  }
}
module.exports = CustomDialog;