const path = require('path');

const FILE_EXT = '.js';

const LIB_ROOT_PATH = path.join(__dirname, '..', path.sep);
const LIB_TEMPLATES_PATH = path.join(LIB_ROOT_PATH, 'templates', path.sep);
const LIB_PROJECT_TEMPLATE_PATH = path.join(LIB_TEMPLATES_PATH, 'project', path.sep);
// const LIB_SERVICE_TEMPATE_FILE = path.join(LIB_TEMPLATES_PATH, 'service', 'default.njk');
const LIB_SERVICE_TEMPLATE_PATH = path.join(LIB_TEMPLATES_PATH, 'service');
const LIB_SERVICE_TEMPLATE_DEFAULT_PATH = path.join(LIB_SERVICE_TEMPLATE_PATH, 'default.njk');


const NEW_SERVICE_RELATIVE_PATH = path.join('src', 'services');

module.exports = {
  LIB_ROOT_PATH,
  LIB_TEMPLATES_PATH,
  LIB_PROJECT_TEMPLATE_PATH,
  LIB_SERVICE_TEMPLATE_PATH,
  LIB_SERVICE_TEMPLATE_DEFAULT_PATH,
  NEW_SERVICE_RELATIVE_PATH,
  FILE_EXT
};