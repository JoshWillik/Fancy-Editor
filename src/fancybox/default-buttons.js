let makeH1Button = {
  text: 'H1',
  action: editor => editor.runCommand('transform-tag', ['h1'])
}

let makePButton = {
  text: 'P',
  action: editor => editor.runCommand('transform-tag', ['p'])
}

let addSection = {
  text: '+',
  action: editor => editor.getActiveEditor().insertSection().insertParagraph().focus()
}

module.exports = [
  makeH1Button,
  makePButton,
  addSection,
]
