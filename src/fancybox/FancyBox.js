const util = require('../util')
const MenuBar = require('./MenuBar')
const Editor = require('./Editor')
const TextSection = require('./TextSection')
const defaultCommands = require('./default-commands')
const defaultButtons = require('./default-buttons')
const template = require('./template')

module.exports = class FancyBox {
  constructor () {
    this.el = document.createElement('div')
    this.el.className = 'fancybox'
    this.el.innerHTML = template

    this.editor = new Editor(this)
    this.menu = new MenuBar(this)

    this.commands = {}

    defaultCommands.forEach(command => this.registerCommand.apply(this, command))

    util.replaceElement(this.el.querySelector('.menu'), this.menu.el)
    util.replaceElement(this.el.querySelector('.editor'), this.editor.el)

    this.menu.registerButton(TextSection.createButton())
  }

  init () {
  }

  registerCommand () {

  }

  getMenu () {
    return this.menu
  }

  getActiveEditor () {
    return this.editor
  }
}
