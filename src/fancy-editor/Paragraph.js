module.exports = class Paragraph {
  constructor (text) {
    this.el = document.createElement('p')
    this.el.contentEditable = true

    this.text = null
    this.setText(text)
    this.render()
  }

  render () {
    this.el.innerHTML = this.text
  }

  setText (text) {
    this.text = text || ''
    this.render()
    return this
  }

  focus () {
    this.el.focus()
  }
}
