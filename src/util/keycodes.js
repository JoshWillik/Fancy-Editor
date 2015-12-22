// Pulled from stackoverflow
// https://stackoverflow.com/a/12467610/1630446
function isNormalCharacter (code) {

  // Numbers
  if (code > 47 && code < 58) {
    return true
  }

  // Spacebar
  if (code == 32) {
    return true
  }

  // Letters
  if (code > 64 && code < 91) {
    return true
  }

  // Numpad
  if (code > 95 && code < 112) {
    return true
  }

  // Misc punctuation marks
  if ((code > 185 && code < 193) || (code > 218 && code < 223)) {
    return true
  }

  return false
}

function isArrowKey (code) {
  return code >= 37 && code <= 40
}

module.exports = {
  isNormalCharacter,
  isArrowKey,
  ENTER: 13,
}
