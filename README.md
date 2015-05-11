# LeanChat 服务端

## 简介

LeanChat 是 [LeanCloud](http://leancloud.cn) [实时通信](https://leancloud.cn/docs/realtime.html) 组件的 Demo，通过该应用你可以学习和了解 LeanCloud 实时通信功能。

应用体验下载地址：[http://fir.im/leanchat](http://fir.im/leanchat)

## Leanchat 项目构成

* [Leanchat-android](https://github.com/leancloud/leanchat-android)：Android 客户端
* [Leanchat-ios](https://github.com/leancloud/leanchat-ios)：iOS 客户端
* [Leanchat-cloud-code](https://github.com/leancloud/leanchat-cloudcode)：可选服务端，使用 LeanCloud [云代码](https://leancloud.cn/docs/cloud_code_guide.html) 实现，实现了聊天的签名，更安全。


## 部署服务端

1. fork
2. 管理台在云代码相关位置填写地址
3. 管理台点击部署

## 文档

* git 仓库部署：[相关文档](https://leancloud.cn/docs/cloud_code_guide.html#部署代码)
* 命令行工具部署：[相关文档](https://leancloud.cn/docs/cloud_code_commandline.html#部署)

## 开发相关

### 相关接口

* `conv_sign`：对聊天操作进行签名

代码详见 [main.js](https://github.com/leancloud/AdventureCloud/blob/master/cloud/main.js)
