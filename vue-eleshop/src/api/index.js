/*
与后台交互模块 （依赖已封装的ajax函数）
*/
import ajax from './ajax.js';

// const BASE_URL = 'http://localhost:4000';
const BASE_URL = '/api';
// 项目部署时使用nginx反向代理，故此处无须分环境来设置BASE_URL
// console.log(process.env.NODE_ENV)
// const BASE_URL = process.env.NODE_ENV == 'development' ? '/api':'http://45.40.204.81:443';

/**
 * 获取地址信息(根据经纬度串)
 * 这个接口的经纬度参数是在url路径里的，没有query参数
 */
export const reqAddress = (geohash) => ajax(`${BASE_URL}/position/${geohash}`);

//获取 home 页面食品分类列表
export const reqCategorys = () => ajax(BASE_URL + '/index_category');

//根据城市名和输入的地址搜索详细地址
export const reqSearchAddress = (city, address) => ajax(BASE_URL + '/search_address', {city, address});

/**
 * 获取 home 商铺列表(根据query参数：经纬度)
 * 将经纬度两个数据作为一个参数对象传入
 * 也可以两个数据分别传入ajax， 然后再放入一个对象参数内， 如下面的手机号接口
 */
export const reqShops = (latitude, longitude, offset, limit) => ajax(BASE_URL + '/shops', {latitude, longitude, offset, limit});

//根据经纬度和关键字搜索商铺列表
export const reqSearchShop = (geohash, keyword) => ajax(BASE_URL + '/search_shops', {geohash, keyword});

//更新用户搜索历史记录
export const reqUpdateHistory = (id, searchHistory) => ajax(BASE_URL + '/update_history', {id, searchHistory}, 'POST');

//账号密码登录
export const reqPwdLogin = ({name, pwd, captcha}) => ajax(BASE_URL + '/login_pwd', {name, pwd, captcha}, 'POST');

//检查用户名是否存在
export const reqCheckUsername = (name, index) => ajax(BASE_URL + '/check_username', {name, index});

//获取短信验证码
export const reqSendCode = phone => ajax(BASE_URL + '/sendcode', {phone});

//手机号验证码登录 
export const reqSmsLogin = (phone, code) => ajax(BASE_URL + '/login_sms', {phone, code}, 'POST');

//获取用户信息(根据会话)
export const reqUserInfo = () => ajax(BASE_URL + '/userinfo');

//请求登出
export const reqLogout = () => ajax(BASE_URL + '/logout');

//获取商家信息(下列请求由mock拦截并返回 不需要代理)
export const reqShopInfo = () => ajax('/info');

//获取商家评价数组
export const reqShopRatings = () => ajax('/ratings');

//获取商家商品数组
export const reqShopGoods = () => ajax('/goods');