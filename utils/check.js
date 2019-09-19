const fs = require('fs')
const exists = fs.existsSync('project.config.js')

if (!exists){
  console.log('>>> 已创建: project.config.js')
  fs.writeFileSync(__dirname+"/../project.config.js","module.exports = {}")
}
