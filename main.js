'use strict';

const settings = require('./settings.js')
const fs = require('fs')

const entries = []

for (let filename of settings.files) {
  console.log("Doing file: " + settings.path + filename + settings.ext)
  const lines = fs.readFileSync(settings.path + filename + settings.ext, "utf8").split(settings.linebreak)
  let entry = false
  let namespace = false
  for (let s of lines) {
    const md = s.match(/^(const|var) (\w+) = {/)
    if (md) {
      namespace = md[2]
    }
    
    else if (s.match(new RegExp('^ *\/\/' + settings.docflag))) {
      entry = { lines:[''] }
    }
    
    else if (s.match(new RegExp('^ *\/\/' + settings.undocflag))) {
      entry.note = true
      entries.push(entry)
      entry = false
    }

    else if (s.match(/^ *\/\//) && entry) {
      const s2 = s.replace(/^ *\/\/ ?/, '')
      const lastIndex = entry.lines.length - 1
      if (s2 === '' || s2 === '```' || s2.startsWith('    ') || s2.startsWith('*')) {
        if (entry.lines[lastIndex] === '') {
          entry.lines[lastIndex] = s2
        }
        else {
          entry.lines.push(s2)
        }
        entry.lines.push('')
      }
      else {
        if (entry.lines[lastIndex] === '') {
          entry.lines[lastIndex] += s2
        }
        else {
          entry.lines[lastIndex] += ' ' + s2
        }
      }
    }
    
    else if (entry) {
      const md1 = s.match(/function (\w+) *\((.*)\)/)
      const md2 = s.match(/(var|let|const) +(\w+) *= *function *\((.*)\)/)
      const md3 = s.match(/(\w+):function\((.*)\)/)
      const md4 = s.match(/(\w+).(\w+) *= *function *\((.*)\)/)
      if (md1) {
        entry.name = md1[1]
        entry.params = md1[2]
        entries.push(entry)
      }
      else if (md2) {
        entry.name = md2[2]
        entry.params = md2[3]
        entries.push(entry)
      }
      else if (md3) {
        entry.name = md3[1]
        entry.params = md3[2]
        entry.namespace = namespace
        entries.push(entry)
      }
      else if (md4) {
        entry.name = md4[2]
        entry.params = md4[3]
        entry.namespace = md4[1]
        entries.push(entry)
      }
      else {
        console.log("Failed to process function first line: " + s)
      }
      entry = false
    }
  }
  
}
console.log("Found " + entries.length + " entries.")

const out = []
for (let entry of entries) {
  if (!entry.note) {
    out.push('### Function: _' + (entry.namespace ? entry.namespace + '.' : '') + entry.name + '_(' + entry.params + ')')
    out.push('')
  }
  for (let s of entry.lines) out.push(s)
  out.push('')
  out.push('')
  out.push('')
}
fs.writeFileSync(settings.path + settings.out, out.join(settings.linebreak))
