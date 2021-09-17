# 线下供货系统 - 前端代码仓库


## 一、构建安装

#### 用yarn安装依赖包

``` bash
$ yarn install
```

#### 运行开发环境，在浏览器打开localhost:3000，支持热重载

``` bash
$ yarn dev
```

#### 构建生产环境和启动服务器

``` bash
$ yarn build
$ yarn start
```

#### 生成静态项目

``` bash
$ yarn generate
```

## 二、文件结构
```shell
.
├── api  项目接口配置
├── assets  资源
│   └── images  图片文件
├── components  组件
├── layouts  布局
├── middleware  中间件
├── pages  页面
│   ├── brand-shop  品牌-店铺管理
│   ├── goods  货品管理
│   ├── replay  复盘汇总
│   ├── setting  设置
│   ├── stocking-plan  备货计划管理
│   ├── stocking-plan-applyfor  备货计划申请
│   ├── stocking-plan-audit  备货计划审核
│   └── warehousing  入仓记录
├── plugins  插件
├── server
├── static  静态文件
├── store
├── test
└── utils
```

## 组件页面参数保留
``` bash
# 使用方法
1./plugins/router.js  或者 /plugins/other-router.js路由项加上keepName参数
2.保存参数组件设置name值，且必须与路由文件设置的keepName一致

# 注意事项
1.保留参数使用的是keep-alive所以每次进入页面都需要执行的代码应放在生命周期activated里而不是created/mounted
```

## 不在菜单的页面必须添进other-router
``` bash
other-router文件目录：/plugins/other-router
```

## UploadFile
``` bash
上传组件中间件(全局引入)
目录：/components/UploadFile
使用iview上传组件涉及进度条需使用此中间件（因为后台接收时间过长，做假进度条处理）
```