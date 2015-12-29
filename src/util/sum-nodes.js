module.exports = function addNodeLengths (previous, node) {
  if (node.nodeType === Node.TEXT_NODE) {
    previous += node.length
  } else {
    previous += 1
  }
  return previous
}
