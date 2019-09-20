# node-go

> node服务快速启动工具, 运行vue-cli项目，并同时运行依赖的nodeapi项目。



### 使用之前

```shell
## 安装依赖，注册
npm i && npm install -g .

##运行
go
```



### 项目命令

- ##### `go`

  快速启动项目，执行项目配置文件`project.config.js`里的项目，首次运行`go`命令会自动创建项目配置文件。

- ##### `go add`

  添加项目，根据用户输入更新`project.congfig.js`文件的内容，尽量避免手动修改上述文件。

- ##### `go ls`

  查看已经添加的项目

- ##### `go rm <project>` (未完成)

  移除项目

- ##### `go tag`

  快速根据构建环境新建tag，并推送至远程仓库。

- ##### 自定义alias（未完成）



### 移除

```shell
npm uninstall -g go
```