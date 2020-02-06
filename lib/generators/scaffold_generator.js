const { ControllerGenerator } = require('./controller_generator');
const { ModelGenerator } = require('./model_generator');
const { ServiceGenerator } = require('./service_generator');

class ScaffoldGenerator {
  static async go({ name, options = {} }) {
    let controllerOptions = {
      empty: options.emptyController,
      actions: options.actionsController,
      noSpec: options.noSpec
    };

    let serviceOptions = {
      empty: options.emptyService,
      actions: options.actionsService,
      noSpec: options.noSpec
    };

    let modelOptions = {
      noSpec: options.noSpec,
      table: options.table,
      belongsTo: options.belongsTo,
      hasMany: options.hasMany,
      manyToMany: options.manyToMany
    };

    await ControllerGenerator.go({ name, options: controllerOptions });
    await ModelGenerator.go({ name, options: modelOptions });
    await ServiceGenerator.go({ serviceName: name, options: serviceOptions });
  }
}

module.exports = { ScaffoldGenerator };