const { BaseGenerator } = require('./base_generator');
const fs = require('fs');
const logger = require('../logger');

class ControllerGenerator extends BaseGenerator {

  /**
   * 
   * @param {{ name: string, options: {}, actions: [String]}} param0 
   */
  static async go({ name, options = {}, actions = [] }) {
    // try {
    if (options.emptyController) {
      actions = [];
    } else if (actions.length == 0) {
      actions = ['index', 'show', 'store', 'update', 'destroy'];
    }

    let className = this.sanitizeClassName(name);
    let varName = this.sanitizeVarName(name);
    let controllerActionsStyle = options.asyncAwaitStyle ? 'async-await' : 'promise';
    let controllerName = `${className}Controller`;
    let controllerPath = this.DIR_PATHS.CONTROLLERS + controllerName + this.FILE_EXT;
    let contentNewController = this.getTemplate(this.TEMPLATE_PATHS.CONTROLLER_API, { modelName: className, varName, actions, controllerActionsStyle });

    if (fs.existsSync(controllerPath)) {
      let contentExistingController = fs.readFileSync(controllerPath, { encoding: 'utf-8' });

      if (contentNewController == contentExistingController) {
        logger.identical(controllerPath);
      } else {
        logger.conflict(controllerPath);
        let canOverwrite = await this.askForOverwritePath(controllerPath);

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