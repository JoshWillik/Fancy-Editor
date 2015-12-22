function addNodeLengths (previous, node) {
  if (node.nodeType === Node.TEXT_NODE) {
    previous += node.length
  } else {
    previous += 1
  }
  return previous
}

function nodeStartOffset (node) {
  let parent = node.parentNode
  let children = Array.from(parent.childNodes)
  let index = children.indexOf(node)
  return children.slice(0, index).reduce(addNodeLengths, 0)
}

function selectionIndices (selection) {
  let anchor = selection.anchorNode
  let focus = selection.focusNode

  let anchorOffset
  if (anchor.nodeType === Node.TEXT_NODE) {
    anchorOffset = selection.anchorOffset + nodeStartOffset(anchor)
  } else {
    if (anchorOffset === anchor.childNodes.length) {
      anchorOffset = Array.from(anchor.childNodes).reduce(addNodeLengths, 0)
    } else {
      anchorOffset = nodeStartOffset(anchor.childNodes[selection.anchorOffset])
    }
  }

  let focusOffset
  if (focus.nodeType === Node.TEXT_NODE) {
    focusOffset = selection.focusOffset + nodeStartOffset(focus)
  } else {
    if (focusOffset === focus.childNodes.length) {
      focusOffset = Array.from(focus.childNodes).reduce(addNodeLengths, 0)
    } else {
      focusOffset = nodeStartOffset(focus.childNodes[selection.focusOffset])
    }
  }

  return [anchorOffset, focusOffset].sort((a, b) => a - b)
}

window.selectionIndices = selectionIndices
module.exports = selectionIndices
