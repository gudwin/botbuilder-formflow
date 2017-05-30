module.exports = [
  {
    "out": "hi"
  },
  {
    "in": "Please enter a time value",
    "out": "blabla"
  },
  {
    "in": "I don't understand that. Could you say some recognizeable as time?",
    "out": "5 minutes ago"
  },
  {
    "in": function (message, asset, callback) {
      let receivedMilliseconds = Date.parse(message.text.split('You selected ')[1]);
      let diff = (new Date().getTime()) - receivedMilliseconds;
      diff = (diff / 1000) - 300;
      expect(diff <= 1).toBe(true);
      callback();
    }
  },
  {
    "in": function (message, asset, callback) {
      let expectedDate = new Date(new Date() - new Date(300000));
      expectedDate.setMilliseconds(0);
      let result = JSON.parse(message.text);
      let expected = {
        "value": expectedDate
      };

      // @todo Find out what is going on
      // Shity datetimes! F#cking type comparsion
      let timeDiff = parseInt(( new Date(expected.value) - new Date(result.value)) / 1000);
      expect(timeDiff <= 2).toBe(true);
      setTimeout( function () {
        callback();
      },100)


    }
  }
];