exports.config = {
  framework: 'jasmine',
  capabilities: {
    'browserName': 'chrome'
  },
  seleniumAddress: 'http://localhost:4444/wd/hub',
  directConnect: true,
  specs: ['../test/e2e/*.js']
}
