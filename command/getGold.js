const axios =  require('axios')
const moment = require('moment-mini')
const childProcess = require('child_process')
const chalk = require('../utils/chalk')

const goldUrl = "https://hq.sinajs.cn/?_=1605235716853/&list=hf_XAU";

class GetGold {
  constructor(options){
    this.option = options

    this.textFill = chalk.bold.rgb(255,255,255)

    this.startPoint = undefined
    this.currentPoint = undefined
    this.todayMaxPoint = undefined
    this.todayMinPoint = undefined
    this.currentTime = undefined

    this.prevPoint = 0
    this.run()
  }
  async loop() {
    const timeStamp = +new Date()
    const {data} = await axios.get(goldUrl)
    const PointArr = data.split("=")[1].slice(1,-1).split(',')
    this.currentPoint = PointArr[0]
    this.todayMaxPoint = PointArr[4]
    this.todayMinPoint = PointArr[5]
    this.currentTime = PointArr[6]
    if(this.prevPoint !== this.currentPoint) {
      this.print()
      this.prevPoint = this.currentPoint
    }
    setTimeout(() => {
      this.loop()
    }, 1000)
  }
  getBothStr(cValue, fields){
    const val = this[fields]
    if(fields === 'todayMaxPoint'){
      this.todayMaxPoint = cValue
      return `---max:${this.textFill.red(cValue)}`

    }else{
      this.todayMinPoint = cValue
      return `---min:${this.textFill.cyan(cValue)}`
    }
  }
  print(){
    const currentPointFill =  this.currentPoint < this.prevPoint ? this.textFill.bgGreen : this.textFill.bgRed
      const timeStr = chalk.bold.rgb(255,215,0)(this.currentTime)
      const maxStr = this.getBothStr( this.todayMaxPoint,'todayMaxPoint')
      const minStr = this.getBothStr(this.todayMinPoint,'todayMinPoint')
      console.log(timeStr,currentPointFill(' ',this.currentPoint,' '),maxStr,minStr)
  }

  async run(prev){
    const timeStamp = +new Date()
    const {data} = await axios.get(goldUrl)
    const PointArr = data.split("=")[1].slice(1,-1).split(',')
    // PointArr[0]  [0]  最新价
    // PointArr[1]  昨日结算价(精确)
    // PointArr[2]  买价
    // PointArr[3]  卖价
    // PointArr[4]  最高价
    // PointArr[5]  最低价
    // PointArr[6]  时间
    // PointArr[7]  结算价
    // PointArr[8]  开盘价
    this.currentPoint = PointArr[0]
    this.todayMaxPoint = PointArr[4]
    this.todayMinPoint = PointArr[5]
    this.startPoint = PointArr[8]
    this.currentTime = PointArr[6]
    this.loop()
  }
}


module.exports = GetGold