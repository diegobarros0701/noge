const { ControllerGenerator } = require('./controller_generator');
const { ModelGenerator } = require('./model_generator');
const { ServiceGenerator } = require('./service_generator');

class ScaffoldGenerator {
  static async go({ name, options = {}, actions = [] }) {
    await ControllerGenerator.go({ name, options, actions });
    await ModelGenerator.go({ name, options });
    await ServiceGenerator.go({ serviceName: name, options });
  }
}

module.exports = { ScaffoldGenerator };