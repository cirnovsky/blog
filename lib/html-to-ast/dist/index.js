
'use strict'

if (process.env.NODE_ENV === 'production') {
  module.exports = require('./html-to-ast.cjs.production.min.js')
} else {
  module.exports = require('./html-to-ast.cjs.development.js')
}
