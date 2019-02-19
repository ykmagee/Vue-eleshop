/*
vuex 的 mutations 模块,放的是改变数据的方法
*/
import Vue from 'vue';
import {
  RECEIVE_ADDRESS,
  RECEIVE_CURRENT_CITY,
  RECEIVE_CURRENT_ADDRESS,
  RECEIVE_CATEGORYS,
  RECEIVE_SHOPS,
  RECEIVE_USER_INFO,
  RESET_USER_INFO,
  UPDATE_SEARCH_HISTORY,
  RECEIVE_INFO,
  RECEIVE_RATINGS,
  RECEIVE_GOODS,
  INCREMENT_FOOD_COUNT,
  DECREMENT_FOOD_COUNT,
  CLEAR_CART,
  RECEIVE_SEARCH_SHOPS,
  CLEAR_SEARCH_SHOPS} from './mutation-types';

export default {
	// [方法名](state,{param}){}
	[RECEIVE_ADDRESS] (state, {address}){
		state.address = ddress;
	},
  [RECEIVE_CURRENT_CITY] (state, {city}){
    state.currentCity = city;
  },
  [RECEIVE_CURRENT_ADDRESS] (state, {latitude, longitude, address}){
    state.latitude = latitude;
    state.longitude = longitude;
    state.currentAddress = address;
  },  
	[RECEIVE_CATEGORYS] (state, {categorys}) {
    state.categorys = categorys
  },
  [RECEIVE_SHOPS] (state, {shops, offset}) {
    if (offset === 0) {
      // 如果第一次请求就将shops清空
      state.shops = []
    }
    state.shops = state.shops.concat(shops)
  },
  [RECEIVE_USER_INFO] (state, {userInfo}) {
    state.userInfo = userInfo
  },
  [RESET_USER_INFO] (state) {
    state.userInfo = {}
  },
  [UPDATE_SEARCH_HISTORY] (state, {searchHistory}) {
    if (!state.userInfo.searchHistory) {
      Vue.set(state.userInfo, 'searchHistory', searchHistory)
    } else {
      state.userInfo.searchHistory = searchHistory
    }   
  },
  [RECEIVE_INFO] (state, {info}) {
    state.info = info
  },
  [RECEIVE_RATINGS] (state, {ratings}) {
    state.ratings = ratings
  },
  [RECEIVE_GOODS] (state, {goods}) {
    state.goods = goods
  },
  [INCREMENT_FOOD_COUNT] (state, {food}) {
    // 如果是第一次增加，则需新增count属性
    if (!food.count) { 
      // food.count = 1  普通的新增属性没有数据绑定效果
      // Vue.set( target, key, value )方法能让新属性是响应式的
      Vue.set(food, 'count', 1)
      // 将food添加到cartFoods中
      state.cartFoods.push(food)
    } else {
      food.count++
    }
  },
  [DECREMENT_FOOD_COUNT] (state, {food}) {
    if (food.count) { // 只有有值才去减
      food.count--
      if (food.count === 0) {
        // 将food从cartFoods中移除
        state.cartFoods.splice(state.cartFoods.indexOf(food), 1)
      }
    }
  },
  [CLEAR_CART] (state) {
    // 清除food中的count
    state.cartFoods.forEach(food => { food.count = 0 })
    // 移除购物车中所有购物项
    state.cartFoods = []
  },
  [RECEIVE_SEARCH_SHOPS] (state, {searchShops}) {
    state.searchShops = searchShops
  },
  [CLEAR_SEARCH_SHOPS] (state) {   
    // 移除搜索结果
    state.searchShops = []
  }
}