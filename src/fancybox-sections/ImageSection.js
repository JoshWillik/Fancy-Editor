const Button = require('../fancybox/Button')
const Section = require('../fancybox/Section')

class ImageSection extends Section {
  constructor (href) {
    super()
    this.el.classList.add('image-section')

    this.img = document.createElement('img')
    this.img.src = href || 'https://placehold.it/360x60'
    this.el.appendChild(this.img)
  }

  toHTML () {
    let el = document.createElement('div')
    el.classList.add('section', 'image-section')
    el.innerHTML = this.el.innerHTML
    return el.outerHTML
  }

  toJSON () {
    return {
      type: 'image',
      content: this.img.src
    }
  }
}
ImageSection.type = 'image'

ImageSection.Button = class ImageSectionButton extends Button {
  constructor (editor) {
    super(editor)
    this.title('Image Section')
    this.draggable(true)
  }

  attachDragEvents () {
    this.el.addEventListener('dragstart', function (evt) {
      evt.dataTransfer.setData("text/html", 'Testing');
    })
  }

  onClick () {
    this.editor.addSection(new ImageSection)
  }
}
ImageSection.Button.type = ImageSection.type

module.exports = ImageSection
