"use strict";

const gulp = require('gulp');
const watch = require('gulp-watch');
const fork = require('child_process').fork;

let restartProcess = function (command) {

  if (restartProcess.ls) {
    console.log('Restarting...')
    restartProcess.ls.kill();
    restartProcess.ls = null;
  }
  let options = {
    cwd: process.env.PWD + '/',
    env: process.env,
    silent: false
  };
  restartProcess.ls = fork(command, options);
}
process.on('uncaughtException', function (exception) {
  console.error(exception);
  process.exit(1);
});
process.on('unhandledRejection', (reason, p) => {
  console.error("Unhandled Rejection at: Promise:", p, " reason: ", reason);
  process.exit(1);
});

gulp.task('tests', function () {
  let ls = null;
  let command = `${process.env['PWD']}/spec/testRunner.js`;

  restartProcess(command);
  // Callback mode, useful if any plugin in the pipeline depends on the `end`/`flush` event
  return watch(['src/**/*.js', 'spec/**/*.js', 'index.js', 'testRunner.js', 'config/**/*.json'], function () {
    console.log('Restarting Tests');
    restartProcess(command);
  });
});