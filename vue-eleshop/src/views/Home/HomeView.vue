<template>
  <section class="home">
  	<!-- 首页主页面 -->
  	<div :class="{unscrollable: showAddress||showCity}">
	  	<!-- 首页固定头部 -->
	  	<div class="header_wrapper">
	  	<!-- <HeaderTop :title="deliveryAddress" :to_home="false"> -->
	  		<router-link class="header_search" slot="left" to="/search">
	  			<i class="iconfont icon-search"></i>
	  		</router-link>
	  		<div class="header_title" @click="showAddress=true">
		  		<span class="header_title_text ellipsis">{{ currentAddress }}</span>
		  		<i class="icon"></i>
		  	</div>
	  		<!-- 如果已有用户信息即为已登录状态，跳转至个人页面；否则跳转至登录页面 -->
	  		<router-link class="header_login" slot="right" :to="userInfo._id ? '/personal': '/login'">
	  			<span class="header_login_text" v-if="!userInfo._id">登录|注册</span>
	  			<span class="header_login_text" v-else>
	  				<i class="iconfont icon-user"></i>
	  			</span>  			
	  		</router-link>
	  	<!-- </HeaderTop> -->
	  	</div>

	  	<!--首页导航轮播图组件-->
	  	<HomeNav></HomeNav>

	  	<!--首页附近商家列表-->
			<div class="home_shop_list" v-infinite-scroll="loadMore" infinite-scroll-disabled="loading" infinite-scroll-distance="-50">
				<div class="shop_header">
					<i class="iconfont icon-shop"></i>
	        <span class="shop_header_title">附近商家</span>
				</div>
				<!--商家列表组件-->
	  		<ShopList :shops="shops" :presetImg="true"></ShopList>
	  		
			</div>
			<!-- 滚动加载更多 -->
	  	<LoadMore :hasMoreData="hasMoreData"></LoadMore>
	  </div>
		<!-- 地址页面组件 -->
	  <transition name="slide">
	  	<Address v-if="showAddress"></Address>
		</transition>	
		<!-- 城市选择页面组件 -->
		<City v-if="showCity"></City>
  </section>
</template>

<script>
	import Vue from 'vue';
	import {InfiniteScroll} from 'mint-ui';
	Vue.use(InfiniteScroll);
	import {mapState} from 'vuex';
	// import HeaderTop from '../../components/HeaderTop/HeaderTop.vue';
	import HomeNav from './HomeNav/HomeNav.vue';
	import Address from './Address/Address.vue';
	import City from './City/City.vue';
	import ShopList from '../../components/ShopList/ShopList.vue';
	import LoadMore from '../../components/LoadMore/LoadMore.vue';

	export default {
	  data(){
	  	return {
	  		// deliveryAddress:"武汉市洪山区名族大道锦绣龙城F区",
	  		// city: '武汉', //当前城市
	  		showAddress: false, // 是否显示地址页面
	  		showCity: false, // 是否显示城市选择页面
	  		loading: false, // 是否取消无限滚动，若为true则不会加载新数据
      	hasMoreData: true, // 数据库是否还有更多数据(shops)
      	offset: 0, // 获取数据时的偏移量，跳过已经得到过的数据
      	limit: 8 // 每次获取数据的个数
	  	}
	  },
	  components:{
	  	// HeaderTop,
	  	HomeNav,
	  	ShopList,
	  	LoadMore,
	  	Address,
	  	City
	  },
	  computed:{
			...mapState(['shops','userInfo','currentAddress'])
		},
	  mounted () { 
	  	this.loadMore();
	  	//在页面加载时读取sessionStorage里的location信息
	  	const location = JSON.parse(sessionStorage.getItem("location"));
      if (location) {
      	this.$store.dispatch('recordCurrentAddress',{
	  			latitude: location.latitude, 
	  			longitude: location.longitude,
	  			address: location.address
	  		});
      } 
	  },
	  methods:{
	  	// 滚动加载更多数据
	    loadMore () {
	    	// 改变loading值，表明正在加载，避免多次加载(本次加载完才打开)	    	
	    	this.loading = true;
      	this.$store.dispatch('getShops',{offset:this.offset,limit:this.limit})
		    	.then(res=>{
		    		// res在action中设置的为后台返回的hasMoreData，表明是否还有更多数据
		    		// 若还有数据，就打开开关可以继续加载(loading=false)
		    		if (res) {
		    			this.offset += this.limit;
		    			this.loading = false;
		    		}else{
		    			this.hasMoreData = false;
		    		}
		    		// console.log(res,this.loading)
		    	})        	      	
	    }	  
	  }
	}
</script>

<style lang="scss">
  .home{	
  	// 避免切换到地址页面后滚动首页
  	&>div.unscrollable{
  		height: calc(100vh - 0.5rem);
  		overflow: hidden;
  	}
  	.address{
  		// 过渡效果
			&.slide-enter-active, &.slide-leave-active{
	      transition: left 0.25s;
			}
	    &.slide-enter, &.slide-leave-to{
	      left: 100%;
	    }  	
  	}
  	.header_wrapper{
			position: fixed;
			left: 0;
			top: 0;
			z-index: 300;
			width: 100%;
			height: 0.45rem;
			color: #fff;
			background-color: $baseColor;  // 基色
			.header_title{
				position: absolute;
				top: 50%;
				left: 50%;
				transform: translate(-50%,-50%);			
				width: 50%;
				text-align: center;
				.header_title_text{
					font-size: 0.17rem;
					display: block;
					position: relative;
					padding-right: 0.08rem;					
				}
				.icon::after{
					content:"";
					display: inline-block;
					border-style: solid;
					border-width: 0.04rem;
					border-color: #fff transparent transparent;
					position: absolute;
					right: 0;
					top: 50%;
					transform: translateY(-25%);
				}
			}
		}	
		.header_search{	
			position: relative;		
			display: inline-block;
			width: 12%;
			height: 100%;
			text-align: center;
			.iconfont{
				position: absolute;
				left: 50%;
				top: 50%;
				transform: translate(-50%,-50%);
				font-size: 0.24rem;
				color: #fff;
			}
		}
		.header_login{
			position: absolute;
			right: 0.15rem;
			top: 0;
			height: 100%;
			color: #fff;
			font-size: 0.14rem;
			display: flex;
			align-items: center;
			.icon-user{
				font-size: 0.22rem;
			}
		}
		.home_shop_list{
			position: relative;
			margin-top: 0.1rem;
			background-color: #fff;
			font-size: 0.14rem;
			.shop_header{
				padding: 0.1rem;
				.iconfont{
					font-size: 0.16rem;
				}
				.shop_header_title{
					color: #111;
				}
			}
		}
  }  
</style>
