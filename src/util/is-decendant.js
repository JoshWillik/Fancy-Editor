module.exports = function isDescendant(parent, child) {
  if (!child || !parent) {
    return false
  }

  return child !== parent && parent.contains(child)
}
