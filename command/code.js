const childProcess = require('child_process')
const chalk = require('../utils/chalk')
const { projects } = require(__dirname + '/../../.go.project.config.js')
const VsCode = require('../utils/vscode.js')

class Code {
  constructor (option) {
    if (!projects || !projects.length) {
      console.log(chalk.bgRed.white('>>> 未添加项目,请先添加项目,运行: goo add'))
    } else {
      if (typeof option === 'string') {
        let identify = option
        VsCode.checkCode(identify)
      } else {
        const codePromptProcess = childProcess.fork(__dirname + '/../src/code-prompt.js')
        codePromptProcess.on('message', (message) => {
          let { identify} = message
          // 打开vscode
          VsCode.checkCode(identify)
        })
      }

    }
  }
}

module.exports = Code
