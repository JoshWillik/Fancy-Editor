let nodeIndex = require('./node-index')

function nodeOffset (node, offset, parent) {
  if (node.nodeType === Node.TEXT_NODE) {
    return nodeIndex(node, parent) + offset
  }

  if (node.childNodes.length) {
    return nodeIndex(node.childNodes.item(offset), parent)
  } else {
    return 1 + nodeIndex(node, parent)
  }
}

module.exports = function cursorOffset(selection, parent) {
  let anchor = nodeOffset(selection.anchorNode, selection.anchorOffset, parent)
  let focus = nodeOffset(selection.focusNode, selection.focusOffset, parent)
  return [anchor, focus].sort((a, b) => a - b)
}
