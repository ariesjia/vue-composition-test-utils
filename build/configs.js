const path = require('path')
const typescript = require('rollup-plugin-typescript2')
const commonjs = require('rollup-plugin-commonjs')
const { uglify } = require('rollup-plugin-uglify')
const { terser } = require('rollup-plugin-terser')
const pkg = require('../package.json')

const resolve = _path => path.resolve(__dirname, '../', _path)

const configs = {
  cjs: {
    input: resolve('src/index.ts'),
    file: pkg.main,
    format: 'cjs',
    env: 'production'
  },
  es: {
    input: resolve('src/index.ts'),
    file: pkg.module,
    format: 'es',
    env: 'production'
  },
}

const compressPlugins = {
  cjs: uglify,
  es: terser
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
