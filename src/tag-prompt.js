#!/usr/bin/env node
const inquirer = require('inquirer')

const promptList = [
  {
    type: 'list',
    message: 'tag在那个环境发布?',
    name: 'branch',
    choices: [
      {
        name: 'qa : 新测试',
        value: 'qa'
      },
      {
        name: 'pre : 预上线',
        value: 'pre'
      },
      {
        name: 'master : 生产',
        value: 'master'
      }, {
        name: 'dev : 开发',
        value: 'dev'
      }
    ]
  },
  {
    type: 'input',
    message: '输入版本号,格式:x.y.z (不输入则自动匹配):',
    name: 'v'
  },
  {
    type: 'input',
    message: 'Tag描述:',
    name: 'description'
  }
]

inquirer.prompt(promptList).then((answers) => {
  process.send(answers)
})
