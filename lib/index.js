#!/usr/bin/env node
/* eslint-disable no-new */
const program = require('commander')
const fs = require('fs')
const childProcess = require('child_process')

const { version } = JSON.parse(fs.readFileSync(__dirname + '/../package.json', 'utf8'))

const Tag = require('../command/tag')
const Tree = require('../command/tree')
const Add = require('../command/add')
const Code = require('../command/code')
const Ls = require('../command/ls')
const Run = require('../command/run')

program
  .version(version)
  .allowUnknownOption()

program
  .command('add')
  .description('新增项目')
  .action((option) => {
    new Add(option)
  })

program
  .command('ls')
  .description('查看项目/自定commond列表')
  .action((option) => {
    new Ls(option)
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
  .action((option) => {
    new Tag(option)
  })

program
  .command('tree')
  .description('生成目录结构图')
  .action((option) => {
    new Tree(option)
  })

program
  .command('code')
  .description('用VsCode打开项目')
  .action((option) => {
    new Code(option)
  })

program
  .command('run')
  .description('运行项目')
  .action((option) => {
    new Run(option)
  })


if (process.argv.length === 2) {
  childProcess.execFileSync('goo', ['run'], {stdio: 'inherit'}, (err, stdout, stdio) => {
    if (err) {
      return console.log(err)
    }
  })
}


program.parse(process.argv)
