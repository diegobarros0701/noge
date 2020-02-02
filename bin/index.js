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
  .command('scaffold <name> [actions...]')
  .description('create a model, controller and route')
  .option('--no-spec', 'do not generate spec file for generated model')
  .option('--empty-controller', 'generate a controller without default actions. This overrides the actions option')
  .option('-t, --table [name]', 'the corresponding table name of the model')
  .action(function (name, actions, options) {
    ScaffoldGenerator.go({ name, actions, options });
  });

program
  .command('controller <name> [actions...]')
  .description('create a controller')
  .option('--no-spec', 'do not generate spec file for generated controller')
  .option('--empty-controller', 'generate a controller without default actions. This overrides the actions option')
  .option('--async-await-style', 'generate controller actions using async await instead of promises')
  .action(async function (controllerName, actions, options) {
    ControllerGenerator.go({ name: controllerName, options, actions })
      .catch(error => console.log(error.message));
  });

program
  .command('model <name>')
  .description('create a model')
  .option('--no-spec', 'do not generate spec file for generated model')
  .option('-t, --table [name]', 'the corresponding table name of the model')
  .action(function (modelName, options) {
    ModelGenerator.go({ name: modelName, options })
      .catch(error => console.log(error.message));
  });

program
  .command('service <name>')
  .description('create a service')
  .option('--actions <actions>', 'specify which actions to generate for the service')
  .option('--project-path <path>', 'the path for project dir if it is different from the current dir')
  .option('--empty-body', 'do not generate actions for the service')
  .action(function (serviceName, options) {
    ServiceGenerator.go({ serviceName, options })
      .catch(error => console.log(error.message));
  });

program.parse(process.argv);