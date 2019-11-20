#!/usr/bin/env node
const inquirer = require('inquirer')
const config = require(__dirname + '/../../.go.project.config.js')

const promptList = [
  {
    type: 'list',
    message: '用vsCode打开:',
    name: 'identify',
    choices: config.projects
  }
]

inquirer.prompt(promptList).then((answers) => {
  process.send(answers)
})
