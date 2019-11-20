const fs = require('fs')
const chalk = require('../utils/chalk')
const exists = fs.existsSync(__dirname + '/../../.go.project.config.js')

if (!exists) {
  console.log(chalk.rgb(235, 138, 71)(
    `
    ┌-----------------------------------------┐
    |    欢迎使用 goo (￣▽￣)~* ,玩的开心!    |
    └-----------------------------------------┘
    `
  ))
  console.log(__dirname, __filename)
  // console.log('\n>>> 首次启动,已创建: project.config.js\n')
  fs.writeFileSync(__dirname + '/../../.go.project.config.js', "module.exports = {}")
}

