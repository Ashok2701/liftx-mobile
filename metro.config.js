const { getDefaultConfig } = require('expo/metro-config');

const config = getDefaultConfig(__dirname);

// Support path aliases
config.resolver.extraNodeModules = {
  '@': `${__dirname}/src`,
};

module.exports = config;
