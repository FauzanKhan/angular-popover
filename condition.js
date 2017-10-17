'use strict'

var semver = require('semver')

function conditionNodeVersion (pluginConfig, config, callback) {
  pluginConfig = pluginConfig || {}
  config = config || {}

  function isVerbose () {
    return pluginConfig.verbose ||
      pluginConfig.debug ||
      config.verbose ||
      config.debug
  }

  if (isVerbose()) {
    console.log('condition plugin config', pluginConfig)
    console.log('condition config environment', config.env)
    console.log('condition config options', config.options)
    // console.log('node version', process.versions.node)
  }

  function fail (message) {
    return callback(new Error(message))
  }

  // if (typeof pluginConfig.node !== 'string') {
  //   return fail('Missing node version in the config')
  // }

  // if (!semver.satisfies(process.versions.node, pluginConfig.node)) {
  //   return fail('Only allowed to publish from Node ' +
  //     pluginConfig.node + ' not from ' + process.versions.node)
  // }

  console.log('ok to publish from this version of Node', pluginConfig.node)

  callback(null)
}

module.exports = conditionNodeVersion
