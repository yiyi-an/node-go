# node-go

> node服务快速启动工具, 运行vue-cli项目，并同时运行依赖的nodeapi项目。



### 使用之前

```shell
## 安装依赖，注册
npm install -g no-fast-go

##运行
goo
```



### 项目命令

- `goo run`

  快速启动项目，执行项目配置文件`project.config.js`里的项目，首次运行`go`命令会自动创建项目配置文件。

  > 效果同： `goo`

-  `goo add`

  添加项目，根据用户输入更新`project.congfig.js`文件的内容，尽量避免手动修改上述文件。

-  `goo ls`

  查看已经添加的项目

-  `goo rm <project>` (未完成)

  移除项目

-  `goo tag`

  快速根据构建环境新建tag，并推送至远程仓库。

-  自定义alias（未完成）




### 移除package

```shell
npm uninstall -g no-fast-go
```