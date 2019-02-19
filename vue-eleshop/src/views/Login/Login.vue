<template>
  <section class="login">
    <div class="login_wrapper">
    	<div class="login_header">
    		<h2 class="logo">ele外卖</h2>
    		<div class="header_title">
    			<span :class="{on: loginMessage}" @click="loginMessage=true">短信登录</span>
    			<span :class="{on: !loginMessage}" @click="loginMessage=false">密码登录</span>
    		</div>
    	</div>
    	<div class="login_content">
    		<form @submit.prevent="login">
    			<!-- 短信登录 -->
    			<div v-show="loginMessage">
    				<section class="login_input">
    					<input type="tel" maxlength="11" placeholder="手机号" v-model="phone">
    					<button :disabled="!rightPhone" :class="{active:rightPhone}" @click.prevent="getCode">{{countDown>0 ? `(${countDown}s)已发送` : '获取验证码'}}</button>
    				</section>
    				<section class="login_input">
    					<input type="tel" maxlength="8" placeholder="验证码" v-model="code">
    				</section>
    				<section class="login_hint">
              温馨提示：新用户短信登录时将自动注册，并表示已同意
              <a href="https://h5.ele.me/service/agreement/#initTitle=%E7%94%A8%E6%88%B7%E6%9C%8D%E5%8A%A1%E5%8D%8F%E8%AE%AE&key=ruleQue18">《用户服务协议》</a>
            </section>
    			</div>
    			<!-- 密码登录 -->
    			<div v-show="!loginMessage">
    				<section class="login_input">
    					<input type="text" maxlength="11" placeholder="用户名/已验证手机" v-model="name" @input="checkUsername">
    					<!-- <p class="tips" :class="{none:!hasUsername}" v-if="name">*请注意：{{nameTips}}</p> -->
    					<!-- 实时提示当前输入用户名是否存在 -->
    					<div v-if="name&&checkResults[checkIndex-1]">
    						<p class="tips" :class="{none:checkResults[checkIndex-1].code!==0}">*请注意：{{ checkResults[checkIndex-1].msg }}</p>
    					</div>    					
    				</section>
    				<section class="login_input">
    					<input type="text" maxlength="16" placeholder="密码" v-model="pwd" v-if="showPwd">
    					<input type="password" maxlength="16" placeholder="密码" v-model="pwd" v-else>
    					<!-- 是否显示密码的按钮 -->
    					<div class="switch_button" :class="{on: showPwd}" @click="showPwd=!showPwd">
    						<div class="switch_circle"></div>
    						<span class="switch_text">{{showPwd ? 'abc' : '***'}}</span>
    					</div>
    				</section>
    				<section class="login_input">
          		<input type="text" maxlength="4" placeholder="验证码" v-model="captcha">
              <img class="captcha" :src="BASE_URL+'/captcha'" alt="captcha" @click="getCaptcha" ref="captcha">
              <!-- <img class="captcha" src="45.40.204.81:443/captcha" alt="captcha" @click="getCaptcha" ref="captcha"> -->
            </section>
            <section class="login_hint">
              温馨提示：新用户密码登录时将使用当前用户名自动注册，并表示已同意
              <a href="https://h5.ele.me/service/agreement/#initTitle=%E7%94%A8%E6%88%B7%E6%9C%8D%E5%8A%A1%E5%8D%8F%E8%AE%AE&key=ruleQue18">《用户服务协议》</a>
            </section>
    			</div>
					<button class="login_submit">登录</button>
    		</form>
    		<!-- <a href="javascript:;" class="about_us">关于我们</a> -->
    	</div>
    	<!--返回上一级路由 -->
      <a href="javascript:;" class="go_back" @click="$router.back()">
        <i class="iconfont icon-left-1"></i>
      </a>
    </div>
  </section>
</template>

<script>
	// import Vue from 'vue';
	import { MessageBox } from 'mint-ui';
	import { reqPwdLogin, reqCheckUsername } from '../../api';
	// import {reqSendCode, reqSmsLogin, reqPwdLogin} from '../../api'

	export default {
		data(){
			return{
				BASE_URL: process.env.NODE_ENV == 'development' ? 'http://localhost:443':'http://ykit.xyz:443', //区分开发和生产环境下url
				loginMessage: false, // true为短信登陆, false为密码登录
				phone: '', // 输入的手机号
				code: '', // 短信验证码
				name: '', // 用户名
				pwd: '', // 密码
				showPwd: false, // 是否显示密码
				captcha: '', // 图形验证码
				countDown: 0, // 倒计时
				// nameTips: '', // 用户名下方的提示
				// hasUsername: false, // 当前用户名已存在
				checkResults: [], // 存放每次检查用户名的结果
				checkIndex: 0 // 检查用户名计数
			}
		},
	  components:{
	  		  	
	  },
	  mounted(){

	  },
	  // 导航守卫
	  beforeRouteEnter(to,from,next){	  	
	  	next(vm => {
	  		// 导航进入该组件的对应路由之前更新图片验证码
	  		vm.getCaptcha();
	  	});
	  },
	  computed:{
		  rightPhone () {
	      // 利用正则对手机号进行匹配，返回布尔值
	      return /^1\d{10}$/.test(this.phone)
	    }	   
	  },
	  methods:{
	  	// 获取一个新的图片验证码
	    getCaptcha () {
	      // 每次指定的src要不一样
	      // this.$refs.captcha.src = 'http://localhost:4000/captcha?time=' + Date.now()
	      this.$refs.captcha.src = this.BASE_URL + '/captcha?time=' + Date.now();
	    },
	    // 异步获取短信验证码
	    async getCode () {
	    	// let { countDown } = this;
	    	this.showAlert('验证码功能暂未开通');
	      // if (!countDown) {
	      //   // 启动倒计时
	      //   countDown = 30;
	      //   this.intervalId = setInterval(() => {
	      //     countDown--;
	      //     if (countDown <= 0) {
	      //       // 停止计时
	      //       clearInterval(this.intervalId);
	      //     }
	      //   }, 1000);
	      // }
	      // // 发送ajax请求（向指定手机号发送验证码短信）
	      // const result = await reqSendCode(this.phone)
	      // if (result.code === 1) { // 手机号验证失败
	      //   // 显示提示
	      //   this.showAlert(result.msg);
	      //   // 停止计时
	      //   if (countDown) {
	      //     countDown = 0;
	      //     clearInterval(this.intervalId);
	      //     this.intervalId = undefined;
	      //   }
	      // }
	    },
	    // 异步检查用户名是否存在
	    async checkUsername () {
	    	this.checkIndex++;
	    	// 传入一个index值，以便能找到最后一次异步请求的结果
	    	let result = await reqCheckUsername(this.name, this.checkIndex);
	    	// 数组直接赋值不能响应式更新，需使用Vue.set()
	    	this.$set(this.checkResults,result.index-1,result);
	    	// this.checkResults[result.index-1] = result;
    		// this.nameTips = result.msg;
    		// this.hasUsername = result.code===0 ? true : false;		    	    	
	    },
	    // 异步登录
	    async login () {
	      let result;
	      // 前台表单验证
	      if (this.loginMessage) { // 短信登陆
	        const {phone, code} = this;
	        if (!this.rightPhone) {
	          // 手机号不正确
	          this.showAlert('请输入正确的手机号码');
	          return;
	        } else if (!/^\d{6}$/.test(code)) {
	        	if (code.length === 0) {
	        		this.showAlert('请输入验证码');
	          	return;
	        	}
	          // 验证必须是6位数字
	          this.showAlert('验证码必须是6位数字');
	          return;
	        }
	        result = {
	        	msg: '验证码功能暂未开通'
	        }
	        // 发送ajax请求短信登陆
	        // result = await reqSmsLogin(phone, code)
	      } else { // 密码登陆
	        const {name, pwd, captcha} = this;
	        if (!this.name) {
	          // 用户名必须指定
	          this.showAlert('请输入用户名');
	          return;
	        } else if (!this.pwd) {
	          // 密码必须指定
	          this.showAlert('请输入密码');
	          return;
	        } else if (!this.captcha) {
	          // 验证码必须指定
	          this.showAlert('请输入验证码');
	          return;
	        }
	        // 发送ajax请求密码登陆
	        result = await reqPwdLogin({name, pwd, captcha})
	      }

	      // 停止计时
	      if (this.computeTime) {
	        this.computeTime = 0;
	        clearInterval(this.intervalId);
	        this.intervalId = undefined;
	      }

	      // 根据结果数据处理
	      if (result.code === 0) {
	        const user = result.data;
	        // 将user保存到vuex的state
	        this.$store.dispatch('recordUser', user);
	        // 去个人中心界面
	        this.$router.replace('/personal');
	        // 显示新的图片验证码
	        this.getCaptcha();
	      } else {
	        // 显示新的图片验证码
	        this.getCaptcha();
	        // 显示警告提示
	        const msg = result.msg;
	        this.showAlert(msg);
	      }
	    },
	    showAlert (alertText) {
	    	MessageBox.alert(alertText,'非常抱歉！');
	    }
	  },
	  watch:{

	  }
	}
</script>

<style lang="scss">
	.login{
		width: 100%;
		height: 100%;
		background-color: #fff;
		padding-top: 0.6rem;
		.login_wrapper{
			width: 80%;
			margin: 0 auto;
			.login_header{
				text-align: center;
				.logo{
					font-size: 0.4rem;
					font-weight: 700;
					color: $baseColor;
					margin-bottom: 0.3rem;
				}
				.header_title span{
					font-size: 0.14rem;
					color: #333;
					// color: #2395ff;
					padding-bottom: 0.04rem;
					display: inline-block;
					cursor: pointer;
					// background-color: #eee;
					&:first-child{
						margin-right: 10vw;
					}
					&.on{
						color: $baseColor;
						font-weight: 700;
						border-bottom: 0.02rem solid $baseColor;
					}
				}
			}
			.login_content{
				margin-top: 0.16rem;
				.login_input{
					position: relative;
					margin-bottom: 0.24rem;
					height: 0.48rem;
					font-size: 0.14rem;
					background-color: #fff;
					input{
						width: 100%;
						height: 100%;
						padding-left: 0.1rem;
						border: 1px solid #ddd;
						border-radius: 0.04rem;
						color: #333;
						&:focus{
							border: 1px solid $baseColor;
						}
					}
					.tips{
						position: absolute;
						left: 0.1rem;
						bottom: -0.05rem;
						font-size: 0.12rem;
						color: $baseColor;
						transform: translateY(100%) scale(0.9);
						transform-origin: 0 0%;
						&.none{color: #ff69b4;}
					}
					button{
						position: absolute;
						top: 50%;
						right: 0.1rem;
						transform: translateY(-50%);
						color: #ccc;
						background-color: transparent;
						border: none;
						&.active{color: $baseColor;}
					}
					.switch_button{
						position: absolute;
						top: 50%;
						right: 0.1rem;
						transform: translateY(-50%);
						width: 0.44rem;
						height: 0.18rem;
						border: 1px solid #ddd;
						border-radius: 0.09rem;
						background-color: #fff;
						transition: all 0.3s;
						display: flex;
						align-items: center;
						&.on{
							background-color: $baseColor;
							.switch_circle{transform: translateX(0.26rem);}
							.switch_text{text-align: left;color:#eee;}
						}
						.switch_circle{
							position: absolute;
							top: -1px;
							left: -1px;
							width: 0.18rem;
							height: 0.18rem;
							border-radius: 50%;	
							border: 1px solid #ddd;
							background-color: #fff;
							box-shadow: 0 2px 4px 0 rgba(0,0,0,0.1);
							transition: transform 0.3s;
						}
						.switch_text{
							// display: inline-block;
							width: 100%;
							// height: 100%;
							font-size: 0.12rem;
							text-align: right;
							// line-height: calc(0.18rem - 2px);
							padding: 0 0.05rem;
							color: #666;
						}
					}
					.captcha{
						position: absolute;
						top: 50%;
						right: 0;
						transform: translateY(-50%);
						height: 100%;
					}
				}
				.login_hint{
					font-size: 0.14rem;
					color: #999;
					line-height: 0.2rem;
					a{color: $baseColor;}
				}
				.login_submit{
					display: block;
					width: 100%;
					height: 0.42rem;
					margin-top: 0.2rem;
					background-color: #4cd96f;
					border-radius: 0.04rem;
					font-size: 0.16rem;
					color: #fff;
					text-align: center;
					line-height: 0.42rem;
					cursor: pointer;
				}
				.about_us{
					margin-top: 0.2rem;
					text-align: center;
					color: #999;
					display: block;
				}
			}				
			.go_back{
				position: absolute;
				top: 0.05rem;
				left: 0.05rem;
				width: 0.4rem;
				height: 0.4rem;
				text-align: center;
				.iconfont{
					font-size: 0.2rem;
					color: $baseColor;
					line-height: 0.4rem;
				}
			}
		}
	}
</style>
