const fs = require('fs');
const path = require('path');
const { BaseGenerator } = require('../generators/base_generator');
const helpers = require('../helpers');
const nunjucks = require('nunjucks');
const { Utils } = require('../utils');
const logger = require('../logger');
const prompts = require('../prompts');

class ServiceGenerator extends BaseGenerator {

  /**
   * 
   * @param {{ serviceName: String, options: { projectPath?: String, actions?: String, emptyBody?: Boolean } }} param0 
   */
  static async go({ serviceName, options = {} }) {
    // nwog service user tests/projeto --actions get getOne delete

    options.projectPath = options.projectPath || '.';

    if (options.empty) {
      options.actions = {};
    } else if (options.actions) {
      options.actions = options.actions.split(',');
    } else {
      options.actions = ['get', 'getOne', 'insert', 'update', 'delete'];
    }

    let modelClassName = Utils.sanitizeName(serviceName, 'class');
    let varName = Utils.sanitizeName(serviceName, 'var');
    let varNamePlural = varName + 's';
    let actionsStyle = 'promise';
    let modelFileName = modelClassName;
    let serviceClassName = modelClassName + 'Service';
    serviceName = modelClassName + 'Service' + helpers.FILE_EXT;
    let newServiceFilePath = path.join(options.projectPath, path.join(helpers.NEW_SERVICE_RELATIVE_PATH, serviceName));
    let serviceTemplate = fs.readFileSync(helpers.LIB_SERVICE_TEMPLATE_DEFAULT_PATH, { encoding: 'utf-8' });

    nunjucks.configure(helpers.LIB_TEMPLATES_PATH);
    let serviceTemplateWithParamsReplaced = nunjucks.renderString(serviceTemplate, { modelClassName, modelFileName, serviceClassName, varName, varNamePlural, actionsStyle, actions: options.actions });

    if (fs.existsSync(newServiceFilePath)) {
      let contentExistingService = fs.readFileSync(newServiceFilePath, { encoding: 'utf-8' });

      if (serviceTemplateWithParamsReplaced == contentExistingService) {
        logger.identical(newServiceFilePath);
      } else {
        logger.conflict(newServiceFilePath);
        let canOverwrite = await prompts.askForOverwritePath(newServiceFilePath);

        if (canOverwrite) {
          fs.writeFileSync(newServiceFilePath, serviceTemplateWithParamsReplaced);

          logger.overwrite(newServiceFilePath);
        } else {
          logger.skip(newServiceFilePath);
        }
      }
    } else {
      fs.writeFileSync(newServiceFilePath, serviceTemplateWithParamsReplaced);

      logger.create(newServiceFilePath);
    }
  }


}

module.exports = { ServiceGenerator };