const inquirer = require('inquirer');

module.exports = {
  async askForProjectSettings(projectName, version = '1.0.0') {
    let answers = await inquirer
      .prompt([
        {
          type: 'input',
          name: 'projectName',
          filter: function (value) {
            return value.trim();
          },
          message: `Project name (${projectName}): `
        },
        {
          type: 'input',
          name: 'version',
          message: `Version (${version}: `
        }
      ]);

    return answers;
  },

  async askForOverwritePath(path) {
    let answer = await inquirer.prompt([
      {
        type: 'confirm',
        name: 'canOverwrite',
        message: path + ' already exists. Would you like to overwrite it?'
      }
    ]);

    return answer.canOverwrite;
  },

  /**
   * 
   * 
   * @param {String} path The path to ask for overwrite
   */
  async askForOverwritePathMultiple(path) {
    let answer = await inquirer.prompt([
      {
        type: 'list',
        name: 'option',
        message: path + ' already exists. Would you like to overwrite it?',
        choices: [
          {
            key: 'y',
            name: 'Overwrite',
            value: 'overwrite'
          },
          {
            key: 'a',
            name: 'Overwrite all',
            value: 'overwriteAll',
          },
          {
            key: 'n',
            name: 'Skip',
            value: 'skip',
          },
          {
            key: 'x',
            name: 'Abort',
            value: 'abort'
          }
        ]
      }
    ]);

    return { [answer.option]: true };
  }
};