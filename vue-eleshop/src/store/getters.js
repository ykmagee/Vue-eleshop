/*
getters类似计算属性，其返回值会根据它的依赖被缓存起来，只有它的依赖值改变时才会被重新计算
 */
export default {
	// 购物车中商品总数
	totalCount (state) {
		// reduce() 方法接收一个函数作为累加器，数组中的每个值（从左到右）开始缩减，最终计算为一个值。
		// array.reduce(function(total, currentValue, currentIndex, arr), initialValue)
    return state.cartFoods.reduce((total, food) => total + food.count, 0)
  },
  // 购物车中商品折后总价
  totalPrice (state) {
    return state.cartFoods.reduce((total, food) => total + food.count * food.price, 0)
  },
  // 购物车中商品折前总价(原价)
  totalOldPrice (state) {
  	let hasOldPrice=false;
  	state.cartFoods.forEach((food)=>{
  		// 购物车中有一件以上商品有oldPrice，该方法才会返回值
  		if (food.oldPrice) {
  			hasOldPrice=true;
  		}
  	});
  	if (hasOldPrice) {
  		return state.cartFoods.reduce((total, food) => total + food.count * (food.oldPrice?food.oldPrice:food.price), 0)
  	} else {
  		return false
  	}    
  },
  // 评论中客户满意的数量
  positiveSize (state) {
    return state.ratings.reduce((total, rating) => total + (rating.rateType === 0 ? 1 : 0), 0)
  },
  // 评论中带图片的数量
  picturesSize (state) {
    return state.ratings.reduce((total, rating) => total + (rating.pictures.length > 0 ? 1 : 0), 0)
  }
}