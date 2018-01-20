const builder = require('botbuilder');
module.exports = [
  {
    "user": "hi"
  },
  {
    "bot": "Please upload an attachment"
  },
  {
    "user" : "hi!"
  },
  {
    "bot" : "You need to upload the file"
  },
  {
    "user": function (bot ) {
      let msg = new builder.Message();
      msg.addAttachment({
        "name": "test",
        "contentType": "plain/text",
        "content": "Hello world"
      });
      return Promise.resolve(msg);
    }
  },
  {
    "bot": "File test uploaded"
  },
  {
    "bot" : "Please upload second attachment"
  },
  {
    "user": function (bot ) {
      let msg = new builder.Message();
      msg.addAttachment({
        "name": "second-test",
        "contentType": "plain/text",
        "content": "Hello world"
      });
      return Promise.resolve(msg);
    }
  },
  {
    "bot": "second-test"
  },
  {
    "bot": "Hello world"
  },
  {
    "bot" : "{\"first\":{\"name\":\"test\",\"contentType\":\"plain/text\",\"content\":\"Hello world\"},\"second\":{\"name\":\"second-test\",\"contentType\":\"plain/text\",\"content\":\"Hello world\"}}"
  }
];