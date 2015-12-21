const util = require('../util')
const MenuBar = require('./MenuBar')
const Editor = require('./Editor')
const defaultCommands = require('./default-commands')
const defaultButtons = require('./default-buttons')
const template = require('./template')

module.exports = class FancyEditor {
  constructor () {
    this.el = document.createElement('div')
    this.el.className = 'fancy-editor'
    this.el.innerHTML = template

    this.editor = new Editor(this)
    this.menu = new MenuBar(this)

    this.commands = {}

    defaultCommands.forEach(command => this.registerCommand.apply(this, command))
    defaultButtons.forEach(button => this.menu.registerButton(button))

    util.replaceElement(this.el.querySelector('.menu'), this.menu.el)
    util.replaceElement(this.el.querySelector('.editor'), this.editor.el)
  }

  init () {
    this.getActiveEditor().bootstrap()
  }

  registerCommand (name, action) {
    this.commands[name] = action
  }

  runCommand (name, args) {
    if (!this.commands[name]) {
      return false
    }

    return this.commands[name].apply(this, args)
  }

  getMenu () {
    return this.menu
  }

  getActiveEditor () {
    return this.editor
  }
}
