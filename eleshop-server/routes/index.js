var express = require('express');
var router = express.Router();
const md5 = require('blueimp-md5')
const models = require('../db/models')
const UserModel = models.getModel('user')
const _filter = {'pwd': 0, '__v': 0} // 查询时过滤掉
const sms_util = require('../util/sms_util')
const users = {}
const ajax = require('../api/ajax')
// const axios = require('axios')
var svgCaptcha = require('svg-captcha')
// const UUID = require('uuid')

/*
密码登陆
 */
router.post('/login_pwd', function (req, res) {
  const name = req.body.name
  const pwd = md5(req.body.pwd)
  const captcha = req.body.captcha.toLowerCase()
  console.log('/login_pwd', name, pwd, captcha, req.session, req.sessionID)

  // 可以对用户名/密码格式进行检查, 如果非法, 返回提示信息
  if(captcha!==req.session.captcha) {
    return res.send({code: 1, msg: '验证码不正确'})
  }
  // 删除保存的验证码
  delete req.session.captcha

  UserModel.findOne({name}, function (err, user) {
    if (user) {
      console.log('findUser', user)
      if (user.pwd !== pwd) {
        res.send({code: 1, msg: '用户名或密码不正确!'})
      } else {   
        console.log('登录成功', user.name)     
        req.session.userid = user._id
        // 返回user信息时过滤掉密码(pwd)和版本号(__v)
        let userFilter = JSON.parse(JSON.stringify(user, (key,value)=>{
          if((key=='pwd')||(key=='__v')){
            return undefined;
          }else{
            return value;
          }
        }))       
        res.send({code: 0, data: userFilter})
        // res.send({code: 0, data: {_id: user._id, name: user.name, phone: user.phone}})
      }
    } else {
      const userModel = new UserModel({name, pwd})
      userModel.save(function (err, user) {
        // 向浏览器端返回cookie(key=value)
        // res.cookie('userid', user._id, {maxAge: 1000*60*60*24*7})
        // user._id = UUID.v1()
        req.session.userid = user._id
        const data = {_id: user._id, name: user.name}
        // 3.2. 返回数据(新的user)
        res.send({code: 0, data})
      })
    }
  })
})

/*
检查用户名是否存在
 */
router.get('/check_username', function (req, res) {
  const name = req.query.name
  const _index = req.query.index
  UserModel.findOne({name}, function (err, user) {
    if (user) {
      console.log('username exists', user)
      res.send({code: 0, index: _index, msg: '当前用户名存在，可输入密码登录'})      
    } else {
      res.send({code: 1, index: _index, msg: '当前用户名还不存在哦，可以进行注册'})
    }
  })
})

/*
更新用户搜索历史记录
 */
router.post('/update_history', function (req, res) {
  const id = req.body.id
  const searchHistory = req.body.searchHistory
  UserModel.findByIdAndUpdate(id, {'searchHistory': searchHistory}, function (err, user) {
    if (err) {
      console.log('更新失败：'+ err)
      res.send({msg: '搜索历史更新失败'})
    } else {
      console.log('更新成功：'+ user)
      res.send({msg: '搜索历史更新成功'})
    }
  })
})

/*
一次性图形验证码
 */
router.get('/captcha', function (req, res) {
  var captcha = svgCaptcha.create({
    ignoreChars: '0o1l',
    noise: 2,
    color: true
  });
  req.session.captcha = captcha.text.toLowerCase();
  console.log(req.session, req.sessionID, req.session.captcha)
  /*res.type('svg');
  res.status(200).send(captcha.data);*/
  res.type('svg');
  res.send(captcha.data)
});

/*
发送验证码短信
*/
router.get('/sendcode', function (req, res, next) {
  //1. 获取请求参数数据
  var phone = req.query.phone;
  //2. 处理数据
  //生成验证码(6位随机数)
  var code = sms_util.randomCode(6);
  //发送给指定的手机号
  console.log(`向${phone}发送验证码短信: ${code}`);
  sms_util.sendCode(phone, code, function (success) {//success表示是否成功
    if (success) {
      users[phone] = code
      console.log('保存验证码: ', phone, code)
      res.send({"code": 0})
    } else {
      //3. 返回响应数据
      res.send({"code": 1, msg: '短信验证码发送失败'})
    }
  })
})

/*
短信登陆
*/
router.post('/login_sms', function (req, res, next) {
  var phone = req.body.phone;
  var code = req.body.code;
  console.log('/login_sms', phone, code);
  if (users[phone] != code) {
    res.send({code: 1, msg: '手机号或验证码不正确'});
    return;
  }
  //删除保存的code
  delete users[phone];


  UserModel.findOne({phone}, function (err, user) {
    if (user) {
      req.session.userid = user._id
      res.send({code: 0, data: user})
    } else {
      //存储数据
      const userModel = new UserModel({phone})
      userModel.save(function (err, user) {
        req.session.userid = user._id
        res.send({code: 0, data: user})
      })
    }
  })

})

/*
根据sesion中的userid, 查询对应的user
 */
router.get('/userinfo', function (req, res) {
  // 取出userid
  const userid = req.session.userid
  // 查询
  UserModel.findOne({_id: userid}, _filter, function (err, user) {
    // 如果没有, 返回错误提示
    if (!user) {
      // 清除浏览器保存的userid的cookie
      delete req.session.userid

      res.send({code: 1, msg: '请先登陆'})
    } else {
      // 如果有, 返回user
      res.send({code: 0, data: user})
    }
  })
})

// 退出登录
router.get('/logout', function (req, res) {
  // 清除浏览器保存的userid的cookie
  delete req.session.userid
  // 返回数据
  res.send({code: 0})
})

/*
根据城市名和输入的地址搜索详细地址(百度地图api)
 */
router.get('/search_address', function (req, res) {
  const {city,address} = req.query
  // 需对url地址进行编码，否则会报错
  const url = encodeURI('http://api.map.baidu.com/place/v2/search?query='+address+'&region='+city+'&output=json&ak=khZ8qblz2Ys5PiTYYCjOsi5UlbPVSggk')
  // axios.get(url,{
  //   headers: {
  //     referer: 'http://api.map.baidu.com',
  //     host: 'api.map.baidu.com'
  //   }
  // })
  ajax(url)
    .then(data => {
      console.log(city,address,data)
      res.send({code: 0, data: data.results})
    })
})

/*
根据经纬度获取位置详情
 */
router.get('/position/:geohash', function (req, res) {
  const {geohash} = req.params
  ajax(`http://cangdu.org:8001/v2/pois/${geohash}`)
    .then(data => {
      res.send({code: 0, data})
    })
})

/*
获取首页分类列表
 */
router.get('/index_category', function (req, res) {
  setTimeout(function () {
    const data = require('../data/index_category.json')
    res.send({code: 0, data})
  }, 300)
})

/*
首页根据经纬度获取商铺列表
?latitude=40.10038&longitude=116.36867
 */
router.get('/shops', function (req, res) {
  const latitude = req.query.latitude
  const longitude = req.query.longitude
  const offset = parseInt(req.query.offset)
  const limit = parseInt(req.query.limit)
  const totalData = require('../data/shops.json')
  let data = []
  let hasMoreData = true
  if (totalData.length-offset-limit <= 0) {
    hasMoreData = false
    data = totalData.slice(offset)
  } else {
    data = totalData.slice(offset,limit+offset)
  }
  setTimeout(function () {    
    res.send({code: 0, hasMoreData, data})
  }, 500)
  // console.log(offset,limit,totalData.length-offset-limit)
})

/* 根据关键字搜索商铺，返回符合项 */
router.get('/search_shops', function (req, res) {
  const {geohash, keyword} = req.query
  const allShops = require('../data/shops.json')
  let data = []
  // 单个字符匹配方法
  function singleMatch(string='', arr=[]){
    let isMatch=false
    arr.forEach(function(item){
      if (item.indexOf(string) != -1) {
        isMatch=true
      }      
    })
    return isMatch
  }
  // 定义一个匹配方法match，根据关键字string，在数组arr中进行查找是否包含，有则返回true
  function match(string='', arr=[]){
    let isMatch=false
    arr.forEach(function(item){
      if ((item.indexOf(string) != -1)||(item.indexOf(string.replace(/\s*/g,'')) != -1)) {
        isMatch=true
      }
    })
    let singleIsMatch=true
    // 将关键字string分割成单个的字符数组
    let stringArr=string.replace(/\s*/g,'').split('')
    // console.log(string+'&'+stringArr)
    // 源数组arr包含字符数组stringArr中的每个元素，才让singIsMatch为true
    stringArr.forEach(function(singleStr){
      if (!singleMatch(singleStr,arr)) {
        singleIsMatch=false
      }
    })
    // console.log(isMatch+'&'+singleIsMatch)
    return isMatch||singleIsMatch
  }
  allShops.forEach(function(shop){
    const wordArr=[shop.name.toLowerCase(),shop.category.toLowerCase()]
    if (match(keyword.toLowerCase(),wordArr)) {
      data.push(shop)
    }
  })
  setTimeout(function () {
    res.send({code: 0, data})
  }, 300)

  // ajax('http://cangdu.org:8001/v4/restaurants', {
  //   'extras[]': 'restaurant_activity',
  //   geohash,
  //   keyword,
  //   type: 'search'
  // }).then(data => {
  //   res.send({code: 0, data})
  // })
})

module.exports = router;