module.exports = class MenuBar {
  constructor (fancy) {
    this.fancy = fancy
    this.el = document.createElement('div')
    this.el.className = 'menu-bar'

    this.buttons = []
    this.registeredButtons = {}

    this.render()
  }

  registerButton (ButtonClass) {
    let button = new ButtonClass(this.fancy.getEditor())
    if (ButtonClass.type) {
      this.registeredButtons[ButtonClass.type] = button
    }
    this.buttons.push(button)
    this.render()
    return this
  }

  getButton (type) {
    return this.registeredButtons[type] || null
  }

  render () {
    let fragment = document.createDocumentFragment()
    this.buttons.forEach(button => {
      fragment.appendChild(button.el)
    })
    this.el.innerHTML = ''
    this.el.appendChild(fragment)
  }
}
