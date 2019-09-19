#!/usr/bin/env node
const program = require('commander')
const fs = require('fs')
const childProcess = require('child_process')
const chalk = require('chalk')
const md5 = require('md5')
const u = require('../utils')



const projectConfig = require('../project.config.js')

const packageData = JSON.parse(fs.readFileSync('./package.json','utf8'))
const { version } = packageData

program
  .version(version)
  .allowUnknownOption()
  .option('-r, --registry <registry>', 'use custom registry' )

program
  .command('add')
  .description('新增项目')
  .action(option=>{
    // 交互
    const promptProcess = childProcess.fork('./src/add.js')
    promptProcess.on('message',(message)=>{
      console.log(chalk.green('正在写入配置...'))

      let result = eval(fs.readFileSync('project.config.js','utf8'))
      const {
        projectName,
        path,
        dependency,
        apiPath
      } = message
      
      //取值并更新config
      const pValue = u.randomValue(projectName,md5) || new Error('randomValue call Error!')
      result = u.appndToConfig({
        config:result,
        name:projectName,
        value:pValue,
        path,
        flag:'Desktop'
      })
      if(dependency){
        result = u.appndToConfig({
          config:result,
          name:projectName,
          value:pValue,
          path:apiPath,
          flag:'Api'
        })
      }

      //写入project.config.js
      var buffer = new Buffer(`module.exports = ${JSON.stringify(result,null,2)}`)
      fs.writeFile(__dirname + '/../project.config.js', buffer,function (err) {
        if(err) {
          console.log(chalk.red('写入配置失败'))
          console.error(err)
          return
        } 
        console.log(chalk.blue('配置导入完成!'))
        console.log(chalk.blue('运行: '),chalk.bgRed.white('go'),' ',chalk.blue('启动项目吧!'))

      })

    })

  })

if(process.argv.length ===2 ){
  if(!projectConfig.projects || !projectConfig.projects.length){

    console.log(chalk.bgRed.white('>>> 未添加项目,请先添加项目,运行: go add'))

  }else{

    const promptProcess = childProcess.fork('./src/prompt.js')
  
    promptProcess.on('message',message=>{
      const { identify , isDouble } = message
      if(isDouble){
        childProcess.fork('src/child.js',[projectConfig.path[`${identify}Api`],'Api'])
      }
      childProcess.fork('src/child.js',[projectConfig.path[`${identify}Desktop`],'桌面端'])
    })

  }

}

program.parse(process.argv)