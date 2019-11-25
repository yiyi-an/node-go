const chalk = require('chalk')
const _chalk = chalk

const color = {
  orange: [235, 138, 71],
  blue: [64, 158, 255],
  green: [103, 194, 58],
  danger: [240, 128, 128],
  yellow: [255, 255, 0],
  purple: [139, 0, 139],
  cyan: [0, 255, 255]

}

Object.keys(color).forEach((name) => {
  _chalk[name] = chalk.rgb(...color[name])
})
_chalk.list = (ind, val) => {
  const cArr = Object.keys(color)
  return _chalk[cArr[ind]](val)
}

module.exports = _chalk
