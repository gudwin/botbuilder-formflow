module.exports = [
  {
    "user": "hi"
  },
  {
    "bot": "Please enter a time value"
  },
  { "user": "blabla" },
  {
    "bot": "I don't understand that. Could you say some recognizeable as time?"
  },
  { "user": "5 minutes ago" },
  {
    "bot": function (bot,message) {
      console.log(message);
      let receivedMilliseconds = Date.parse(message.text.split('You selected ')[1]);
      let diff = (new Date().getTime()) - receivedMilliseconds;
      diff = diff - 300 * 1000;
      expect(diff <= 2000).toBe(true);
      return Promise.resolve( true );
    }
  },
  {
    "bot": function (bot, message ) {
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
      return new Promise( (resolve, reject ) => {
        setTimeout( function () {
          resolve();
        },100)
      })


    }
  }
];