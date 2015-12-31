module.exports = class Editor {
  constructor () {
    this.el = document.createElement('div')
    this.el.className = 'editor'
    this.el.contentEditable = true

    this.sections = []
    this.activeSection = null

    this.addEventListeners()
  }

  addEventListeners () {
    this.el.addEventListener('dragover', evt => {
      console.log(evt)
    })
    this.el.addEventListener('drop', evt => {
      console.log('dropped', evt)
    })
  }

  insertSection () {
    let section = new TextSection
    this.sections.push(section)
    this.el.appendChild(section.el)
    return section
  }

  getActiveSection () {
    for (var i = 0; i < this.sections.length; i++) {
      if (this.sections[i].isActive()) {
        return this.sections[i]
      }
    }

    return null
  }

  convertElement (el, type) {
    if (el === this.el) {
      throw new Error('Tried to convert main element')
    }
    if (!el) {
      throw new Error('Tried to convert empty element')
    }

    let newEl = convert(el, type)
    this.replaceElement(el, newEl)
  }

  replaceElement (oldEl, newEl) {
    let parent = oldEl.parentElement
    parent.replaceChild(newEl, oldEl)

    if (oldEl === this.activeElement) {
      this.activeElement = newEl
    }
  }

  getActiveElement () {
    let section = this.getActiveSection()
    return section && section.getActiveElement()
  }
}
