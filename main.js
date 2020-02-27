'use strict';

const settings = require('./settings.js')
const fs = require('fs')

const entries = []

for (let filename of settings.files) {
  console.log("Doing file: " + settings.path + filename + settings.ext)
  const lines = fs.readFileSync(settings.path + filename + settings.ext, "utf8").split('\r\n')
  console.log(lines.length)
  let entry = false
  let namespace = false
  for (let s of lines) {
    const md = s.match(/^(const|var) (\w+) = {/)
    if (md) {
      namespace = md[2]
      console.log("Namespace: " + namespace)
    }
    else if (s.match(/^ *\/\/@DOC/)) {
      console.log("New entry")
      entry = { lines:[''] }
      if (s.startsWith('  ')) entry.namespace = namespace
    }
    else if (s.match(/^ *\/\//) && entry) {
      const s2 = s.replace(/^ *\/\/ /, '')
      if (s2.match(/^ *$/)) {
        entry.lines.push('')
      }
      else {
        entry.lines[entry.lines.length - 1] += ' ' + s2
      }
    }
    else if (entry) {
      let md = s.match(/function (\w+) *\((.*)\)/)
      if (md) {
        entry.name = md[1]
        entry.params = md[2]
        entries.push(entry)
      }
      else {
        md = s.match(/(var|let|const) +(\w+) *= * function *\((.*)\)/)
        if (md) {
          entry.name = md[2]
          entry.params = md[3]
          entries.push(entry)
        }
        else {
          console.log("Failed to process function first line: " + s)
        }
      }
      entry = false
      console.log("Entry done")
    }
  }
  console.log(entries)
}