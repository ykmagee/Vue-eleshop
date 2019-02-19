// 定义全局函数
exports.install = function (Vue, options) {
	// 获取屏幕可视区域的宽高
	Vue.prototype.client = function (){
 		if(window.innerHeight !== undefined){
      return {
        "width": window.innerWidth,
        "height": window.innerHeight
      }
    }else if(document.compatMode === "CSS1Compat"){
      return {
        "width": document.documentElement.clientWidth,
        "height": document.documentElement.clientHeight
      }
    }else{
      return {
        "width": document.body.clientWidth,
        "height": document.body.clientHeight
    	}
    }
	}
	// 缓动动画封装
	Vue.prototype.animate = function (ele,json,fn){		
		//先清定时器
		clearInterval(ele.timer);
		ele.timer=setInterval(function(){
			//开闭原则
			var bool=true;
			//遍历属性和值，分别单独处理json
      //attr == k(键)    target == json[k](值)
			for(var k in json){	
				// 当k为css属性时，如width,height等 
				if (ele.style[k]!=undefined) {
					var leader=parseInt(getStyle(ele,k))||0;
					// 设置步长
					var step=(json[k]-leader)/10;
					// 步长取整
					step=step>0?Math.ceil(step):Math.floor(step);
					leader=leader+step;
					ele.style[k]=leader+"px";
				} else if (ele[k]!=undefined) {
					// 当k为js属性时，如scrollTop,scrollLeft等 
					var leader=ele[k]||0;
					var step=(json[k]-leader)/10;
					step=step>0?Math.ceil(step):Math.floor(step);
					leader=leader+step;
					ele[k]=leader;
					// console.log(step);
				}						
				//判断: 目标值和当前值的差大于步长，就不能跳出循环
        //不考虑小数的情况：目标位置和当前位置不相等，就不能清除清除定时器。
				if (json[k]!==leader) {
					bool=false;
				}
			}
			// console.log(1);
			//只有所有的属性都到了指定位置，bool值才不会变成false；
			if (bool) {
				clearInterval(ele.timer);
				//所有程序执行完毕了，现在可以执行回调函数了
        //只有传递了回调函数，才能执行
				fn && fn.call(obj);
			}
		},1);
		// 获取元素样式兼容写法
		function getStyle(ele,attr){
	    if(window.getComputedStyle){
      	return window.getComputedStyle(ele,null)[attr];
	    }
	    return ele.currentStyle[attr];
		}
	}
}