#!/usr/bin/env node
const program = require('commander')
const fs = require('fs')
const childProcess = require('child_process')
const chalk = require('../utils/chalk')
const md5 = require('md5')

const u = require('../utils')
const VsCode = require('../utils/vscode.js')
const { projects, path } = require(__dirname + '/../../.go.project.config.js')

const { version }  = JSON.parse(fs.readFileSync(__dirname + '/../package.json', 'utf8'))

const Tag = require('../command/tag')
const Tree = require('../command/tree')


program
  .version(version)
  .allowUnknownOption()

program
  .command('add')
  .description('新增项目')
  .action((option) => {
    // 交互
    const promptProcess = childProcess.fork(__dirname + '/../src/add-prompt.js')
    promptProcess.on('message', (message) => {
      console.log(chalk.green('正在写入配置...'))

      let result = eval(fs.readFileSync(__dirname + '/../../.go.project.config.js', 'utf8'))
      const { projectName, path, dependency, apiPath} = message

      // 取值并更新config
      const pValue = u.randomValue(projectName, md5) || new Error('randomValue call Error!')
      result = u.appndToConfig({
        config: result,
        name: projectName,
        value: pValue,
        path,
        flag: 'Desktop'
      })
      if (dependency) {
        result = u.appndToConfig({
          config: result,
          name: projectName,
          value: pValue,
          path: apiPath,
          flag: 'Api'
        })
      }

      // 写入project.config.js
      var buffer = new Buffer(`module.exports = ${JSON.stringify(result, null, 2)}`)
      fs.writeFile(__dirname + '/../../.go.project.config.js', buffer, function (err) {
        if (err) {
          console.log(chalk.red('写入配置失败'))
          console.error(err)
          return
        }
        console.log(chalk.blue('配置更新完成!'))
        console.log(chalk.blue('运行: '), chalk.bgRed.white('goo'), ' ', chalk.blue('启动项目吧!'))
      })
    })
  })

program
  .command('ls')
  .description('查看项目/自定commond列表')
  .action((option) => {
    if (projects instanceof Array && projects.length) {
      let str = '-------------------------------\n已有项目:\n\n'
      projects.forEach((item) => {
        str += chalk.green(`  ${item.name}`) + '\n'
      })
      console.log(`${str}\n-------------------------------`)
    } else {
      console.log('已已有项目:\n空的!\n')
    }
  })

program
  .command('tt')
  .description('测试用')
  .action((option) => {
    console.log(123)
  })

program
  .command('tag')
  .description('为项目git添加tag')
  .action(async (option) => {
       new Tag(option)
  })

  program
  .command('tree')
  .description('生成目录tree')
  .action(async (option) => {
       new Tree(option)
  })
  
program
  .command('code')
  .description('将项目添加到vsCode')
  .action((option) => {
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
  })

program
  .command('run')
  .description('运行项目')
  .action((option) => {
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

  })


if (process.argv.length === 2) {
  childProcess.execFileSync('goo', ['run'], {stdio: 'inherit'}, (err, stdout, stdio) => {
    if (err) {
      return console.log(err)
    }
  })
}


program.parse(process.argv)
