# mpmall

> A Vue.js project

## Build Setup

``` bash
# install dependencies
npm install

# serve with hot reload at localhost:8080
npm run dev

# build for production with minification
npm run build

# build for production and view the bundle analyzer report
npm run build --report
```
## 技术栈
- Vue全家桶（使用Vue-cli作为构建工具）
- Element-Ui
- Es6
- Sass

For a detailed explanation on how things work, check out the [guide](http://vuejs-templates.github.io/webpack/) and [docs for vue-loader](http://vuejs.github.io/vue-loader).

## 项目结构 ##
```
|-- build                            // webpack配置文件
|-- config                           // 项目打包路径
|-- src                              // 源码目录          
|   |-- assets                       // 图片资源,js,css,json文件
|   |-- components                   // 组件
|       |-- customer
|           |-- home                 //首页相关组件
|               |-- ...
|           |-- managegoods          //商品管理相关组件
|               |-- ...
|       |-- mpshop
|           |-- shop                 //店铺相关组件
|               |-- ...
|       |-- public
|           |-- ...                  //公共复用组件
|       |-- user
|           |-- user                 //用户相关组件
|               |-- ...
|   |-- pages                        // 小程序商城页面
|       |-- customer
|           |-- home       
|               |-- app.html         //首页入口html文件
|               |-- app.js           //首页入口js文件
|               |-- app.vue          //首页入口vue文件
|               |-- router.js        //首页配置页面路由
|           |-- managegoods       
|               |-- app.html         //商品管理入口html文件
|               |-- app.js           //商品管理入口js文件
|               |-- app.vue          //商品管理入口vue文件
|               |-- router.js        //商品管理配置页面路由
|       |-- mpshop
|           |-- shop       
|               |-- app.html         //店铺入口html文件
|               |-- app.js           //店铺入口js文件
|               |-- app.vue          //店铺入口vue文件
|               |-- router.js        //店铺配置页面路由
|       |-- user
|           |-- user       
|               |-- app.html         //用户相关html文件
|               |-- app.js           //用户相关入口js文件
|               |-- app.vue          //用户相关入口vue文件
|               |-- router.js        //用户相关配置页面路由
|   |-- store                        // Vuex Store文件
|       |-- customer
|           |-- managegoods       
|               |-- store.js         //商品管理vuex 
|           |-- marketing       
|               |-- store.js         //优惠券vuex 
|       |-- mpshop
|           |-- shop       
|               |-- store.js         //小程序店铺列表vuex  
|       |-- user
|           |-- store.js             //小程序商城登录注册vuex  
|   |-- filters                       // 过滤器函数
|       |-- filters.js            
|-- .babelrc                         // ES6语法编译配置
|-- .editorconfig                    // 代码编写规格
|-- .eslintignore                    // Eslint 忽略的文件
|-- .eslintrc.js                     // EsLint 配置 暂未使用 
|-- .gitignore                       // git ingnore
|-- .postcssrc.js                    // post css 配置文件
|-- README.md                        // README
`-- package.json                     // 项目及工具的依赖配置文件

```