# matchus-frontend

## 项目简介

本项目是MatchUs的微信小程序。

## 注意事项

### 微信开发者工具查看时

- 在使用微信开发者工具查看编译效果的时候，不要使用开发者工具的编译功能
- 可以通过清除缓存达到初始打开应用的效果
- 通过禁用掉详情 - 本地设置 中的 "不校验合法域名"一栏，可以使用IP地址或localhost调试接口服务

## 快速开始

本项目使用 [Taro](https://docs.taro.zone/docs/version) 跨平台框架开发，使用的版本是v3.4.1。

### 版本管理

Taro各个版本之间兼容性不佳，建议安装正确的版本。

```shell
# 使用Taro 升级命令更新CLI版本到最新版本
$ taro update self [版本号]
# 使用Taro 升级命令更新CLI版本到指定版本
$ taro update self
# 使用Taro 升级命令将项目依赖升级到与@tarojs/cli一致的版本
$ taro update project 
# 使用Taro 升级命令将项目依赖升级到指定版本
$ taro update project [版本号]
```

安装Taro命令行工具taro-cli的正确版本：

如果之前有安装其他版本的@tarojs/cli，需要先全局卸载，执行下方命令:
```
  npm uninstall -g @tarojs/cli
  rm -rf node_modules

  选择下列一种
  npm install -g @tarojs/cli@3.4.1
  cnpm install -g @tarojs/cli@3.4.1
  yarn global add @tarojs/cli@3.4.1
```

### 安装依赖

```shell
# in directory matchus-frontend
npm install
```

### 开发与编译

开发目录下的config.js文件指定了服务端的地址和端口，请按需进行修改。

在开发完并需要检查运行时效果时，使用：
```shell
(sudo) npm run dev:weapp
```
来获得编译产物，位于./dist文件夹下。Taro将会监听文件修改，会根据代码改动动态更新产物变化。

如果在编译过程中遇到问题，可以尝试删除原来的文件夹并重新执行命令。

接下来使用微信开发者工具打开该文件夹即可获得运行时效果。

### 集成与交付

在完成所有开发后，使用：
```shell
(sudo) npm run build:weapp
```
获得产物。Taro将不会监听文件修改，并会对代码进行压缩打包。



