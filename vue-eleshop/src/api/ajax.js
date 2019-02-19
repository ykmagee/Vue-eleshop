/*
ajax 请求函数模块
*/
import axios from 'axios';
// 保证请求携带cookie信息
// axios.defaults.withCredentials=true;

// 向外暴露一个函数ajax
export default function ajax(url='', data={}, type='GET'){
	// 返回值 Promise对象  (异步返回的数据是response.data）
	return new Promise(function(resolve,reject){
		// 利用axios异步执行ajax请求
		// promise用来保存axios的返回值(promise对象)
    let promise;
    if (type === 'GET') {
      // 准备 url query 参数数据
      let dataStr = ''; // 数据拼接字符串，将data连接到url
      Object.keys(data).forEach((key) => {
        dataStr += key + '=' + data[key] + '&';
      });
      if (dataStr !== '') {
        dataStr = dataStr.substring(0, dataStr.lastIndexOf('&'));
        url = url + '?' + dataStr;
      }
      // 发送 get 请求
      promise = axios.get(url);
    } else {
    	// 发送 post 请求
    	promise = axios.post(url,data);
    }
    promise.then((response) =>{
    	// 成功回调resolve()
    	resolve(response.data);
    })
    	.catch((error) =>{
    		// 失败回调reject()
    		reject(error);
    	})
	})
}