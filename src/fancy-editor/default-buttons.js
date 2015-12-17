const util = require('../util')

let makeH1Button = {
  title: 'H1',
  onClick: el => util.convertElement(el, 'h1')
}

let makePButton = {
  title: 'P',
  onClick: el => util.convertElement(el, 'p')
}

module.exports = [
  makeH1Button,
  makePButton
]
