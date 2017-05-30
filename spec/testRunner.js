process.on('uncaughtException', function (exception) {
  console.log('Catched UNHANDLED Exception');
  console.log(exception);
});
process.on('unhandledRejection', (reason, p) => {
  console.log("Unhandled Rejection at: Promise ", p, " reason: ", reason);
});

var Jasmine = require('jasmine');
var jasmine = new Jasmine();

jasmine.loadConfigFile('./spec/support/jasmine.json');
jasmine.configureDefaultReporter({
  showColors: true
});


var Reporter = require('jasmine-terminal-reporter');
var reporter = new Reporter({
  isVerbose: true,
  includeStackTrace: true,

})
jasmine.addReporter(reporter);
jasmine.execute();