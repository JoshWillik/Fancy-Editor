const convert = require('../util/convert-element')
const Element = require('./Element')

module.exports = class TextElement extends Element {
  constructor (text) {
    let el = document.createElement('p')
    super(el)

    this.text = null
    this.setText(text)
    this.render()
  }

  render () {
    this.el.innerHTML = this.text
  }

  setText (text) {
    this.text = text || ''
    this.render()
    return this
  }

  setTag (type) {
    let newElement = convert(this.el, type)
    this.el.parentNode.replaceChild(newElement, this.el)
    this.el = newElement
    this.focus()
  }

  focus () {
    let range = document.createRange()
    if (this.el.firstChild) {
      range.setStart(this.el.firstChild, this.el.firstChild.length)
    } else {
      range.setStart(this.el, 0)
    }
    range.collapse(true)
    let selection = document.getSelection()
    selection.removeAllRanges()
    selection.addRange(range)

    let focusable = this.el.closest('[contentEditable="true"]')
    if (focusable) {
      console.log(selection, focusable)
      focusable.focus()
    } else {
      console.log('NOOO')
    }
  }
}
