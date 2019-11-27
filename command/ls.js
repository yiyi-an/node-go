
const chalk = require('../utils/chalk')
const { projects } = require(__dirname + '/../../.go.project.config.js')

class Ls {
  constructor (option) {
    if (projects instanceof Array && projects.length) {
      let str = '-------------------------------\n已有项目:\n\n'
      projects.forEach((item) => {
        str += chalk.green(`  ${item.name}`) + '\n'
      })
      console.log(`${str}\n-------------------------------`)
    } else {
      console.log('已已有项目:\n空的!\n')
    }
  }
}

module.exports = Ls
