module.exports = class MenuBar {
  constructor (editor) {
    this.editor = editor
    this.el = document.createElement('div')
    this.el.className = 'menu-bar'

    this.buttons = []
  }

  registerButton (button) {
    this.buttons.push(button)
    return this
  }

  init () {
    this.render()
  }

  render () {
    let fragment = document.createDocumentFragment()
    this.buttons.forEach(button => {
      let el = document.createElement('button')
      el.className = 'menu-button'
      el.innerHTML = button.title

      if (button.onClick) {
        el.addEventListener('click', event => {
          event.preventDefault()
          button.onClick(this.editor.getActiveElement())
        })
      }

      fragment.appendChild(el)
    })
    this.el.innerHTML = ''
    this.el.appendChild(fragment)
  }
}
