module.exports = class MenuBar {
  constructor (fancy) {
    this.fancy = fancy
    this.el = document.createElement('div')
    this.el.className = 'menu-bar'

    this.buttons = []

    this.render()
  }

  registerButton (button) {
    this.buttons.push(button)
    this.render()
    return this
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
