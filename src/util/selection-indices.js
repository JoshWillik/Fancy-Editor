function addNodeLengths (previous, node) {
  if (node.nodeType === Node.TEXT_NODE) {
    previous += node.length
  } else {
    previous += 1
  }
  return previous
}

function characterIndex (selection) {
  let anchor = selection.anchorNode
  let focus = selection.focusNode

  if (anchor === focus && focus.nodeType !== Node.TEXT_NODE) {
    let children = Array.from(anchor.childNodes)
    let start = Math.min(selection.anchorOffset, selection.focusOffset)
    let end = Math.max(selection.anchorOffset, selection.focusOffset)
    let startIndex = children.slice(0, start).reduce(addNodeLengths, 0)
    let endIndex = children.slice(start, end).reduce(addNodeLengths, 0)
    return [startIndex, endIndex]
  }

  let parent
  if (focus.nodeType === Node.TEXT_NODE) {
    parent = focus.parentNode
  }
  if (anchor.nodeType === Node.TEXT_NODE) {
    parent = anchor.parentNode
  }

  let children = Array.from(parent.childNodes)
  let anchorIndex = children.indexOf(anchor)
  let focusIndex = children.indexOf(focus)
  let startIndex, endIndex
  let startNode, endNode
  let startOffset, endOffset
  if (anchorIndex > focusIndex) {
    startOffset = selection.focusOffset
    endOffset = selection.anchorOffset
    startIndex = focusIndex
    endIndex = anchorIndex
    startNode = focus
    endNode = anchor
    } else {
    startOffset = selection.anchorOffset
    endOffset = selection.focusOffset
    startIndex = anchorIndex
    endIndex = focusIndex
    startNode =  anchor
    endNode = focus
  }

  let startValueShift = 0
  let endValueShift = 0
  if (startNode.nodeType === Node.TEXT_NODE) {
    startOffset = startValueShift
    startIndex += 1
    startNode = startNode.parentNode
  }
  if (endNode.nodeType === Node.TEXT_NODE) {
    endOffset = endNode.length - endValueShift
    // endIndex -= 1
    endNode = endNode.parentNode
  }
  let indices = characterIndex({
    anchorNode: startNode,
    focusNode: endNode,
    anchorOffset: startIndex,
    focusOffset: focusIndex
  })
  indices[0] += startOffset
  indices[1] -= endOffset
  return indices
}

module.exports = characterIndex
