#!/usr/bin/env node
const chalk = require('../utils/chalk')
const childProcess = require('child_process')

console.log(chalk.bgGreen.red('正在启动' + process.argv[3] + '...') + ' ' + chalk.blue('pid:' + process.pid))
console.log(chalk.blue(process.argv[2]))
childProcess.execFileSync('npm', ['run', 'dev'], {cwd: process.argv[2], stdio: 'inherit'})
