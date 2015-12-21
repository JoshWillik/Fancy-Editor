const activeElement = require('./active-element')
const replaceElement = require('./replace-element')

module.exports = function convertElement (element, tagName) {
  let selectionIndex = null

  let newElement = document.createElement(tagName)
  newElement.innerHTML = element.innerHTML
  return newElement
}
