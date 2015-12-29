module.exports = function nodeOffset (node, parent) {
  let found = false
  function addNodeLengths (previous, currentNode) {
    if (found) {
      return previous
    }
    if (currentNode === node) {
      found = true
      return previous
    }
    if (currentNode.tagName === 'BR') {
      return previous + 1
    }
    if (currentNode.nodeType === Node.TEXT_NODE) {
      return previous + currentNode.length
    }

    return Array.from(currentNode.childNodes).reduce(addNodeLengths, previous)
  }

  return addNodeLengths(0, parent)
}
