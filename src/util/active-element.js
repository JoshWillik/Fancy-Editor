const TEXT_NODE = 3

module.exports = function getActiveElement () {
  let selection = document.getSelection()
  let el = selection.anchorNode
  if (!el) {
    return el
  }

  if (el.nodeType === TEXT_NODE) {
    el = el.parentNode
  }

  return el
}
