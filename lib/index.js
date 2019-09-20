#!/usr/bin/env node
const program = require('commander')
const fs = require('fs')
const childProcess = require('child_process')
const chalk = require('chalk')
const md5 = require('md5')
const commandExists = require('command-exists')
const u = require('../utils')
const { projects, path } = require('../project.config.js')

const packageData = JSON.parse(fs.readFileSync('./package.json', 'utf8'))
const { version } = packageData

program
  .version(version)
  .allowUnknownOption()

program
  .command('add')
  .description('新增项目')
  .action((option) => {
    // 交互
    const promptProcess = childProcess.fork('./src/add-prompt.js')
    promptProcess.on('message', (message) => {
      console.log(chalk.green('正在写入配置...'))

      let result = eval(fs.readFileSync('project.config.js', 'utf8'))
      const { projectName, path, dependency, apiPath} = message

      // 取值并更新config
      const pValue = u.randomValue(projectName, md5) || new Error('randomValue call Error!')
      result = u.appndToConfig({
        name: projectName,
        value: pValue,
        path,
        flag: 'Desktop'
      })
      if (dependency) {
        result = u.appndToConfig({
          name: projectName,
          value: pValue,
          path: apiPath,
          flag: 'Api'
        })
      }

      // 写入project.config.js
      var buffer = new Buffer(`module.exports = ${JSON.stringify(result, null, 2)}`)
      fs.writeFile(__dirname + '/../project.config.js', buffer, function (err) {
        if (err) {
          console.log(chalk.red('写入配置失败'))
          console.error(err)
          return
        }
        console.log(chalk.blue('配置更新完成!'))
        console.log(chalk.blue('运行: '), chalk.bgRed.white('go'), ' ', chalk.blue('启动项目吧!'))
      })
    })
  })

program
  .command('ls')
  .description('查看功能列表')
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
  .command('run')
  .description('运行项目')
  .action((option) => {
    if (!projects || !projects.length) {
      console.log(chalk.bgRed.white('>>> 未添加项目,请先添加项目,运行: go add'))
    } else {
      const runPromptProcess = childProcess.fork('./src/run-prompt.js')
      runPromptProcess.on('message', (message) => {
        const { identify, isDouble} = message

        // 打开vscode
        commandExists('code', (err, commandRes) => {
          if (err) {return console.log(err.message)}
          if (commandRes) {
            childProcess.execFileSync('code', [path[`${identify}Desktop`]])
            if (isDouble) {childProcess.execFileSync('code', [path[`${identify}Api`]])}
          } else {
            console.log(chalk.red('未找到') + ' ' + chalk.bgRed.white(' code ') + ' ' + chalk.red('指令!'))
          }
        })

        // 启动项目
        if (isDouble) {childProcess.fork('./src/run-dev.js', [path[`${identify}Api`], 'Api'])}
        childProcess.fork('./src/run-dev.js', [path[`${identify}Desktop`], '桌面端'])
      })
    }

  })


if (process.argv.length === 2) {
  childProcess.execFileSync('go', ['run'], {stdio: 'inherit'})
}


program.parse(process.argv)
