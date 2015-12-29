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
    this.el.innerHTML = this.text.replace(/\n/g, '<br>')
  }

  setText (text) {
    this.text = text || ''
    this.render()
    return this
  }

  getText (start, end) {
    start = start || 0
    end = end || this.text.length
    return this.text.slice(start, end)
  }

  getLength () {
    return this.getText().length
  }

  setTag (type) {
    let newElement = convert(this.el, type)
    this.el.parentNode.replaceChild(newElement, this.el)
    this.el = newElement
    this.focus()
  }

  update (payload) {
    let newFocus = 0

    if (payload.action === 'delete') {
      let start = payload.start
      let end = payload.end
      if (start > 0 && start === end) {
        start -= 1
      }
      this.delete(start, end)
      newFocus = start
    }

    this.render()
    this.focus(newFocus)
  }

  insert (text, index) {
    this.replaceRange(index, index, text)
    this.focus(index + text.length)
  }

  delete (start, end) {
    this.replaceRange(start, end, '')
  }

  replaceRange (start, end, text) {
    text = text || ''
    this.text = this.text.slice(0, start) + text + this.text.slice(end)
    this.render()
    this.focus(start + text.length)
  }

  focus (index) {
    index = index || 0

    if (index === 'end') {
      index = this.getLength()
    }

    let range = document.createRange()
    let children = Array.from(this.el.childNodes)
    let candidates = children.slice()
    let child

    if (!candidates.length) {
      range.setStart(this.el, 0)
    }

    while (child = candidates.shift()) {
      if (child.nodeType === Node.TEXT_NODE) {
        if (index > child.length) {
          index -= child.length
          continue
        } else {
          range.setStart(child, index)
          break
        }
      } else {
        if (index === 0) {
          range.setStart(this.el, children.indexOf(child))
          break
        } else {
          index -= 1
          continue
        }
      }
    }

    range.collapse(true)
    let selection = document.getSelection()
    selection.removeAllRanges()
    selection.addRange(range)

    let focusable = this.el.closest('[contentEditable="true"]')
    if (focusable) {
      focusable.focus()
    }
  }
}
