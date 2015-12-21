const FancyElement = require('./Element')
const Section = require('./Section')
const convert = require('../util/convert-element')
const keycodes = require('../util/keycodes')

module.exports = class Editor {
  constructor () {
    this.el = document.createElement('div')
    this.el.className = 'editor'
    this.el.contentEditable = true

    this.sections = []
    this.activeSection = null

    this.attachListeners()
  }

  bootstrap () {
    this.insertSection()
      .insertParagraph()
      .setText('Testing')
      .focus()
  }

  attachListeners () {
    this.el.addEventListener('keydown', evt => {
      if (evt.keyCode === keycodes.ENTER) {
        if (!evt.shiftKey) {
          evt.preventDefault()
        }

        if (evt.ctrlKey) {
          this.insertSection().insertParagraph().focus()
        } else if (!evt.shiftKey) {
          this.getActiveSection().insertParagraph().focus()
        }
      }
    })
  }

  insertSection () {
    let section = new Section
    this.sections.push(section)
    this.el.appendChild(section.el)
    return section
  }

  removeSection () {

  }

  updateSection () {

  }

  getActiveSection () {
    for (var i = 0; i < this.sections.length; i++) {
      if (this.sections[i].isActive()) {
        return this.sections[i]
      }
    }

    return null
  }

  createSection () {
    let el = document.createElement('div')
    el.className = 'section'
    this.sections.push(el)
    return el
  }

  createElement (type) {
    return document.createElement(type)
  }

  convertElement (el, type) {
    if (el === this.el) {
      throw new Error('Tried to convert main element')
    }
    if (!el) {
      throw new Error('Tried to convert empty element')
    }

    let newEl = convert(el, type)
    this.replaceElement(el, newEl)
  }

  replaceElement (oldEl, newEl) {
    let parent = oldEl.parentElement
    parent.replaceChild(newEl, oldEl)

    if (oldEl === this.activeElement) {
      this.activeElement = newEl
    }
  }

  focusElement (el) {
    let range = document.createRange()
    range.setStart(el, 0)
    range.setEnd(el, 0)
    range.collapse(true)

    let selection = document.getSelection()
    selection.removeAllRanges()
    selection.addRange(range)
    el.focus()
  }

  getActiveElement () {
    let section = this.getActiveSection()
    return section && section.getActiveElement()
  }
}
