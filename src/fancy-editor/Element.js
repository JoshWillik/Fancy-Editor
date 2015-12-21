const convert = require('../util/convert-element')

module.exports = class Element {
  constructor (el, editor) {
    this.el = el
    this.editor = editor
  }

  setTag (type) {
    this.editor.convertElement(this.el, type)
  }
}
