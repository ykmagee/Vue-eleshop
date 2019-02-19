export default function(){	
	//初始化
	setRem();
	//改变窗口大小重新设置rem
	window.onresize=function(){
		setRem();
	}	
	function setRem(){
		// var deviceWidth=document.documentElement.clientWidth;
		var deviceWidth=client().width;
		if (deviceWidth>=750) {
			deviceWidth=750;
		}else if (deviceWidth<=320) {
			deviceWidth=320;
		}
		document.documentElement.style.fontSize=deviceWidth/375*100+'px';
	}
	function client(){
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
}