class Section {
  constructor (text) {
    this.id = Math.round(Math.random() * 0xffff)

    this.el = document.createElement('div')
    this.el.classList.add('section')
    this.el.dataset.id = this.id
  }

  toHTML () {
    return this.el.outerHTML
  }

  toJSON () {
    throw new Error('Section.toJSON must be implemented in ' + this.constructor.name)
  }
}

module.exports = Section
