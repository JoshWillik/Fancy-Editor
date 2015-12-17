const activeElement = require('./active-element')
const replaceElement = require('./replace-element')

module.exports = function convertElement (element, tagName) {
  let selectionIndex = null
  let selection = document.getSelection()
  if (element === activeElement()) {
    selectionIndex = selection.anchorOffset
  }

  let newElement = document.createElement(tagName)
  newElement.innerHTML = element.innerHTML
  replaceElement(element, newElement)

  if (selectionIndex !== null) {
    let range = document.createRange()
    range.setStart(newElement.childNodes.item(0), selectionIndex)
    range.collapse(true)
    selection.removeAllRanges()
    selection.addRange(range)
  }

  newElement.closest('[contenteditable="true"]').focus()
}
