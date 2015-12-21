const Paragraph = require('./Paragraph')

module.exports = class Section {
  constructor (text) {
    this.el = document.createElement('div')
    this.el.contentEditable = false

    this.paragraphs = []
  }

  render () {
    this.p.innerHTML = this.text
  }

  insertParagraph () {
    let paragraph = new Paragraph

    paragraph.el.addEventListener('focus', evt => {
      console.log('triggering focus')
      let event = new CustomEvent('select', {
        bubbles: true,
        cancelable: true,
      })
      this.el.dispatchEvent(event)
    })

    this.paragraphs.push(paragraph)
    this.el.appendChild(paragraph.el)
    return paragraph
  }

  updateParagraph () {

  }

  deleteParagraph () {

  }
}
