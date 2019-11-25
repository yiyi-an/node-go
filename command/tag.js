const childProcess = require('child_process')
const chalk = require('../utils/chalk')
const u = require('../utils')

class Tag {
  constructor (option) {
    this.option = option

    this.onExit()
    this.run()
  }

  async run () {
    await this.getArg()
    this.comVersion()
    this.pullTag()
  }
  getArg () {
    return new Promise((resolve, reject) => {
      const tagPromptProcess = childProcess.fork(__dirname + '/../src/tag-prompt.js')
      tagPromptProcess.on('message', (message) => {
        const {branch, v, description} = message
        const timeStr = u.parseDateTime(new Date(), '{y}{m}{d}{h}{i}')
        let _v = v.toLowerCase()
        let version = _v.includes('v') ? _v : 'v' + _v
        this.arg = {
          branch,
          description,
          timeStr,
          version,
          _v}
        resolve(this.arg)
      })
    })
  }

  comVersion () {
    const arg = this.arg
    
    if (!arg._v) {
      console.log(chalk.green(`正在获取 ${arg.branch} 环境远程tag... `))
      childProcess.execFileSync('git', ["fetch", "origin", "--prune"])
      const stdout = childProcess.execFileSync('git', ['tag', '-l', `${arg.branch}*`])
      const tagRes = stdout
        .toString()
        .trim()

      const tagList = tagRes ? tagRes.split('\n') : []
      if (tagList.length && tagList instanceof Array) {
        console.log(chalk.green('正在比对版本号...\n'))
        const prevTag = tagList.sort(u.versionSortRule).reverse()[0]
        console.log(chalk.blue('找到最新版本: '), chalk.blue.bold(prevTag))
        const [, prevVersion] = prevTag.split('-')
        this.arg.version = prevVersion
      } else {
        console.log(chalk.red('未找到历史版本记录!'))
        this.arg.version = 'v1.0.0'
      }
    }
  }

  pullTag () {
    const {branch, version, timeStr} = this.arg

    const currentTagArr = [branch, version, timeStr]
    const currentTag = currentTagArr.join('-')
    console.log(chalk.blue('\nNew Tag:\n\n'), chalk.blue.bold.underline(currentTag), '\n')
    childProcess.execFileSync('git', ['tag', '-a', currentTag, '-m', this.arg.description])
    console.log(chalk.green('push to origin...'))
    childProcess.execFileSync('git', ['push', 'origin', `${currentTagArr.join('-')}`])
  }

  onExit(){
    process.on('exit', () => {
      console.log(chalk.orange(
        `
  ┌-----------------------------------------┐
  |  Tag已经创建好了,快去发布吧  ╮(￣▽￣)╭  |
  └-----------------------------------------┘
  `
      ))
    })
  }
}


module.exports = Tag
