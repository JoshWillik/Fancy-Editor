const util = require('../util')
const MenuBar = require('./MenuBar')
const Editor = require('./Editor')
const defaultSections = require('../fancybox-sections')

const template =
  `
  <div class="menu"></div>
  <div class="editor">
    <p>Hello</p>
  </div>
  `

module.exports = class FancyBox {
  constructor (options) {
    options = options || {}

    this.el = document.createElement('div')
    this.el.classList.add('fancybox')
    if (options.theme) {
      this.el.classList.add(`fancybox-${options.theme}`)
    }
    this.el.innerHTML = template

    this.sections = {}
    this.editor = new Editor(this)
    this.menu = new MenuBar(this)

    util.replaceElement(this.el.querySelector('.menu'), this.menu.el)
    util.replaceElement(this.el.querySelector('.editor'), this.editor.el)

    defaultSections.forEach(Section => this.registerSection(Section))
  }

  registerSection (Section) {
    this.sections[Section.type] = Section
    if (Section.Button) {
      this.menu.registerButton(Section.Button)
    }
  }

  getSection (key) {
    return this.sections[key]
  }

  getMenu () {
    return this.menu
  }

  getEditor () {
    return this.editor
  }
  getJSON () {
    return this.editor.getJSON()
  }
  getHTML () {
    return this.editor.getHTML()
  }
}
