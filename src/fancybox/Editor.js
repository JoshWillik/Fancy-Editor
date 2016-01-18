const EventEmitter = require('event-emitter')

class Editor {
  constructor (fancybox) {
    this.fancybox = fancybox
    this.el = document.createElement('div')
    this.el.className = 'editor'
    this.sections = []
    this.activeSection = null

    this.addEventListeners()
    EventEmitter(this)
  }

  addEventListeners () {
  }

  addSection (section, args=[]) {
    if (typeof section === 'string') {
      let Class = this.fancybox.getSection(section)
      section = new Class(...args)
    }
    this.sections.push(section)
    this.el.appendChild(section.el)

    this.emit('sectionadd', section)
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
    return (this.getActiveSection() || this.sections[0]).focus()
  }

  getJSON () {
    return {
      sections: this.sections.map(section => section.toJSON())
    }
  }

  getHTML () {
    return this.sections.map(section => section.toHTML()).join('')
  }

  load (data) {
    this.el.innerHTML = ''
    this.sections = []
    ;(data.sections || []).forEach(sectionData => {
      let Section = this.fancybox.getSection(sectionData.type)
      this.addSection(new Section(sectionData.content))
    })
  }
}

module.exports = Editor
