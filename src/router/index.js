import { createRouter, createWebHashHistory } from 'vue-router'
import store from '@/store'
import Layout from '@/layout'

// 获取当前对应文件夹下的 所有以router.js 结尾的文件
// 私有路由
// files就是一个函数  , false 不去遍历子目录
const files = require.context('./modules', false, /\.js$/)
export const privateRoutes = []
files.keys().forEach(key => {
  // 获取到文件的内容 拿到默认的导出结果 放到routes里 ， 如果遇到* 号 路由会将* 放到最后面
  privateRoutes.push(files(key).default)
})
console.log(privateRoutes, 'ccc')
// 公开路由
export const publicRoutes = [
  {
    path: '/login',
    component: () => import('@/views/Login')
  },
  {
    path: '/',
    name: '/',
    // 重定向到/profile页面
    redirect: '/home',
    component: Layout,
    // 只有一层的不要使用这个
    // meta: {
    //   title: 'profile',
    //   icon: 'el-icon-user',
    // },
    children: [
      {
        path: '/home',
        name: 'home',
        component: () => import('@/views/Home/index'),
        meta: {
          title: 'home'
        }
      },
      // 404
      {
        path: '/404',
        name: '404',
        component: () => import('@/views/error-page/404')
      },
      {
        path: '/401',
        name: '401',
        component: () => import('@/views/error-page/401')
      }
    ]
  }
]

const router = createRouter({
  history: createWebHashHistory(),
  routes: publicRoutes
})

// 白名单
const whiteList = ['/login']
/**
 * @description: 路由前置守卫
 * @param {*} to 要到哪里去
 * @param {*} from 从哪里来
 * @param {*} next  是否要去
 * @return {*}
 */
router.beforeEach(async (to, from, next) => {
  // 存在 token ，进入主页
  if (store.getters.token) {
    if (to.path === '/login') {
      next('/')
    } else {
      if (!store.getters.isLoadMenu) {
        // 处理用户权限，筛选出需要添加的路由
        // 模拟请求后菜单数据
        const menusList = ['account', 'access', 'file']
        const filterRoutes = await store.dispatch('menu/filterRoutes', menusList)
        // 利用 addRoute 循环添加
        filterRoutes.forEach((item) => {
          router.addRoute(item)
        })
        next({ ...to, replace: true })
      }
      next()
    }
  } else {
    // 到登录页面
    // 没有token的情况下，可以进入白名单
    if (whiteList.indexOf(to.path) > -1) {
      next()
    } else {
      next('/login')
    }
  }
})
export default router
