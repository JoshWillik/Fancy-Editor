const TextElement = require('./TextElement')

module.exports = class Section {
  constructor (text) {
    this.el = document.createElement('div')
    this.el.className = 'section'

    this.content = document.createElement('div')
    this.content.contentEditable = true
    this.el.appendChild(this.content)

    this.paragraphs = []
    this.id = Math.round(Math.random() * 0xffff)
    this.el.dataset.id = this.id
  }

  getActiveElement () {
    if (!this.el.contains(document.getSelection().anchorNode)) {
      return null
    }

    for (var i = 0; i < this.paragraphs.length; i++) {
      if (this.paragraphs[i].isActive()) {
        return this.paragraphs[i]
      }
    }
    return null
  }

  isActive () {
    return !!this.getActiveElement()
  }

  insertParagraph () {
    let paragraph = new TextElement

    paragraph.el.addEventListener('selectionchange', evt => {
      let event = new CustomEvent('select', {
        bubbles: true,
        cancelable: true,
      })
      this.el.dispatchEvent(event)
    })

    this.paragraphs.push(paragraph)
    this.content.appendChild(paragraph.el)
    return paragraph
  }
}
