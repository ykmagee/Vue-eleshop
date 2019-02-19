/*
vuex最核心的管理对象store
组装模块并导出 store 的地方
 */
// 引入Vue及Vuex
import Vue from 'vue';
import Vuex from 'vuex';

// 引入四个基本模块
import state from './state';
import mutations from './mutations';
import actions from './actions';
import getters from './getters';

Vue.use(Vuex);

//实例化并暴露
export default new Vuex.Store({
	state,
  mutations,
  actions,
  getters
})