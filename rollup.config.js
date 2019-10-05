const { resolve } = require('path')

require('ts-node').register({
    project: resolve(__dirname, 'test/tsconfig.json')
})

module.exports = require('./rollup.config.ts')
