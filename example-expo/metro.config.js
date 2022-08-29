const { getDefaultConfig } = require('@expo/metro-config')
const escape = require('escape-string-regexp')
const exclusionList = require('metro-config/src/defaults/exclusionList')
const path = require('path')

const examplePak = require('../example/package.json')
const pak = require('../package.json')

const config = getDefaultConfig(__dirname)

const root = path.resolve(__dirname, '..')
const exampleRoot = path.resolve(__dirname, '../example')

const modules = Object.keys({
  ...pak.peerDependencies,
})

const exampleModules = Object.keys({
  ...examplePak.dependencies,
})

module.exports = {
  ...config,
  projectRoot: __dirname,
  watchFolders: [root, exampleRoot],

  // We need to make sure that only one version is loaded for peerDependencies
  // So we block them at the root, and alias them to the versions in example's node_modules
  resolver: {
    ...config.resolver,
    blacklistRE: exclusionList(
      [
        ...modules.map(
          (m) => new RegExp(`^${escape(path.join(root, 'node_modules', m))}\\/.*$`),
        ), ...exampleModules.map(
          (m) => new RegExp(`^${escape(path.join(exampleRoot, 'node_modules', m))}\\/.*$`),
        ),
      ],
    ),

    extraNodeModules: [...modules, ...exampleModules].reduce((acc, name) => {
      acc[name] = path.join(__dirname, 'node_modules', name)
      return acc
    }, {}),
  },

  transformer: {
    ...config.transformer,
    getTransformOptions: () => ({
      transform: {
        experimentalImportSupport: false,
        inlineRequires: true,
      },
    }),
  },
}
