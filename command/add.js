const childProcess = require('child_process')
const chalk = require('../utils/chalk')
const fs = require('fs')
const md5 = require('md5')

const configPath = __dirname + '/../../.go.project.config.js' //confit文件路径

class Add {
  constructor () {
    this.run()
  }
  
  async run(){
    this.message = await this.getArg()
    console.log(chalk.green('正在写入配置...'))
    this.readConfig()
    this.writeConfig()
  }

  getArg () {
    return new Promise((resolve, reject) => {
      const promptProcess = childProcess.fork(__dirname + '/../src/add-prompt.js')
      promptProcess.on('message', (message) => {
        resolve(message)
      })
    })
  }

  readConfig(){
    const { projectName, path, dependency, apiPath} = this.message
    const pValue = this.randomValue(projectName, md5) || new Error('randomValue call Error!')
    this.result = eval(fs.readFileSync(configPath, 'utf8'))
    const options = {
      config: this.result,
      name: projectName,
      value: pValue,
      path,
      flag: 'Desktop'
    }
    if(dependency) {
      options.path = apiPath
      options.flag = 'Api'
    }
    this.result = this.appndToConfig(options)
  }

  // 写入project.config.js
  writeConfig(){
    var buffer = new Buffer(`module.exports = ${JSON.stringify(this.result, null, 2)}`)
    fs.writeFile(configPath, buffer, function (err) {
      if (err) {
        console.log(chalk.red('写入配置失败'))
        console.error(err)
        return
      }
      console.log(chalk.blue('配置更新完成!'))
      console.log(chalk.blue('运行: '), chalk.bgRed.white('goo'), ' ', chalk.blue('启动项目吧!'))
    })
  }

  appndToConfig (options) {
    const {name, value, config, path, flag} = options
    const obj = {name, value}
    if (!(config.projects instanceof Array)) {
      config.projects = []
    }
    if (!config.path) {
      config.path = config.path || {}
    }
    const isHadly = config.projects.some((item) => item.name === name)
    if (!isHadly) {
      config.projects.push(obj)
    }

    config.path[`${value}${flag}`] = path

    return config
  }
  randomValue (value) {
    if (!value ) {return}
    const md5Str = md5(value)
    const f = String.fromCharCode(Math.floor(Math.random() * 26) + 'a'.charCodeAt())
    const c = md5Str.slice(-10, md5Str.length)
    return `${f}${c}`
  }
}

module.exports = Add
