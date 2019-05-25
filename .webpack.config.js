const nodeExternals = require('webpack-node-externals');

module.exports = config => {
  config.target = 'electron-renderer';
  config.externals = [nodeExternals()];
  return config;
};
