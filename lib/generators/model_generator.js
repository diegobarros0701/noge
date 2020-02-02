const { BaseGenerator } = require('./base_generator');
const fs = require('fs');
const logger = require('../logger');

class ModelGenerator extends BaseGenerator {
  static async go({ name, options = {} }) {
    try {

      let className = this.sanitizeClassName(name);
      let modelPath = this.DIR_PATHS.MODELS + className + this.FILE_EXT;
      let tableName = options.table || name.toLowerCase();
      let contentNewModel = this.getTemplate(this.TEMPLATE_PATHS.MODEL, { name, tableName });

      if (fs.existsSync(modelPath)) {
        let contentExistingModel = fs.readFileSync(modelPath, { encoding: 'utf-8' });

        if (contentNewModel == contentExistingModel) {
          logger.identical(modelPath);
        } else {
          logger.conflict(modelPath);
          let canOverwrite = await this.askForOverwritePath(modelPath);

          if (canOverwrite) {
            logger.overwrite(modelPath);

            fs.writeFileSync(modelPath, contentNewModel);
          } else {
            logger.skip(modelPath);
          }
        }
      } else {
        logger.create(modelPath);

        fs.writeFileSync(modelPath, contentNewModel);
      }

      return true;
    } catch (e) {
      console.log(e);

      return false;
    }
  }
}

module.exports = { ModelGenerator };