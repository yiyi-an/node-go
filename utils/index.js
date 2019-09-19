module.exports =  {

  randomValue(value,md5){

    if(!value || !md5) return 

    const md5Str =  md5(value)
    const f = String.fromCharCode(Math.floor( Math.random() * 26) + 'a'.charCodeAt())
    const c = md5Str.slice(-10,md5Str.length)
    return `${f}${c}`
  },

  appndToConfig(options){
    const {name,value,config,path,flag} = options
    const obj = {name,value}
    if( !(config.projects instanceof Array)) {
      config.projects = []
    }
    if(!config.path){
      config.path = config.path || {}
    }
    const isHadly = config.projects.some(item => item.name === name)
    if(!isHadly){
      config.projects.push(obj)
    }
    
    config.path[`${value}${flag}`] = path
    
    return config
  }
}