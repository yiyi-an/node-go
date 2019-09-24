#!/usr/bin/env node
const inquirer = require('inquirer')
const config = require('../project.config.js')

const promptList = [
  {
    type: 'list',
    message: '请选择要启动的项目:',
    name: 'identify',
    choices: config.projects
  },
  // {
  //   type: 'list',
  //   message: '启动VsCode?',
  //   name: 'startCode',
  //   choices: [
  //     {name: '是的', value: true},
  //     {name: '不', value: false}
  //   ]
  // },
  {
    when: (answers) => config.path[answers.identify + 'Api'],
    type: 'list',
    message: '是否同时启动nodeApi服务?',
    name: 'isDouble',
    choices: [
      {name: '是,同时启动两个服务', value: true},
      {name: '否,只启动一个', value: false}
    ]
  }
]

inquirer.prompt(promptList).then((answers) => {
  process.send(answers)
})
