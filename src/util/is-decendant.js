module.exports = function isDescendant(parent, child) {
  if (!child) {
    return false
  }
  var node = child.parentNode
  while (node != null) {
    if (node == parent) {
      return true
    }
    node = node.parentNode
  }
  return false
}
