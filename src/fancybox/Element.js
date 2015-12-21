module.exports = class Element {
  constructor (el) {
    this.el = el
  }

  isActive () {
    return this.el.contains(document.getSelection().anchorNode)
  }
}
