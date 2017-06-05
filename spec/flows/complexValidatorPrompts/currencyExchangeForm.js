module.exports = [
  {
    "type": "text",
    "id": "currency",
    "prompt": "Please, enter an amount to exchange (103.45 USD or 0.05 BTC)",
    "errorPrompt": {
      "format": "Invalid format (Exaples: 103.45 USD or 0.05 BTC)",
      "currency": function (session,response,itemConfig) {
        return "Wrong currency name (USD or BTC allowed)"
      },
      "not_a_number": "I can't recognize a number",
      "someRemoteValidation" : "Unfortunately, we just found that only BTC accepted right now",
      "@default" : 'Please enter a value'
    },
    "validator": {
      "format": function (session, response, itemConfig) {
        let values = response.response.trim().split(' ');
        return values.length == 2;
      },
      "currency": function (session, response, itemConfig) {
        let values = response.response.trim().split(' ');
        return ['USD', 'BTC'].lastIndexOf(values[1].toUpperCase()) > -1;
      },
      "not_a_number": function (session, response, itemConfig) {
        let values = response.response.trim().split(' ');
        console.log(`parseFloat = "${parseFloat(values[0])}"`)
        console.log( typeof parseFloat(values[0])  );
        console.log( parseFloat(values[0]));

        return !Number.isNaN(parseFloat(values[0]));
      },
      "someRemoteValidation" : function ( session, response,itemConfig,errorPrompt ) {
        return new Promise( function (resolve, reject) {
         setTimeout(function () {
           let currency = response.response.trim().split(' ')[1].toUpperCase();
           console.log(`Final currency - "${currency}"`)
           if ( currency == 'BTC') {
             resolve(true);

           } else {
             reject( errorPrompt );
           }
         },10);
        });
      }
    },
    "extractor": function (session, response, itemConfig) {
      let values = response.response.trim().split(' ');
      return {
        "amount": parseFloat(values[0]),
        "currency": values[1]
      }
    }
  }
]