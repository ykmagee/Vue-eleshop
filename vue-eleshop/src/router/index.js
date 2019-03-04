import Vue from 'vue';
import Router from 'vue-router';
// import Home from '../views/Home/HomeView.vue';
// import Order from '../views/Order/OrderView.vue';
// import Personal from '../views/Personal/PersonalView.vue';
// import Search from '../views/Search/SearchView.vue';
import Shop from '../views/Shop/Shop.vue';
import ShopGoods from '../views/Shop/ShopGoods/ShopGoods.vue';
import ShopRatings from '../views/Shop/ShopRatings/ShopRatings.vue';
import ShopInfo from '../views/Shop/ShopInfo/ShopInfo.vue';
import Login from '../views/Login/Login.vue';

// 路由组件懒加载
const Home = () => import('../views/Home/HomeView.vue')
const Order = () => import('../views/Order/OrderView.vue')
const Personal = () => import('../views/Personal/PersonalView.vue')
const Search = () => import('../views/Search/SearchView.vue')

Vue.use(Router);

export default new Router({
  //默认为hash模式，url中带 #，改为history模式
  mode: 'history',
  // 切换路由时回到页面顶部
  scrollBehavior (to, from, savedPosition) {
    if (savedPosition) {
      return savedPosition
    } else {
      return { x: 0, y: 0 }
    }
  },
  routes: [
    { //默认跳转路由
      path:'*',
      redirect:'/home' 
    },    
    {
      path: '/home',
      name: 'Home',
      component: Home,
      // 标识此路由是否显示FooterGuide
      meta: {
        showFooter: true
      }
    },
    {
      path: '/order',
      name: 'Order',
      component: Order,
      meta: {
        showFooter: true
      }
    },
    {
      path: '/personal',
      name: 'Personal',
      component: Personal,
      meta: {
        showFooter: true
      }
    },
    {
      path: '/search',
      name: 'Search',
      component: Search,
      meta: {
        showFooter: true
      }
    },
    {
      path: '/login',
      name: 'Login',
      component: Login
    },
    {
      path: '/shop/:id', //动态路由
      //有子路由的父级路由需要一个默认路由时，父级路由不能定义name属性
      // name: 'Shop',
      component: Shop,
      children:[{
        path: 'goods',
        name: 'ShopGoods',
        component: ShopGoods
      },
      {
        path: 'ratings',
        name: 'ShopRatings',
        component: ShopRatings
      },
      {
        path: 'info',
        name: 'ShopInfo',
        component: ShopInfo
      },
      {
        path: '',
        redirect: 'goods'
      }]
    }
  ]
})
