<h1 align="center">Semi-Admin</h1>
<div align="center">基于 <a href="https://semi.design/zh-CN/">Semi-Design</a> 实现的后台脚手架，具备 路由/登录/权限/mock等基本功能</div>

## 依赖

> react v17.0.2
> 
> typescript v4.5.3
> 
> semi-disign v2.1.5
> 
> react-router  v6
> 
> axios v0.24.0

## 安装

```bash
git clone ...
cd my-project
yarn install
```
国内网络可使用cnpm淘宝镜像加速安装
```bash
npm install -g cnpm --registry=https://registry.npm.taobao.org
cnpm install
```

## 运行
```
npm run start
```

## 界面截图

> 登录

![image](https://gitee.com/django-extend/photowall/raw/master/semi/semi-login.png)

> 列表页

![image](https://gitee.com/django-extend/photowall/raw/master/semi/semi-index.png)

> 编辑页

![image](https://gitee.com/django-extend/photowall/raw/master/semi/semi-edit.png)

## 目录结构

```bash
.
├── README.md
├── config-overrides.js             # 扩展配置（alias在这里配置）
├── package-lock.json               
├── package.json                    # 基础项目配置
├── public
├── src
│   ├── App.test.tsx
│   ├── App.tsx                     # 入口程序
│   ├── api                         # 远程接口
│   ├── components
│   │   └── semi-ext                # semi扩展库
│   ├── config
│   │   ├── app.config.tsx          # 应用配置
│   │   └── router.config.tsx       # 路由配置
│   ├── index.css
│   ├── index.tsx
│   ├── layouts
│   │   ├── app.tsx                 # 登录态页面布局
│   │   └── blank.tsx               # 非登录态页面布局
│   ├── mock                        # 本地mock数据
│   ├── react-app-env.d.ts
│   ├── reportWebVitals.ts
│   ├── setupTests.ts
│   ├── store                       # 共享数据
│   ├── utils
│   │   ├── auth.tsx                # 权限相关
│   │   ├── request.tsx             # axios封装
│   │   ├── router.tsx              # 路由、菜单相关
│   │   └── theme.tsx               # 换肤
│   └── views                       # 页面目录
├── tsconfig.json
└── tsconfig.paths.json             # alias在这里配置（IDE需要使用）
```