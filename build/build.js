const fs = require('fs')
const path = require('path')
const zlib = require('zlib')
const rollup = require('rollup')
const configs = require('./configs')

if (!fs.existsSync('dist')) {
  fs.mkdirSync('dist')
}

build(Object.keys(configs).map(key => configs[key]))


function build (builds) {
  let built = 0
  const total = builds.length
  const next = () => {
    buildEntry(builds[built]).then(() => {
      built++
      if (built < total) {
        next()
      }
    }).catch(logError)
  }

  next()
}


async function buildEntry({ input, output }) {
  // create a bundle
  const bundle = await rollup.rollup(input)
  await bundle.write(output);
  const res = await bundle.generate(output)
  await write(output.file, res.output[0].code)
}

function write (dest, code, zip) {
  return new Promise((resolve, reject) => {
    function report (extra) {
      console.log(blue(path.relative(process.cwd(), dest)) + ' ' + getSize(code) + (extra || ''))
      resolve()
    }
    fs.writeFile(dest, code, err => {
      if (err) return reject(err)
      zlib.gzip(code, (err, zipped) => {
        if (err) return reject(err)
        report(' (gzipped: ' + getSize(zipped) + ')')
      })
    })
  })
}

function getSize (code) {
  return (code.length / 1024).toFixed(2) + 'kb'
}

function logError (e) {
  console.log(e)
}

function blue (str) {
  return '\x1b[1m\x1b[34m' + str + '\x1b[39m\x1b[22m'
}