const childProcess = require('child_process')
const chalk = require('../utils/chalk')

const { projects, path } = require(__dirname + '/../../.go.project.config.js')
const commandExists = require('command-exists')

class VsCode {
  static checkCode (identify) {
    return new Promise((resolve, rejact) => {
      this.identify = identify
      commandExists('code', (err, commandRes) => {
        if (err) {return rejact(err)}
        if (commandRes) {
          this.start()
        } else {
          console.log(chalk.red('未能启动vsCode ') + chalk.bgRed.white(' code ') + chalk.red(' 指令不存在! 请手动从vsCode安装'))
        }
      })
    })

  }
  static start () {
    childProcess.execFileSync('code', [path[`${this.identify}Desktop`]])
    if (path[`${this.identify}Api`]) {childProcess.execFileSync('code', [path[`${this.identify}Api`]])}
  }
}
module.exports = VsCode
