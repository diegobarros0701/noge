const { BaseGenerator } = require('./base_generator');
const fs = require('fs');
const logger = require('../logger');
const prompts = require('../prompts');
const { Utils } = require('../utils');

class ControllerGenerator extends BaseGenerator {

  /**
   * 
   * @param {{ name: string, options: {}, actions: [String]}} param0 
   */
  static async go({ name, options = {} }) {
    // try {
    let actions = [];

    if (options.empty) {
      actions = [];
    } else if (options.actions) {
      actions = options.actions.split(',');
    } else {
      actions = ['index', 'show', 'store', 'update', 'destroy'];
    }

    let className = Utils.sanitizeName(name, 'class');
    let serviceName = className + 'Service';
    let varName = Utils.sanitizeName(name, 'var');
    let varNamePlural = varName + 's';
    let controllerActionsStyle = options.asyncAwaitStyle ? 'async-await' : 'promise';
    let controllerName = `${className}Controller`;
    let controllerPath = this.DIR_PATHS.CONTROLLERS + controllerName + this.FILE_EXT;
    let contentNewController = this.getTemplate(this.TEMPLATE_PATHS.CONTROLLER_API, { serviceName, varName, varNamePlural, actions, controllerActionsStyle });

    if (fs.existsSync(controllerPath)) {
      let contentExistingController = fs.readFileSync(controllerPath, { encoding: 'utf-8' });

      if (contentNewController == contentExistingController) {
        logger.identical(controllerPath);
      } else {
        logger.conflict(controllerPath);
        let canOverwrite = await prompts.askForOverwritePath(controllerPath);

        if (canOverwrite) {
          fs.writeFileSync(controllerPath, contentNewController);

          logger.overwrite(controllerPath);
        } else {
          logger.skip(controllerPath);
        }
      }
    } else {
      fs.writeFileSync(controllerPath, contentNewController);

      logger.create(controllerPath);
    }

    // return true;
    // } catch (e) {

    //   return false;
    // }
  }
}

module.exports = { ControllerGenerator };