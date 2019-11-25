#!/usr/bin/env node
const inquirer = require('inquirer')

const promptList = [
  {
    type: 'input',
    message: '递归层级, "0" 表示当前目录',
    name: 'depth',
    validate (val) {
      if (val.match(/^[0-9]\d*$/g)) {
        return true
      }
      return '请输数字, 0 表示只输出当前目录'
    }
  },
  {
    type: "confirm",
    message: "是否创建文件到当前目录？",
    name: "isReadme",
    prefix: "📖"
  }
]

inquirer.prompt(promptList).then((answers) => {
  process.send(answers)
})
