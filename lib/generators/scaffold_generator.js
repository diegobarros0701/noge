const { ControllerGenerator } = require('./controller_generator');
const { ModelGenerator } = require('./model_generator');

class ScaffoldGenerator {
  static async go({ name, options = {}, actions = [] }) {
    await ControllerGenerator.go({ name, options, actions });
    await ModelGenerator.go({ name, options });
  }
}

module.exports = { ScaffoldGenerator };