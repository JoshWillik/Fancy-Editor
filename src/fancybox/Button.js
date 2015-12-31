module.exports = class Button {
  constructor () {
    this.el = document.createElement('div')
    this.el.className = 'button'
  }

  setText (text) {
    this.el.innerHTML = text
  }

  draggable (status) {
    this.el.draggable = status
    if (status) {
      this.attachDragEvents()
    }
  }
}
