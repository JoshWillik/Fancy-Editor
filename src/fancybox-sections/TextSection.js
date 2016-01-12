const Button = require('../fancybox/Button')
const Section = require('../fancybox/Section')
const keycodes = require('../util/keycodes')
const cursorLocation = require('../util/cursor-location')
const convert = require('../util/convert-element')

let numberSort = (a,b) => a - b

class Paragraph {
  constructor (text) {
    this.el = document.createElement('p')

    this.text = null
    this.setText(text)
    this.render()
  }

  render () {
    this.el.innerHTML = this.text.replace(/\n/g, '<br>')
  }

  setText (text) {
    this.text = text || ''
    this.render()
    return this
  }

  getText (start, end) {
    start = start || 0
    end = end || this.text.length
    return this.text.slice(start, end)
  }

  getLength () {
    return this.getText().length
  }

  setTag (type) {
    let newElement = convert(this.el, type)
    this.el.parentNode.replaceChild(newElement, this.el)
    this.el = newElement
    this.focus()
  }

  update (payload) {
    let newFocus = 0

    if (payload.action === 'delete') {
      let start = payload.start
      let end = payload.end
      if (start > 0 && start === end) {
        start -= 1
      }
      this.delete(start, end)
      newFocus = start
    }

    this.render()
    this.focus(newFocus)
  }

  insert (text, index) {
    this.replaceRange(index, index, text)
    this.focus(index + text.length)
  }

  delete (start, end) {
    this.replaceRange(start, end, '')
  }

  replaceRange (start, end, text) {
    text = text || ''
    this.text = this.text.slice(0, start) + text + this.text.slice(end)
    this.render()
    this.focus(start + text.length)
  }

  focus (index) {
    index = index || 0

    if (index === 'end') {
      index = this.getLength()
    }

    let range = document.createRange()
    let children = Array.from(this.el.childNodes)
    let candidates = children.slice()
    let child

    if (!candidates.length) {
      range.setStart(this.el, 0)
    }

    while (child = candidates.shift()) {
      if (child.nodeType === Node.TEXT_NODE) {
        if (index > child.length) {
          index -= child.length
          continue
        } else {
          range.setStart(child, index)
          break
        }
      } else {
        if (index === 0) {
          range.setStart(this.el, children.indexOf(child))
          break
        } else {
          index -= 1
          continue
        }
      }
    }

    range.collapse(true)
    let selection = document.getSelection()
    selection.removeAllRanges()
    selection.addRange(range)

    let focusable = this.el.closest('[contentEditable="true"]')
    if (focusable) {
      focusable.focus()
    }
  }
}

class TextSection extends Section {
  constructor (text) {
    super()
    this.el.contentEditable = true

    this.paragraphs = []

    this.attachListeners()
    if (text) {
      this.load(text)
    } else {
      this.insertParagraph()
    }
  }

  load (text) {
    text.split('\n\n').forEach(paragraph => {
      this.insertParagraph().setText(paragraph)
    })
  }

  focus () {
    if (this.paragraphs.length) {
      this.paragraphs[0].focus()
    }
  }

  attachListeners () {
    this.el.addEventListener('keydown', evt => {
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

        let selection = document.getSelection()
        let active = this.getSelectedParagraph()
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

    this.el.addEventListener('keypress', evt => {
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

  getSelectedParagraph () {
    let selection = document.getSelection()
    let selectedEl = selection.anchorNode
    if (selectedEl.nodeType === Node.TEXT_NODE) {
      selectedEl = selectedEl.parentNode
    }
    for (var i = 0; i < this.paragraphs.length; i++) {
      if (this.paragraphs[i].el === selectedEl) {
        return this.getParagraph(i)
      }
    }

    return null
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
    this.el.removeChild(p.el)
  }

  getParagraph (index) {
    if (this.paragraphs.length > index) {
      return this.paragraphs[index]
    } else {
      return null
    }
  }

  getSelectedRange () {
    return cursorLocation(document.getSelection(), this.el)
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

    let paragraph = new Paragraph
    if (insertIndex === this.paragraphs.length) {
      this.el.appendChild(paragraph.el)
      this.paragraphs.push(paragraph)
    } else {
      this.el.insertBefore(paragraph.el, this.paragraphs[insertIndex].el)
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

  toHTML () {
    let el = document.createElement('div')
    el.classList.add('section', 'text-section')
    el.innerHTML = this.el.innerHTML
    return el.outerHTML
  }

  toJSON () {
    return {
      type: 'text',
      content: this.paragraphs.map(p => p.getText()).join('\n\n')
    }
  }
}


TextSection.Button = class TextSectionButton extends Button {
  constructor (editor) {
    super(editor)
    this.title('Text Section')
    this.draggable(true)
  }

  attachDragEvents () {
    this.el.addEventListener('dragstart', function (evt) {
      evt.dataTransfer.setData("text/html", 'Testing');
    })
  }

  onClick () {
    this.editor
      .addSection(new TextSection)
      .getParagraph(0)
        .focus()
  }
}
TextSection.type = 'text'
TextSectionButton.type = TextSection.type

module.exports = TextSection
