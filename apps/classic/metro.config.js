const { getDefaultConfig } = require('expo/metro-config');
const path = require('path');

const projectRoot = __dirname;
const workspaceRoot = path.resolve(projectRoot, '../..');

const config = getDefaultConfig(projectRoot);

// Watch all files in the monorepo so Metro reloads on changes inside packages/
config.watchFolders = [workspaceRoot];

// Let Metro resolve modules from the workspace root and the app's own node_modules
config.resolver.nodeModulesPaths = [
  path.resolve(projectRoot, 'node_modules'),
  path.resolve(workspaceRoot, 'node_modules'),
];

// Required for npm workspaces: disable hierarchical lookup so Metro
// doesn't try to walk past projectRoot looking for packages.
config.resolver.disableHierarchicalLookup = true;

module.exports = config;
