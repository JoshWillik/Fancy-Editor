const Button = require('./Button')
const TextElement = require('./TextElement')
const keycodes = require('../util/keycodes')
const cursorLocation = require('../util/cursor-location')

let numberSort = (a,b) => a - b

module.exports = class Section {
  constructor (text) {
    this.el = document.createElement('div')
    this.el.contentEditable = false

    this.content = document.createElement('div')
    this.content.className = 'section'
    this.content.contentEditable = true
    this.el.appendChild(this.content)

    this.paragraphs = []
    this.id = Math.round(Math.random() * 0xffff)
    this.el.dataset.id = this.id

    this.attachListeners()
    this.insertParagraph()
  }

  attachListeners () {
    this.content.addEventListener('keydown', evt => {
      if (evt.keyCode === keycodes.ESCAPE) {
        return
      }

      if (evt.keyCode === keycodes.ENTER) {
        if (evt.shiftKey) {
          return
        }

        evt.preventDefault()
        let range = this.getSelectedRange()
        if (range[0] !== range[1]) {
          this.deleteRange.apply(this, range)
        }
        this.splitParagraph(range[0])
        return
      }

      if (evt.keyCode === keycodes.DELETE) {
        evt.preventDefault()

        let active = this.getActiveElement()
        let index = this.paragraphs.indexOf(active)
        if (active && active.getLength() === 0 && index !== 0) {
          this.removeParagraph(active)
          this.getParagraph(index - 1).focus('end')
          return
        }

        let range = this.getSelectedRange()
        if (range[0] === range[1] && this.cursorOnParagraphBeginning() && index !== 0) {
          let previousLength = this.getParagraph(index - 1).getLength()
          this.joinParagraphs(index - 1)
          this.getParagraph(index - 1).focus(previousLengths)
          return
        }
        if (range[0] === range[1] && range[0] > 0) {
          range[0] -= 1
        }
        this.deleteRange.apply(this, range)
        return
      }
    })

    this.content.addEventListener('keypress', evt => {
      if (evt.ctrlKey || keycodes.isArrowKey(evt.keyCode)) {
        return
      }

      if (!evt.charCode && evt.keyCode !== keycodes.ENTER) {
        return
      }

      evt.preventDefault()

      let range = this.getSelectedRange()
      if (range[0] !== range[1]) {
        this.deleteRange.apply(this, range)
        range = this.getSelectedRange()
      }

      let character = evt.keyCode ? '\n' : String.fromCodePoint(evt.charCode)
      this.insertText(range[0], character)
    })
  }

  deleteRange (start, end) {
    let paragraphs = this.paragraphs.slice()
    let shouldJoin = false
    let counter = 0
    let p

    while (p = paragraphs.shift()) {
      let length = p.getLength()

      if (counter + length <= start) {
        counter += length
        continue
      }

      if (counter >= end) {
        break
      }

      if (start <= counter && counter + length < end) {
        this.removeParagraph(p)
        counter += length
        continue
      }

      let localStart = 0
      let localEnd = length
      if (counter + length > start && counter < start) {
        localStart = start - counter
      }

      if (counter < end && counter + length > end) {
        localEnd = end - counter
      }
      p.delete(localStart, localEnd)

      counter += length
      if (localStart > 0 && counter < end) {
        shouldJoin = true
      }
    }

    if (shouldJoin) {
      this.joinParagraphs(start)
    }
  }

  cursorOnParagraphBeginning (index) {
    let s = document.getSelection()

    let paragraphEls = this.paragraphs.map(p => p.el)
    return s.anchorOffset === 0 && paragraphEls.indexOf(s.anchorNode.parentNode) !== -1
  }

  joinParagraphs (start) {
    let counter = 0
    for (var i = 0; i < this.paragraphs.length; i++) {
      let length = this.paragraphs[i].getLength()
      counter += length
      if (counter >= start) {
        let next = this.paragraphs[i + 1]
        this.paragraphs[i].insert(next.getText(), length)
        this.removeParagraph(next)
        break
      }
    }
  }

  splitParagraph (index) {
    let counter = 0
    for (var i = 0; i < this.paragraphs.length; i++) {
      let p = this.paragraphs[i]
      let length = p.getLength()
      counter += length
      if (counter >= index) {
        let localStart = counter - (counter - index)
        let clipped = p.getText(localStart, length)
        p.delete(localStart, length)
        this.insertParagraph(i + 1)
          .setText(clipped)
          .focus(0)
        break
      }
    }
  }

  removeParagraph (p) {
    let index = this.paragraphs.indexOf(p)
    this.paragraphs.splice(index, 1)
    this.content.removeChild(p.el)
  }

  getParagraph (index) {
    if (this.paragraphs.length > index) {
      return this.paragraphs[index]
    } else {
      return null
    }
  }

  getSelectedRange () {
    return cursorLocation(document.getSelection(), this.content)
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

  insertParagraph (insertIndex) {
    if (insertIndex === undefined) {
      insertIndex = this.paragraphs.length ? this.paragraphs.length - 1 : 0
    }

    let paragraph = new TextElement
    if (insertIndex === this.paragraphs.length) {
      this.content.appendChild(paragraph.el)
      this.paragraphs.push(paragraph)
    } else {
      this.content.insertBefore(paragraph.el, this.paragraphs[insertIndex].el)
      this.paragraphs.splice(insertIndex, 0, paragraph)
    }
    return paragraph
  }

  insertText (offset, text) {
    for (var i = 0; i < this.paragraphs.length; i++) {
      let p = this.paragraphs[i]
      let length = p.getLength()

      if (offset === 1 && length === 0) {
        p.insert(text, 0)
        break
      } else if (offset > length) {
        offset -= length
        continue
      } else {
        p.insert(text, offset)
        break
      }
    }
  }

  static createButton () {
    return new TextSectionButton
  }
}

class TextSectionButton extends Button {
  constructor () {
    super()
    this.setText('Text Section')
    this.draggable(true)
  }

  attachDragEvents () {
    this.el.addEventListener('dragstart', function (evt) {
      evt.dataTransfer.setData("text/html", 'Testing');
    })
  }
}
