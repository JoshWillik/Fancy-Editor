let transformTag = [
  'transform-tag',
  function (tag) {
    this.getActiveEditor().getActiveElement().setTag(tag)
  }
]

module.exports = [
  transformTag
]
