const childProcess = require('child_process')
const chalk = require('../utils/chalk')
const { projects, path } = require(__dirname + '/../../.go.project.config.js')

class Run {
  constructor (option) {
    if (!projects || !projects.length) {
      console.log(chalk.bgRed.white('>>> 未添加项目,请先添加项目,运行: goo add'))
    } else {
      const runPromptProcess = childProcess.fork(__dirname + '/../src/run-prompt.js')
      runPromptProcess.on('message', (message) => {
        const { identify, isDouble} = message

        // 打开vscode
        childProcess.execFileSync('goo', ['code', identify], {stdio: 'inherit'})

        // 启动项目
        if (isDouble) {childProcess.fork(__dirname + '/../src/run-dev.js', [path[`${identify}Api`], 'Api'])}
        childProcess.fork(__dirname + '/../src/run-dev.js', [path[`${identify}Desktop`], '桌面端'])
      })
    }
  }
}

module.exports = Run
