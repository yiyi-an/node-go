const chalk = require('chalk')
const _chalk = chalk

const color = {
  orange: [235, 138, 71],
  blue: [64, 158, 255],
  green: [103, 194, 58]
}

Object.keys(color).forEach((name) => {
  _chalk[name] = chalk.rgb(...color[name])
})

module.exports = _chalk
