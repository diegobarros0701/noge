#! /usr/bin/env node

const program = require('commander');
const { ScaffoldGenerator } = require('../lib/generators/scaffold_generator');
const { ModelGenerator } = require('../lib/generators/model_generator');
const { ControllerGenerator } = require('../lib/generators/controller_generator');
const { ProjectGenerator } = require('../lib/generators/project_generator');
const { ServiceGenerator } = require('../lib/generators/service_generator');
const chalk = require('chalk');
const figlet = require('figlet');

console.log(
  chalk.yellow(
    figlet.textSync('NOGE', { horizontalLayout: 'full' })
  ), chalk.cyanBright('\n Generator for Node.js web projects\n')
);

program.
  command('create <path>')
  .description('create a new project')
  .option('-s', '--no-specs', 'create project without the tests folder')
  .option('--ignore-setup', 'ignore the initial setup of the project (name and version)')
  .option('--ignore-dependencies', 'ignore the install of the node_modules')
  .option('--silent', 'do not show any logs while creating')
  .action(async function (projectPath, options) {
    ProjectGenerator.go({ projectPath, options });
  });

program
  .command('scaffold <name>')
  .description('create a model, controller and route')
  .option('--empty-controller', 'generate a controller without default actions. This overrides the --actions-controller')
  .option('--empty-service', 'generate a service without default actions. This overrides the --actions-service')
  .option('--actions-controller <actions>', 'specify wich actions to generate: Available values are: index, show, create, update and destroy')
  .option('--actions-service <actions>', 'specify wich actions to generate: Available values are: get, getOne, insert, update, destroy')
  .option('--no-spec', 'do not generate spec file for generated model')
  .option('-t, --table [name]', 'the corresponding table name of the model')
  .option('--belongs-to <relation>', 'the belongs to relation', (relation, relations) => {
    relations.push(relation);

    return relations;
  }, [])
  .option('--has-many <relation>', 'the has many relation', (relation, relations) => {
    relations.push(relation);

    return relations;
  }, [])
  .option('--many-to-many <relation>', 'the many to many relation', (relation, relations) => {
    relations.push(relation);

    return relations;
  }, [])
  .action(function (name, options) {
    ScaffoldGenerator.go({ name, options });
  });

program
  .command('controller <names...>')
  .description('create a controller')
  .option('--actions <actions>', 'specify wich actions to generate: Available values are: index, show, create, update and destroy')
  .option('--async-await-style', 'generate controller actions using async await instead of promises')
  .option('--empty', 'generate a controller without default actions. This overrides the --actions')
  .option('--no-spec', 'do not generate spec file for generated controller')
  .action(async function (controllersNames, options) {

    controllersNames.forEach(function (controllerName) {
      ControllerGenerator.go({ name: controllerName, options })
        .catch(error => console.log(error.message));
    });
  });

program
  .command('model <names...>')
  .description('create a model')
  .option('--belongs-to <relation>', 'the belongs to relation', (relation, relations) => {
    relations.push(relation);

    return relations;
  }, [])
  .option('--has-many <relation>', 'the has many relation', (relation, relations) => {
    relations.push(relation);

    return relations;
  }, [])
  .option('--many-to-many <relation>', 'the many to many relation', (relation, relations) => {
    relations.push(relation);

    return relations;
  }, [])
  .option('--no-spec', 'do not generate spec file for generated model')
  .option('-t, --table [name]', 'the corresponding table name of the model')
  .action(function (modelsNames, options) {

    modelsNames.forEach(function (modelName) {
      ModelGenerator.go({ name: modelName, options })
        .catch(error => console.log(error.message));
    });
  });

program
  .command('service <names...>')
  .description('create a service')
  .option('--actions <actions>', 'specify wich actions to generate: Available values are: get, getOne, insert, update, destroy')
  .option('--empty', 'generate a service without default actions. This overrides the --actions')
  .option('--project-path <path>', 'the path for project dir if it is different from the current dir')
  .action(function (servicesNames, options) {

    servicesNames.forEach(function (serviceName) {
      ServiceGenerator.go({ serviceName, options })
        .catch(error => console.log(error.message));
    });
  });

program.parse(process.argv);