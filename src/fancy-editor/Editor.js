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
    this.bootstrap()
  }

  bootstrap () {
    this.insertSection()
      .insertParagraph()
      .setText('Testing')
      .focus()
  }

  attachListeners () {
    this.el.addEventListener('click', evt => {
      if (!evt.target.classList.contains('section')) {
        return
      }
    })

    this.el.addEventListener('keydown', evt => {
      if (evt.keyCode === keycodes.ENTER) {
        evt.preventDefault()
        this.getActiveSection().insertParagraph().focus()
      }

      if (evt.target === this.el && keycodes.isNormalCharacter(evt.keyCode)) {
      }
    })
  }

  insertSection () {
    let section = new Section

    section.el.addEventListener('select', evt => {
      console.log('element selected')
      this.activeSection = section
    })

    this.sections.push(section)
    this.el.appendChild(section.el)
    return section
  }

  removeSection () {

  }

  updateSection () {

  }

  getActiveSection () {
    return this.activeSection
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
}
