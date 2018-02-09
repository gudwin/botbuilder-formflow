const builder = require('botbuilder');
const uuid = require('node-uuid');

const SystemNamespace = 'BotBuilder';
const RepeatIntent = 'BotBuilder.RepeatIntent';
const DEFAULT_ITEMS_PER_PAGE = 6;
const AUTOGENERATED_DIALOG_PREFIX = 'MenuPrompt_';
const PREV_LABEL = 'prev';
const NEXT_LABEL = 'next';
let _super = builder.Prompt;

function MenuPrompt(features) {
  var _this = _super.call(this, {
      defaultRetryPrompt: 'default_text',
      defaultRetryNamespace: SystemNamespace,
      recognizeScore: 0.5
    }) || this;
  _this.updateFeatures(features);
  //
  _this.onRecognize( (context, cb) => {

    let dc = context.dialogData;
    let text = context.message.text.toLowerCase();
    let found = null;
    dc.chunkedItems.some((chunked) => {
      chunked.some((item)=> {
        if (item.title == text) {
          found = item.value;
        }
      });
    })

    if (null !== found) {
      if ("string" == typeof found) {
        cb(null, _this.features.recognizeScore, found);
        return;
      } else {
        dc.currentPage += found;
      }
    }

    cb(null, 0.0);

    //if (text == 'gisma') {
    //  cb(null, _this.features.recognizeScore, text);
    //} else {
    //  cb(null, 0.0);
    //}
  });
  _this.onFormatMessage( (session, text, speak, callback) => {
    let context = session.dialogData;
    let options = context.options;
    let itemsPerMessage = options.items_per_message || DEFAULT_ITEMS_PER_PAGE;
    context.currentPage = context.currentPage || 0;
    context.prevLabel = options.prevLabel || PREV_LABEL;
    context.nextLabel = options.nextLabel || NEXT_LABEL;

    function generateItemsIfNeeded(options) {
      if (context.chunkedItems) {
        return Promise.resolve(context.chunkedItems);
      }
      return resolveItems(options)
        .then(prepareItems)
        .then(chunkItems)
    }

    function resolveItems(options) {
      let promise = null;
      if ("undefined" == typeof options.items) {
        throw new Error("MenuPrompt.items mandatory attribute")
      }
      if ("function" == typeof options.items) {
        promise = options.items.call(null);
        if (!(promise instanceof Promise)) {
          throw new Error("MenuPrompt.items callback must return a Promise");
        }
      } else {
        promise = Promise.resolve(options.items)
      }
      return promise;
    }

    function prepareItems(items) {
      let result = [];
      for (let key in items) {
        if (!items.hasOwnProperty(key)) {
          continue;
        }
        let add = {
          title: key
        }
        if (Array.isArray(items[key])) {
          let dialogId = AUTOGENERATED_DIALOG_PREFIX + uuid.v4();
          session.library.dialog(dialogId, items[key])
          add.value = dialogId;
        } else {
          add.value = items[key]
        }
        result.push(add);
      }
      return result;
    }

    function chunkArray(data) {
      let i, j;
      let result = [];
      for (i = 0, j = data.length; i < j; i += itemsPerMessage) {
        result.push(data.slice(i, i + itemsPerMessage));
      }
      return result;
    }

    function chunkItems(items) {
      let counter = 0;
      let result = [];
      let prevAction = {
        title: options.prevLabel,
        value: -1
      };
      let nextAction = {
        title: options.nextLabel,
        value: 1
      };

      items.forEach((item, i) => {

        let isNextNeeded = (counter >= itemsPerMessage - 1 ) && ( i < items.length - 1 );
        if (isNextNeeded) {
          result.push(nextAction)
          counter = 0;
          let isPrevNeeded =  (i > 0) && (i < items.length - 1);
          if (isPrevNeeded) {
            result.push(prevAction)
            counter++;
          }
        }
        result.push(item);
        counter++;

      })
      return chunkArray(result);
    }

    generateItemsIfNeeded(options)
      .then((chunkedItems) => {

        let visibleItems;
        context.chunkedItems = chunkedItems;
        visibleItems = [];
        context.chunkedItems[context.currentPage].forEach((item, i) => {
          visibleItems.push(builder.CardAction.imBack(session, item.title,item.title));
        })

        let msg = new builder.Message();
        msg.text(text);
        msg.suggestedActions(builder.SuggestedActions.create(session, visibleItems));
        callback(null, msg);

      })
      .catch((error) => {
        session.logger.log(session.dialogStack(), error);
        session.send(_super.gettext(session, 'default_error', SystemNamespace));
        session.endConversation();
      })
    return _this;
  })
}
MenuPrompt.constructor = MenuPrompt;

MenuPrompt.prototype = builder.Prompt.prototype;

module.exports = MenuPrompt;

