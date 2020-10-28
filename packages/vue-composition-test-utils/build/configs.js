const path = require('path')
const typescript = require('rollup-plugin-typescript2')
const commonjs = require('rollup-plugin-commonjs')
const { uglify } = require('rollup-plugin-uglify')
const pkg = require('../package.json')

const resolve = _path => path.resolve(__dirname, '../', _path)

const configs = {
  es: {
    input: resolve('src/index.ts'),
    file: pkg.main,
    format: 'cjs',
    env: 'production'
  },
}

const compressPlugins = {
  es: uglify
}

function genConfig (opts) {
  const config = {
    input: {
      input: opts.input,
      plugins: [
        commonjs({
          include: 'node_modules/**',
        }),
        typescript({
        }),
      ],
      external: [
        '@vue/test-utils'
      ],
    },
    output: {
      file: opts.file,
      format: opts.format,
      exports: 'named',
    }
  }
  const method = compressPlugins[opts.format]
  if ( opts.env === 'production' && method ) {
    config.input.plugins.push(
      method()
    )
  }
  return config
}

function mapValues (obj, fn) {
  const res = {}
  Object.keys(obj).forEach(key => {
    res[key] = fn(obj[key], key)
  })
  return res
}

module.exports = mapValues(configs, genConfig)
