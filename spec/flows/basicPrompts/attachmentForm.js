module.exports = [
  {
    "type": "file",
    "id": "first",
    "prompt": "Please upload an attachment",
    "response" : 'File %s uploaded',
    "error" : "You need to upload the file"
  },
  {
    "type": "file",
    "id": "second",
    "prompt": "Please upload second attachment",
    "response" : function (session, item, result ) {
      session.send(result.response[0].name);
      session.send(result.response[0].content);
    }
  }
];