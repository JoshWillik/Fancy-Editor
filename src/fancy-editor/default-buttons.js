let makeH1Button = {
  text: 'H1',
  action: editor => editor.runCommand('transform-tag', ['h1'])
}

let makePButton = {
  text: 'P',
  action: editor => editor.runCommand('transform-tag', ['p'])
}

module.exports = [
  makeH1Button,
  makePButton
]
