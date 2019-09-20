#!/usr/bin/env node
const program = require('commander')
const fs = require('fs')
const childProcess = require('child_process')
const chalk = require('chalk')
const md5 = require('md5')

const commandExists = require('command-exists')

const u = require('../utils')

const { projects, path } = require('../project.config.js')

const packageData = JSON.parse(fs.readFileSync(__dirname + '/../package.json', 'utf8'))
const { version } = packageData

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

      let result = eval(fs.readFileSync(__dirname + '/../project.config.js', 'utf8'))
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
  .command('tt')
  .description('测试用')
  .action((option) => {

  })
program
  .command('tag')
  .description('为项目git添加tag')
  .action((option) => {
    const tagPromptProcess = childProcess.fork(__dirname + '/../src/tag-prompt.js')
    tagPromptProcess.on('message', (message) => {
      const {branch, v} = message
      const timeStr = u.parseDateTime(new Date(), '{y}{m}{d}{h}{i}')
      let version = 'v' + v
      if (!v) {
        console.log(chalk.green('正在获取远程tag...,  filter by ' + branch))
        childProcess.execFileSync('git', ["fetch", "origin", "--prune"])
        const stdout = childProcess.execFileSync('git', ['tag', '-l', `${branch}*`])
        const tagList = stdout
          .toString()
          .trim()
          .split('\n')
        if (!tagList.length) {
          console.log(chalk.green('正在比对版本号...'))
          const prevTag = tagList.sort(u.versionSortRule).reverse()[0]
          console.log(chalk.blue('找到最新版本:\n '), chalk.blue.bold(prevTag))
          const [, prevVersion] = prevTag.split('-')
          version = u.upVersion(prevVersion)
        } else {
          console.log(chalk.red('未找到历史版本记录!'))
          version = 'v1.0.0'
        }
      }
      const currentTagArr = [
        branch,
        version,
        timeStr
      ]
      const currentTag = currentTagArr.join('-')
      console.log(chalk.blue('\nnew tag:\n '), chalk.blue.bold(currentTag), '\n')
      childProcess.execFileSync('git', ['tag', '-a', currentTag, '-m', '测试'])
      console.log(chalk.green('push the tag to origin...'))
      process.on('exit', () => {
        console.log(chalk.rgb(235, 138, 71)(
          `
┌-----------------------------------------┐
|  Tag已经创建好了,快去发布吧  ╮(￣▽￣)╭  |
└-----------------------------------------┘
`
        ))
      })
      childProcess.execFileSync('git', ['push', 'origin', `${currentTagArr.join('-')}`])

    })

  })

program
  .command('run')
  .description('运行项目')
  .action((option) => {
    if (!projects || !projects.length) {
      console.log(chalk.bgRed.white('>>> 未添加项目,请先添加项目,运行: go add'))
    } else {
      const runPromptProcess = childProcess.fork(__dirname + '/../src/run-prompt.js')
      runPromptProcess.on('message', (message) => {
        const { identify, isDouble} = message

        // 打开vscode
        commandExists('code', (err, commandRes) => {
          if (err) {return console.log(err.message)}
          if (commandRes) {
            childProcess.execFileSync('code', [path[`${identify}Desktop`]])
            if (isDouble) {childProcess.execFileSync('code', [path[`${identify}Api`]])}
          } else {
            console.log(chalk.red('未能启动vsCode ') + chalk.bgRed.white(' code ') + chalk.red(' 指令不存在! 请手动从vsCode安装'))
          }
        })

        // 启动项目
        if (isDouble) {childProcess.fork(__dirname + '/../src/run-dev.js', [path[`${identify}Api`], 'Api'])}
        childProcess.fork(__dirname + '/../src/run-dev.js', [path[`${identify}Desktop`], '桌面端'])
      })
    }

  })


if (process.argv.length === 2) {
  childProcess.execFileSync('go', ['run'], {stdio: 'inherit'})
}


program.parse(process.argv)
