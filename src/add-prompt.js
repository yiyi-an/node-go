#!/usr/bin/env node
const inquirer = require('inquirer')
const projectConfig = require('../lib/check')
const chalk = require('../utils/chalk')
const promptList = [
  {
    type: 'input',
    message: '请输入项目名称',
    name: 'projectName',
    filters: (input) => input.trim(),
    validate (input) {
      const done = this.async()
      if (!input) {
        return false
      }
      done(null, true)
    }
  },
  {
    type: 'input',
    message: '项目根目录路径',
    name: 'path',
    filters: (input) => input.trim(),
    validate (input) {
      const done = this.async()
      if (!input) {
        return false
      }
      done(null, true)
    }
  },
  {
    type: 'list',
    message: '是否依赖nodeApi服务?',
    name: 'dependency',
    choices: [
      {name: '是', value: true},
      {name: '否', value: false}
    ]
  },
  {
    type: 'input',
    message: 'nodeApi项目根目录路径',
    name: 'apiPath',
    when: (answers) => answers.dependency,
    filters: (input) => input.trim(),
    validate (input) {
      const done = this.async()
      if (!input) {
        return false
      }
      done(null, true)
    }
  }
]

const getAllProjects = () => {
  if (!projectConfig.projects) {return []}
  return projectConfig.projects.map((item) => item.name)
}
const checkRepeate = (projectName) => {
  if (getAllProjects().includes(projectName)) {
    return false
  }
  return true
}
const prompts = () => new Promise((resolve, reject) => {
  inquirer.prompt(promptList)
    .then((answers) => {
      if (checkRepeate(answers.projectName)) {
        resolve(answers)
      } else {
        reject('该项目名称已存在!')
      }
    })
})

const pathRepair = (path) => {
  const _path = path.trim()
  if (!_path) {return new Error('项目路径不正确')}
  if (_path.slice(-1) !== '/') {
    return _path + '/'
  } else {
    return _path
  }
}

prompts()
  .then((answers) => {
    answers.path = pathRepair(answers.path)
    if (answers.apiPath) {answers.apiPath = pathRepair(answers.apiPath)}
    process.send(answers)
  })
  .catch((error) => {
    console.log(chalk.red(error))
    prompts()
  })
