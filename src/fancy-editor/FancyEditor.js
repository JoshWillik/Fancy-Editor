const util = require('../util')
const MenuBar = require('./MenuBar')
const defaultButtons = require('./default-buttons')
const template = require('./template')

module.exports = class FancyEditor {
  constructor () {
    this.el = document.createElement('div')
    this.el.className = 'fancy-editor'
    this.el.innerHTML = template

    this.menu = new MenuBar(this)
    defaultButtons.forEach(button => this.menu.registerButton(button))
    util.replaceElement(this.el.querySelector('.menu'), this.menu.el)
  }

  init () {
    this.menu.init()
  }

  getMenu () {
    return this.menu
  }

  getActiveElement () {
    var el = util.activeElement()
    if (!util.isDecendant(this.el, el)) {
      return null
    }
    return el
  }
}
