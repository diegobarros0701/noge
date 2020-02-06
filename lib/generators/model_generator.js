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

        // needs to sanitize the relation name to snaked case (ex.: StudyPlan -> study_plan; studyPlan -> study_plan)
        let relationName = relationChunks[0];
        let relationClass = Utils.sanitizeName(relationName, 'class');
        let relationEndTable = relationName;
        let relationFrom = relationChunks[2];
        let relationTo = relationChunks[1];

        relationsClasses.add(relationClass);
        relations.push({
          relationType,
          relationName,
          relationClass,
          relationParentTable: options.table,
          relationFrom,
          relationEndTable,
          relationTo
        });
      });

    }

    if (options.hasMany) {
      let relationType = 'has_many';

      options.hasMany.forEach(function (hasMany) {
        let relationChunks = hasMany.split(':');

        // needs to sanitize the relation name to snaked case (ex.: StudyPlan -> study_plan; studyPlan -> study_plan)
        let relationName = relationChunks[0];
        let relationClass = Utils.sanitizeName(relationChunks[0], 'class');
        let relationEndTable = relationName;
        let relationFrom = relationChunks[2];
        let relationTo = relationChunks[1];

        relationsClasses.add(relationClass);
        relations.push({
          relationType,
          relationName,
          relationClass,
          relationParentTable: options.table,
          relationFrom,
          relationEndTable,
          relationTo
        });
      });
    }

    if (options.manyToMany) {
      let relationType = 'many_to_many';

      options.manyToMany.forEach(function (manyToMany) {
        let relationChunks = manyToMany.split(':');

        // noge model person --many-to-many movie:id:person_movies:movieId:personId:id
        let relationName = relationChunks[0];
        let relationClass = Utils.sanitizeName(relationChunks[0], 'class');
        let relationParentTableColumn = relationChunks[5];
        let relationEndTable = relationName;
        let relationEndTableColumn = relationChunks[1];
        let relationMidTable = relationChunks[2];
        let relationMidTableFromColumn = relationChunks[3];
        let relationMidTableToColumn = relationChunks[4];


        relationsClasses.add(relationClass);
        relations.push({
          relationType,
          relationName,
          relationClass,
          relationParentTable: options.table,
          relationParentTableColumn,
          relationMidTable,
          relationMidTableFromColumn,
          relationMidTableToColumn,
          relationEndTable,
          relationEndTableColumn
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