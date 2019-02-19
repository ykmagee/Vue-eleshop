// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue';
import App from './App';
import router from './router';
// 引入Vuex的store对象
import store from './store';

Vue.config.productionTip = false;

//引入rem
import remConfig from './config/rem.js';
remConfig();
// 引入自定义的全局函数
import utils from './config/utils.js';
Vue.use(utils);
// 引入自定义过滤器
import './config/filters.js';
//引入mockjs
import './mock/mock.js';
// 注冊全局组件标签
import {Button} from 'mint-ui';
Vue.component(Button.name, Button); // <mt-button>

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  store,
  components: { App },
  template: '<App/>'
})
