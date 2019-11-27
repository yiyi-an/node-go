
const childProcess = require('child_process')
const chalk = require('../utils/chalk')
const fs = require("fs")
const path = require("path")

const root = path.join(process.env.PWD)


const dirWhiteList = ['node_modules', '.git', '.vscode','.DS_Store'] // 文件夹白名单 不会遍历其子目录
const fileWhiteList = ['.DS_Store'] // 文件白名单 不会输出

const maxDepth = 0 // 遍历深度 0表示只遍历当前目录

class Tree {
  constructor (options) {
    this.root = root
    this.treeData = '|\n'
    this.renderData = '|\n'
    this.fileTree = [] // 文件结构树
    this.run()
  }
  async run () {
    await this.getArg()
    this.readDirSync(this.root, this.fileTree, '', 0)
    this.render(this.fileTree)

    // 输出
    console.log('\n',this.root)
    console.log(this.renderData)
    if(this.isReadme){
      this.writeFile()
    }
  }

  getArg () {
    return new Promise((resolve, reject) => {
      const tagPromptProcess = childProcess.fork(__dirname + '/../src/tree-prompt.js')
      tagPromptProcess.on('message', (message) => {
        const { depth ,isReadme} = message
        console.log(depth)
        this.maxDepth = depth ? depth : maxDepth
        this.isReadme = isReadme
        resolve()
      })
    })
  }
  // 读取文件目录, 生成filltree
  // {
  //   ele:'', // 文件名称
  //   cid:'', // 文件位置标识 eg. 1-8-3-0-2 , 0代表当前目录最后一个文件
  //   children:'',   //只有dir有
  // }
  // eg:  1-12-3-0-1  0代表当前目录下最后一个文件
  readDirSync (currentPath, parentList, pid, depth) {
    let pa = fs.readdirSync(currentPath)
    const maxInd = pa.length - 1
    pa.forEach((ele, index) => {
      const info = fs.statSync(currentPath + "/" + ele)
      const currentNum = maxInd === index ? 0 : index + 1
      const cid = pid ? `${pid}-${currentNum}` : `${currentNum}`
      const obj = {ele, cid }
      if(!fileWhiteList.includes(ele)){
        parentList.push(obj)
      }
      if (info.isDirectory() && !dirWhiteList.includes(ele) && depth + 1 <= this.maxDepth) {
        obj.children = []
        obj.isDirectory = true
        const root = path.join(currentPath, '/', ele)
        this.readDirSync(root, obj.children, cid, depth + 1)
      }
    })
  }
  // 单行渲染逻辑
  rennderLine ({cid, ele}) {
    const arr = cid.split('-').map((item) => parseInt(item))
    const depth = arr.length - 1
    let str = ''
    arr.forEach((c, i, arr) => {
      if (i === depth) {
        str = c
          ? (str + '├')
          : (str + '└')
      } else {
        str = c
            ? str + '|   '
            : str + '    '
      }
    })

    return [str + '---' , depth]
  }
  render (fileTree) {
    fileTree.forEach(({ele, cid, children}) => {
      const [prefix,depth] = this.rennderLine({ele, cid})
      this.renderData += (prefix + chalk.list(depth,ele)+'\n')
      this.treeData += (prefix + ele +'\n')
      if (children) {
        this.render(children)
      }
    })
  }

  // 输出md文件
  writeFile(){
    const filePath = path.join(this.root,'README.structure.md')
    const mdTitle = 'README.structure.md'
    const nowMdTextData = '## 目录项目结构 \n``` \n' +  this.treeData +'\n ```'
    const nowMdText = new Uint8Array(Buffer.from(nowMdTextData))
    fs.writeFile(filePath, nowMdText, (err) => {
      if (err) throw err
      console.log("\nREADME.structure.md文件已创建")
    })
  }
}

module.exports = Tree
