# node-go

> node服务快速启动工具, 运行vue-cli项目，并同时运行依赖的nodeapi项目。


### 使用之前

```shell
## 安装依赖，注册
npm install -g no-fast-go

##运行
goo
```

### 实现原理

通过维护一个js配置文件,管理正在开发的项目. 通过`goo`指令快速执行例如:用VsCode打开; git tag; npm run dev 等操作,
从而释放双手..

> 首次运行`goo`命令会自动在上级目录创建项目配置文件,根据用户输入配置更新文件内容.

### 项目命令

- `goo run`

    快速启动项目，执行项目配置文件`../.go.project.config.js`配置过得项目。

    > 也可以直接输入 `goo`

-  `goo add`

    添加项目，根据用户输入更新`../.go.project.config.js`文件的内容，尽量避免手动修改上述文件。

-  `goo ls`

    查看已经添加的项目

-  `goo rm [project]` 

    移除项目(未完成!!!!!!)

-  `goo tag`

    根据用户输入(构建环境,版本号)新建tag，并推送至远程仓库。
    > tag命名规则:  v{x}.{y}.{z},  xyz分别对应:环境标识-版本号-时间戳  
    > eg: pre-v1.0.0-201908170850000  
    > 如未输入版本号,则拉取对应环境最近一次tag版本号作为 y

-  自定义alias

    自定义一些其他的命令,宏命令(未完成)



### 移除package

```shell
npm uninstall -g no-fast-go
```