//state用于存储数据
export default {
	latitude: 30.47017, // 纬度
  longitude: 114.391023, // 经度
  currentCity: '武汉', // 当前城市
  currentAddress: '武汉市洪山区名族大道锦绣龙城F区', // 当前收货地址
  address: {}, // 地址相关信息对象
  categorys: [], // 首页食品分类数组
  shops: [], // 首页商家数组
  userInfo: {}, // 用户信息
  goods: [], // 商家商品列表
  ratings: [], // 商家评价列表
  info: {}, // 商家信息
  cartFoods: [], // 购物车中食物的列表
  searchShops: [] // 搜索得到的商家列表
}