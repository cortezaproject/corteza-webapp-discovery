const buildVueConfig = require('./vue.config-builder')

module.exports = buildVueConfig({
  appFlavour: 'Corteza',
  appName: 'discovery',
  appLabel: 'Corteza Discovery',
  theme: 'corteza-base',
  packageAlias: 'corteza-webapp-discovery',
})
