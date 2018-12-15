const fs = require('fs')
const path = require('path')

const libs = path.join(__dirname, './@types/')
var target = path.join(__dirname, '../node_modules/@types/')

var files = fs.readdirSync(libs, 'utf8')

for (let filename of files) {
  let name = filename.replace('.d.ts', '')
  let libF = path.join(target, name)
  if (!fs.existsSync(libF)) {
    fs.mkdirSync(libF)
  }
  fs.copyFileSync(path.join(libs, filename), path.join(libF, 'index.d.ts'))
  console.log(`${filename} -> ${libF}`)
}
