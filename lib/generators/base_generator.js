const fs = require('fs');
const path = require('path');
const nunjucks = require('nunjucks');
const inquirer = require('inquirer');
const helpers = require('../helpers');

class BaseGenerator {

  static DIR_PATHS = {
    CONTROLLERS: 'src/controllers/',
    MODELS: 'src/models/',
  };

  static TEMPLATE_PATHS = {
    MODEL: 'model/default.njk',
    CONTROLLER_API: 'controller/api.njk',
    ACTIONS_PROMISE_STYLE: 'controller/actions/promise/',
    ACTIONS_ASYNC_AWAIT_STYLE: 'controller/actions/promise/'
  };

  static FILE_EXT = '.js';

  /**
   * Sanitizes a class name according to most common JS naming convention
   * 
   * @param {String} name The class name
   */
  static sanitizeClassName(name) {
    name = name[0].toUpperCase() + name.substring(1).toLowerCase();
    name = name.split('_').map(function (nameChunk) {
      return nameChunk[0].toUpperCase() + nameChunk.substring(1).toLowerCase();
    }).join('');

    return name;
  }

  /**
   * Sanitizes a variable name according to most common JS naming convention
   * 
   * @param {String} name The variable name
   * @param {Boolean} plural Indicates if must be in plural or not
   */
  static sanitizeVarName(name, plural = false) {
    return name[0].toLowerCase() + name.substring(1);
  }

  static async askForOverwritePath(path) {
    let answer = await inquirer.prompt([
      {
        type: 'confirm',
        name: 'canOverwrite',
        message: path + ' already exists. Would you like to overwrite it?'
      }
    ]);

    return answer.canOverwrite;
  }

  /**
   * 
   * 
   * @param {String} path The path to ask for overwrite
   */
  static async askForOverwritePathMultiple(path) {
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

  static getTemplate(relativeTemplatePath, params) {
    nunjucks.configure(helpers.LIB_TEMPLATES_PATH);

    let template = fs.readFileSync(path.join(helpers.LIB_TEMPLATES_PATH, relativeTemplatePath), { encoding: 'utf-8' });
    let content = nunjucks.renderString(template, params);

    return content;
  }
}

module.exports = { BaseGenerator };