const { BaseGenerator } = require('./base_generator');
const inquirer = require('inquirer');
const fs = require('fs-extra');
const path = require('path');
const klaw = require('klaw-sync');
const nunjucks = require('nunjucks');
const logger = require('../logger');
const helpers = require('../helpers');
const shell = require('shelljs');
const prompts = require('../prompts');
const { Utils } = require('../utils');

class ProjectGenerator extends BaseGenerator {

  /**
   * 
   * @param {{ projetcName: String, options: { ignoreSetup?: Boolean, ignoreDependencies?: Boolean, silent?: Boolean } }} param0 
   */
  static async go({ projectPath, options = {} }) {
    try {
      let projectAnswers = {};

      let projectName = projectPath.split('/');
      projectName = projectName[projectName.length - 1];

      // throw new Error('error');
      if (!options.ignoreSetup)
        projectAnswers = await prompts.askForProjectSettings(projectName);

      projectAnswers.projectName = projectAnswers.projectName || projectName;
      projectAnswers.version = projectAnswers.version || '1.0.0';

      if (fs.existsSync(projectPath)) {
        logger.exists(projectPath);
      } else {
        fs.ensureDirSync(projectPath);
        logger.create(projectPath);
      }

      let items = klaw(helpers.LIB_PROJECT_TEMPLATE_PATH);

      let canOverwriteAll = false;
      for (let i = 0; i < items.length; i++) {
        let item = items[i];
        const projectTemplateFileOrDirAbsolutePath = item.path;
        const newProjectFileOrDirRelativePath = projectPath + path.sep + projectTemplateFileOrDirAbsolutePath.replace(helpers.LIB_PROJECT_TEMPLATE_PATH, '');
        const newProjectFileOrDirAbsolutePath = process.cwd() + path.sep + newProjectFileOrDirRelativePath;

        if (fs.lstatSync(projectTemplateFileOrDirAbsolutePath).isDirectory()) {
          if (fs.existsSync(newProjectFileOrDirAbsolutePath)) {
            logger.exists(newProjectFileOrDirRelativePath);
          } else {
            logger.create(newProjectFileOrDirRelativePath);

            fs.mkdirSync(newProjectFileOrDirAbsolutePath);
          }

        } else {
          if (fs.existsSync(newProjectFileOrDirAbsolutePath)) {
            let destinyFileContent = fs.readFileSync(newProjectFileOrDirAbsolutePath, { encoding: 'utf-8' });
            let templateFileContent = nunjucks.renderString(fs.readFileSync(projectTemplateFileOrDirAbsolutePath, { encoding: 'utf-8' }), projectAnswers);

            if (destinyFileContent == templateFileContent) {
              logger.identical(newProjectFileOrDirRelativePath);
            } else {
              if (canOverwriteAll) {
                this.createOrOverwriteProjectFile('overwrite', {
                  projectSettings: projectAnswers,
                  newProjectFileOrDirAbsolutePath,
                  newProjectFileOrDirRelativePath,
                  projectTemplateFileOrDirAbsolutePath
                });
              } else {
                logger.conflict(newProjectFileOrDirRelativePath);

                let answer = await prompts.askForOverwritePathMultiple(newProjectFileOrDirRelativePath);

                if (answer.overwrite || answer.overwriteAll) {
                  logger.overwrite(newProjectFileOrDirRelativePath);

                  let fileContent = fs.readFileSync(projectTemplateFileOrDirAbsolutePath, { encoding: 'utf-8' });
                  fileContent = nunjucks.renderString(fileContent, projectAnswers);
                  fs.writeFileSync(newProjectFileOrDirAbsolutePath, fileContent);

                  if (answer.overwriteAll) {
                    canOverwriteAll = true;
                  }

                } else if (answer.skip) {
                  logger.skip(newProjectFileOrDirRelativePath);
                } else if (answer.abort) {
                  logger.abort();

                  return false;
                }
              }
            }

          } else {
            this.createOrOverwriteProjectFile('create', {
              projectSettings: projectAnswers,
              newProjectFileOrDirAbsolutePath,
              newProjectFileOrDirRelativePath,
              projectTemplateFileOrDirAbsolutePath
            });
          }
        }
      }

      if (!options.ignoreDependencies) {
        logger.run(`yarn install --cwd ${projectPath}`);

        if (shell.exec(`yarn install --cwd ${projectPath}`).code !== 0) {
          shell.echo("Error: failed to installing dependencies. Run 'yarn install' manually inside the project folder");
        }
      }

      return true;
    } catch (e) {
      console.log(e);

      return false;
    }
  }

  static createOrOverwriteProjectFile(actionType, { projectSettings, newProjectFileOrDirAbsolutePath, newProjectFileOrDirRelativePath, projectTemplateFileOrDirAbsolutePath }) {
    if (actionType == 'create') {
      logger.create(newProjectFileOrDirRelativePath);
    } else {
      logger.overwrite(newProjectFileOrDirRelativePath);
    }

    let fileContent = fs.readFileSync(projectTemplateFileOrDirAbsolutePath, { encoding: 'utf-8' });
    fileContent = nunjucks.renderString(fileContent, projectSettings);
    fs.writeFileSync(newProjectFileOrDirAbsolutePath, fileContent);
  }
}

module.exports = { ProjectGenerator };