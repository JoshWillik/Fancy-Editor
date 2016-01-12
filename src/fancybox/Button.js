module.exports = class Button {
  constructor (editor) {
    this.editor = editor
    this.el = document.createElement('div')
    this.el.classList.add('button')
    this.addEventListeners()
  }

  addEventListeners () {
    this.el.addEventListener('click', evt => {
      evt.preventDefault()
      this.onClick()
    })
  }

  title (text) {
    this.el.innerHTML = text
  }

  draggable (status) {
    this.el.draggable = status
    if (status) {
      this.attachDragEvents()
    }
  }

  onClick () {
    throw new Error('This method should be overriden by a subclass')
  }
}
