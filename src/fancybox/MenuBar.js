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
    this.fancy.registerCommand(button.name, button.action)
    this.render()
    return this
  }

  render () {
    let fragment = document.createDocumentFragment()
    this.buttons.forEach(button => {
      let el = document.createElement('button')
      el.className = 'menu-item'
      el.innerHTML = button.text

      if (button.action) {
        el.addEventListener('click', event => {
          event.preventDefault()
          button.action(this.fancy)
        })
      }

      fragment.appendChild(el)
    })
    this.el.innerHTML = ''
    this.el.appendChild(fragment)
  }
}
