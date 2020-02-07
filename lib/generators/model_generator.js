const { BaseGenerator } = require('./base_generator');
const fs = require('fs');
const logger = require('../logger');
const prompts = require('../prompts');
const { Utils } = require('../utils');

class ModelGenerator extends BaseGenerator {
  // noge model animal --belongs-to owner[ownerId,id]
  static async go({ name, options = {} }) {
    options.table = options.table || name.toLowerCase();

    let className = Utils.sanitizeName(name, 'class');
    let modelPath = this.DIR_PATHS.MODELS + className + this.FILE_EXT;
    let tableName = options.table;

    let relations = this.getRelations(options);

    let contentNewModel = this.getTemplate(this.TEMPLATE_PATHS.MODEL, { className, tableName, ...relations });

    if (fs.existsSync(modelPath)) {
      let contentExistingModel = fs.readFileSync(modelPath, { encoding: 'utf-8' });

      if (contentNewModel == contentExistingModel) {
        logger.identical(modelPath);
      } else {
        logger.conflict(modelPath);
        let canOverwrite = await prompts.askForOverwritePath(modelPath);

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
  }

  static getRelations(options) {
    let relations = [];
    let relationsClasses = new Set();

    if (options.belongsTo) {
      let relationType = 'belongs_to';

      options.belongsTo.forEach(function (belongsTo) {
        let relationChunks = belongsTo.split(':');

        if (relationChunks.length > 3) {
          throw new Error('Error: Invalid relation expression');
        }

        let relationName = relationChunks[0];

        relationsClasses.add(Utils.sanitizeName(relationName, 'class'));
        relations.push({
          relationType,
          name: relationName.toLowerCase(),
          class: Utils.sanitizeName(relationName, 'class'),
          from: {
            table: options.table,
            column: relationChunks[2] || 'id'
          },
          to: {
            table: relationName.toLowerCase(),
            column: relationChunks[1] || (options.table + '_id')
          }
        });
      });

    }

    if (options.hasMany) {
      let relationType = 'has_many';

      options.hasMany.forEach(function (hasMany) {
        let relationChunks = hasMany.split(':');

        if (relationChunks.length > 3) {
          throw new Error('Error: Invalid relation expression');
        }

        let relationName = relationChunks[0];
        relationsClasses.add(Utils.sanitizeName(relationName, 'class'));
        relations.push({
          relationType,
          name: Utils.plural(relationName.toLowerCase()),
          class: Utils.sanitizeName(relationName, 'class'),
          from: {
            table: options.table,
            column: relationChunks[2] || 'id'
          },
          to: {
            table: relationName.toLowerCase(),
            column: relationChunks[1] || (options.table + '_id')
          }
        });
      });
    }

    if (options.manyToMany) {
      let relationType = 'many_to_many';

      options.manyToMany.forEach(function (manyToMany) {
        let relationChunks = manyToMany.split(':');

        let relationName = relationChunks[0];
        let relationsNames = relationName.split('_');
        // noge model person --many-to-many person_movie:person_id:movie_id:filme:id:id
        relationsClasses.add(Utils.sanitizeName((relationChunks[3] || relationsNames[1]), 'class'));
        relations.push({
          relationType,
          name: Utils.plural((relationChunks[3] || relationsNames[1]).toLowerCase()),
          class: Utils.sanitizeName((relationChunks[3] || relationsNames[1]), 'class'),
          from: {
            //`middle_model`:`middle_model_left_column`:`middle_model_right_colmun`:`right_model`:`right_model_column`:`left_model_column`
            table: options.table,
            column: relationChunks[5] || 'id'
          },
          through: {
            from: {
              table: relationName.toLowerCase(), // relationsNames[0],
              column: relationChunks[1] || (relationsNames[0] + '_id')
            },
            to: {
              table: relationName.toLowerCase(), //relationsNames[1],
              column: relationChunks[2] || (relationsNames[1] + '_id')
            }
          },
          to: {
            table: relationChunks[3] || relationsNames[1],
            column: relationChunks[4] || 'id'
          }
        });
      });
    }

    return {
      relations,
      relationsClasses: Array.from(relationsClasses)
    };
  }
}

module.exports = { ModelGenerator };