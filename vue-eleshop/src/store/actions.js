/*
Action:通过操作mutation间接更新state的多个方法的对象
	可包含任意异步操作
 */

// 注意要引入api接口函数
import {
  reqAddress,
  reqCategorys,
  reqShops,
  reqUserInfo,
  reqLogout,
  reqShopRatings,
  reqShopGoods,
  reqShopInfo,
  reqSearchShop
} from '../api';

import {
  RECEIVE_ADDRESS,
  RECEIVE_CURRENT_CITY,
  RECEIVE_CURRENT_ADDRESS,
  RECEIVE_CATEGORYS,
  RECEIVE_SHOPS,
  RECEIVE_USER_INFO,
  RESET_USER_INFO,
  UPDATE_SEARCH_HISTORY,
  RECEIVE_GOODS,
  RECEIVE_RATINGS,
  RECEIVE_INFO,
  INCREMENT_FOOD_COUNT,
  DECREMENT_FOOD_COUNT,
  CLEAR_CART,
  RECEIVE_SEARCH_SHOPS,
  CLEAR_SEARCH_SHOPS
} from './mutation-types';

export default {
	// 异步获取地址
	async getAddress ({commit,state}) {
		// 从state状态中获取到经纬度用来设置reqAddress的参数（看接口文档）
		const geohash=state.latitude+','+state.longitude;
		// 1. 发送异步ajax请求
		const result=await reqAddress(geohash);
		// 2. 提交一个mutation
		if (result.code===0) {
			const address=result.data;
			commit(RECEIVE_ADDRESS,{address})
		}
	},

  // 同步更新当前所在城市
  recordCurrentCity ({commit}, city) {
    commit(RECEIVE_CURRENT_CITY, {city})
    sessionStorage.setItem("currentCity",city)
  },

  // 同步更新当前地址经纬度和名称
  recordCurrentAddress ({commit}, {latitude, longitude, address}) {
    commit(RECEIVE_CURRENT_ADDRESS, {latitude, longitude, address})
    sessionStorage.setItem("location",JSON.stringify({latitude, longitude, address}))
  },

	// 异步获取食品分类列表
  async getCategorys ({commit}) {
    const result = await reqCategorys()
    if (result.code === 0) {    	
      const categorys = result.data
      // console.log(categorys);
      commit(RECEIVE_CATEGORYS, {categorys})
    }
  },

  // 异步获取商家列表
  async getShops ({commit, state}, {offset, limit}) {
    // 对象的结构赋值
    const {longitude, latitude} = state
    const result = await reqShops(longitude, latitude, offset, limit)
    if (result.code === 0) {
      const shops = result.data
      // console.log(shops)
      commit(RECEIVE_SHOPS, {shops, offset})
      return result.hasMoreData
    }
  },
  // 同步记录用户信息
  recordUser ({commit}, userInfo) {
    commit(RECEIVE_USER_INFO, {userInfo})
    sessionStorage.setItem("user_id",JSON.stringify(userInfo._id))
    localStorage.setItem("searchHistory",JSON.stringify(userInfo.searchHistory))
  },
  // 异步获取用户信息
  async getUserInfo ({commit}) {
    const result = await reqUserInfo()
    if (result.code === 0) {
      const userInfo = result.data
      commit(RECEIVE_USER_INFO, {userInfo})
      // 如果获取到用户信息，则将其id存入sessionStorage中,搜索历史存入localStorage
      sessionStorage.setItem("user_id",JSON.stringify(userInfo._id))
      localStorage.setItem("searchHistory",JSON.stringify(userInfo.searchHistory))
    }
  },
  // 同步更新用户搜索历史记录
  updateSearchHistory ({commit}, searchHistory) {
    commit(UPDATE_SEARCH_HISTORY, {searchHistory})
  },
  // 异步登出
  async logout ({commit}) {
    const result = await reqLogout()
    if (result.code === 0) {
     commit(RESET_USER_INFO)
     // 登出时移除保存的user_id和搜索历史
     sessionStorage.removeItem("user_id") 
     localStorage.removeItem("searchHistory")
   }
  },
  // 异步获取商家信息
  async getShopInfo ({commit}) {
    const result = await reqShopInfo()
    if (result.code === 0) {
      const info = result.data
      commit(RECEIVE_INFO, {info})
    }
  },

  // 异步获取商家评价列表
  async getShopRatings ({commit}, callback) {
    const result = await reqShopRatings()
    if (result.code === 0) {
      const ratings = result.data
      commit(RECEIVE_RATINGS, {ratings})
      // 数据更新了, 通知一下组件
      callback && callback()
    }
  },

  // 异步获取商家商品列表
  async getShopGoods ({commit}, callback) {
    const result = await reqShopGoods()
    if (result.code === 0) {
      const goods = result.data
      commit(RECEIVE_GOODS, {goods})
      // 数据更新了, 通知一下组件
      callback && callback()
    }
  },
  // 同步更新food中的count值
  updateFoodCount ({commit}, {isAdd, food}) {
    if (isAdd) {
      commit(INCREMENT_FOOD_COUNT, {food})
    } else {
      commit(DECREMENT_FOOD_COUNT, {food})
    }
  },

  // 同步清空购物车
  clearCart ({commit}) {
    commit(CLEAR_CART)
  },

  // 异步获取搜索到的商家商品列表
  async searchShops ({commit, state}, {keyword, callback}) {
    const geohash = state.latitude + ',' + state.longitude
    const result = await reqSearchShop(geohash, keyword)
    if (result.code === 0) {
      const searchShops = result.data
      commit(RECEIVE_SEARCH_SHOPS, {searchShops})
      callback && callback()
      // console.log(searchShops)
    }
  },

  // 同步清空搜索结果
  clearSearchShops ({commit}) {
    commit(CLEAR_SEARCH_SHOPS)
  }
}