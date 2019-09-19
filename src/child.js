#!/usr/bin/env node
const chalk = require('chalk')
const childProcess = require('child_process')

console.log(chalk.bgGreen.red('正在启动'+process.argv[3]+'...')+' '+chalk.blue('pid:'+process.pid))
console.log(chalk.blue(process.argv[2]))
const childProcessorExec =  childProcess.spawn('npm',['run','dev'],{cwd:process.argv[2],stdio:'inherit'},(error,stdout,stderr)=>{
  if (error) {
    console.error(`exec error: ${error}`)
    return
  }
  console.log(`stdout: ${stdout}`)
  console.log(`stderr: ${stderr}`)
})

childProcessorExec.on('data',(data)=>{
  console.log(`stdout: ${data}`)
})


childProcessorExec.on('exit', (code) => {
  console.log(`子进程 ${code} 退出`)
})