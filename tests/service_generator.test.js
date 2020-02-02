/* eslint-disable no-undef */
const { ProjectGenerator } = require('../lib/generators/project_generator');
const { ServiceGenerator } = require('../lib/generators/service_generator');
const helpers = require('../lib/helpers');
const fs = require('fs-extra');
const path = require('path');
const nunjucks = require('nunjucks');

const projectPath = 'tests/projeto';
const projectServicesPath = `${projectPath}/src/services`;

beforeEach(async () => {
  await ProjectGenerator.go({
    projectPath,
    options: { ignoreSetup: true, ignoreDependencies: true }
  });
}, 15000);

afterEach(() => {
  fs.removeSync(projectPath);
});

test("should create a service file", async () => {
  /**
   * Steps:
   * 
   * Run the service generator
   */

  /**
   * How to test:
   * 
   * Check if the service file exists in ${projectPath}/src/services/
   */

  let serviceSettings = {
    serviceName: 'user',
    options: {
      projectPath: 'tests/projeto'
    }
  };

  await ServiceGenerator.go(serviceSettings);

  expect(() => {
    fs.readFileSync(path.join(serviceSettings.options.projectPath, 'src', 'services', 'UserService.js'));
  }).not.toThrow('no such file');
});

test("should create a service at the src/services inside the specified path", async () => {
  let projectSettings = {
    serviceName: 'User',
    options: {
      projectPath: 'tests/projeto'
    }
  };

  await ServiceGenerator.go(projectSettings);

  expect(() => {
    fs.readFileSync(path.join(projectSettings.options.projectPath, 'src', 'services', 'UserService.js'));
  }).not.toThrow('no such file');
});

test("should not create a service at the specified path if the path not exists", async () => {
  expect.assertions(1);

  let serviceSettings = {
    serviceName: 'User',
    options: {
      projectPath: 'dir/not/exists'
    }
  };

  try {
    await ServiceGenerator.go(serviceSettings);
  } catch (e) {
    expect(e.message).toMatch('no such file');
  }
});

test("should create a service with requested params replaced", async () => {
  /**
   * Steps:
   * 
   * Run the service generator
   */

  /**
   * How to test:
   * 
   * Read the service template file
   * Get the contents of the service template file
   * Replace the required params in the contents of the service template file
   * Try to write the replaced content in the destiny folder
   * Read the created file
   * Check if the file contains the replaced contents
   */

  let serviceSettings = {
    serviceName: 'user',
    options: {
      projectPath: projectPath,
      emptyBody: true
    }
  };

  let newServiceRelativePath = path.join(serviceSettings.options.projectPath, helpers.NEW_SERVICE_RELATIVE_PATH, 'UserService.js');

  await ServiceGenerator.go(serviceSettings);

  let serviceTemplate = fs.readFileSync(helpers.LIB_SERVICE_TEMPLATE_DEFAULT_PATH, { encoding: 'utf-8' });
  let serviceTemplateWithParamsReplaced = nunjucks.renderString(serviceTemplate, { modelClassName: 'User', modelFileName: 'User', serviceClassName: 'UserService' });

  let createdServiceContents = fs.readFileSync(newServiceRelativePath, { encoding: 'utf-8' });

  expect(serviceTemplateWithParamsReplaced).toBe(createdServiceContents);
});

test("should create a service with an empty body even when actions are specified", async () => {
  let serviceSettings = {
    serviceName: 'user',
    options: {
      projectPath: projectPath,
      actions: 'get',
      emptyBody: true
    }
  };

  let newServiceRelativePath = path.join(serviceSettings.options.projectPath, helpers.NEW_SERVICE_RELATIVE_PATH, 'UserService.js');

  await ServiceGenerator.go(serviceSettings);

  let serviceTemplate = fs.readFileSync(helpers.LIB_SERVICE_TEMPLATE_DEFAULT_PATH, { encoding: 'utf-8' });
  let serviceTemplateWithParamsReplaced = nunjucks.renderString(serviceTemplate, { modelClassName: 'User', modelFileName: 'User', serviceClassName: 'UserService' });

  let createdServiceContents = fs.readFileSync(newServiceRelativePath, { encoding: 'utf-8' });

  expect(serviceTemplateWithParamsReplaced).toBe(createdServiceContents);
});

test("should not create a service without a get function", async () => {
  let serviceSettings = {
    serviceName: 'user',
    options: {
      projectPath: projectPath,
      actions: 'get'
    }
  };


  let newServiceRelativePath = path.join(serviceSettings.options.projectPath, helpers.NEW_SERVICE_RELATIVE_PATH, 'UserService.js');

  await ServiceGenerator.go(serviceSettings);

  let serviceTemplate = fs.readFileSync(helpers.LIB_SERVICE_TEMPLATE_DEFAULT_PATH, { encoding: 'utf-8' });
  let serviceTemplateWithParamsReplaced = nunjucks.renderString(serviceTemplate, { modelClassName: 'User', modelFileName: 'User', serviceClassName: 'UserService', actions: { get: true } });

  let createdServiceContents = fs.readFileSync(newServiceRelativePath, { encoding: 'utf-8' });

  expect(serviceTemplateWithParamsReplaced).toBe(createdServiceContents);
});