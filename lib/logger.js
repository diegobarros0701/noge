const chalk = require('chalk');

let types = {
  blue: chalk.blueBright,
  green: chalk.greenBright,
  yellow: chalk.yellowBright,
  orange: chalk.rgb(255, 154, 0),
  red: chalk.redBright,
  bgREd: chalk.bgRed
};

module.exports = {
  log(type, title, message = '') {
    console.log('   ', types[type](title), message);
  },

  run(message) {
    this.log('green', 'run', message);
  },

  identical(message) {
    this.log('blue', 'identical', message);
  },

  exists(message) {
    this.log('blue', 'exists', message);
  },

  create(message) {
    this.log('green', 'create', message);
  },

  conflict(message) {
    this.log('orange', 'conflict', message);
  },

  overwrite(message) {
    this.log('red', 'overwrite', message);
  },

  skip(message) {
    this.log('yellow', 'skip', message);
  },

  abort(message) {
    this.log('bgREd', 'Aborted', message);
  }
};