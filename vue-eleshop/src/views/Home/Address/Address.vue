<template>
  <div class="address">
  	<!-- 头部组件 -->
  	<HeaderTop title="选择收货地址" :to_home="false">
  		<a class="to_home" slot="left" @click="back">
  			<i class="iconfont icon-left"></i>
  		</a>  		
  	</HeaderTop>
  	<form class="address_search" @submit.prevent="searchAddress()">
  		<div class="city ellipsis" @click="showCity()">{{currentCity}}</div>
  		<div class="search_input">
  			<i class="iconfont icon-search"></i>
      	<input type="search" placeholder="请输入地址" id="suggestId" v-model="address">
      	<input type="submit" class="search_submit" value="搜索">
  		</div>
  	</form>
  	<section class="search_results" v-if="searchResults.length">
  		<div class="address_details" v-for="(item,index) in searchResults" :key="index" @click="confirmAddress(item)">	<p class="name">{{ item.name }}</p>
  			<p class="details">{{ item.address }}</p>
  		</div>
  		<p class="tips">没有更多了哦~</p>
  	</section>
  </div>
</template>

<script>
	import { mapState } from 'vuex';
	import HeaderTop from '../../../components/HeaderTop/HeaderTop.vue';
	import { reqSearchAddress } from '../../../api';
	export default {
		data(){
			return {
				// city: '武汉', // 城市
				address: '', // 输入的地址
				searchResults: [] // 搜索得到的详情地址数组
			}
		},		
	  components:{
	  	HeaderTop	  	
	  },
	  mounted(){			
			//在页面加载时读取sessionStorage里的currentCity
      if (sessionStorage.getItem("currentCity")) {
      	this.$store.dispatch('recordCurrentCity',sessionStorage.getItem("currentCity"));
      }      
	  },
	  computed:{
	    ...mapState(['currentCity'])
	  },
	  watch: {	    
	    address (value) {
	    	// 搜索关键词为空时清空搜索结果
	    	if (!value) {
	    		this.searchResults = [];
	    	}
	    }
	  },
	  methods:{
	  	back(){
	  		this.$parent.showAddress=false;
	  	},
	  	// 异步搜索地址
	  	async searchAddress(){
	  		if (this.address) {
	  			// 注意 直接调用百度地图api会因同源策略而报错，改用自己的后台去调接口
	  			let result = await reqSearchAddress(this.currentCity, this.address);
	  			// console.log(result);
	  			if (result.code===0) {
	  				this.searchResults=result.data;
	  			}	  			
	  		}
	  	},	
	  	// 点击确认搜索结果中的某项地址
	  	confirmAddress(item){
	  		this.address=item.name;
	  		// 关闭当前页面回到主页面，并将收货地址更新为点击的地址
	  		this.$parent.deliveryAddress=item.name;
	  		this.$parent.showAddress=false;
	  		// 同步更新state中的经纬度值和地址名称
	  		this.$store.dispatch('recordCurrentAddress',{
	  			latitude: item.location.lat, 
	  			longitude: item.location.lng,
	  			address: item.name
	  		});
	  		// console.log(this.$store.state.latitude,this.$store.state.longitude);
	  		// 将offset重置为0，并根据当前经纬度重新获取商铺信息
	  		this.$parent.offset=0;
	  		this.$parent.loadMore();
	  	},
	  	// 显示选择城市页面
	  	showCity(){
	  		// this.$parent.showAddress=false;
	  		this.$parent.showCity=true;
	  	}
	  }
	}
</script>

<style lang="scss">
	.address{
		position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    z-index: 1000;
    overflow: auto;
    background-color: #f4f4f4;
    padding-top: 0.45rem;
    .header{
    	// position: relative;
    }
    .address_search{
    	// margin-top: 0.45rem;
    	display: flex;
    	background-color: #fff;
    	height: 0.55rem;
    	.city{
    		width: 0.65rem;
    		height: 0.55rem;
    		padding: 0 0.15rem 0 0.15rem;
    		line-height: 0.55rem;
    		font-size: 0.12rem;
    		text-align: center;
    		position: relative;
    		&::after{
					content:"";
					display: inline-block;
					border-style: solid;
					border-width: 0.04rem;
					border-color: #333 transparent transparent;
					position: absolute;
					right: 0;
					top: 50%;
					transform: translateY(-25%);
				}
    	}
    	.search_input{
    		flex: 1;
    		padding: 0.1rem 0.15rem;
    		position: relative;
    		#suggestId{
    			padding: 0.08rem 0.16rem 0.08rem 0.25rem;
    			width: 80%;
    			font-size: 0.13rem;
    			color: #666;
    			background-color: #f2f2f2;
    			border-radius: 0.02rem;
    			height: 0.35rem;
    		}
    		.iconfont{
    			position: absolute;
			    left: 0.21rem;
			    top: 50%;
			    -webkit-transform: translateY(-45%);
			    transform: translateY(-45%);
			    color: #666;
			    font-size: 0.14rem;
			    line-height: 1;
    		}
    		.search_submit{    			
    			width: 15%;
    			height: 0.3rem;
    			border-radius: 0.02rem;
			    background-color: #6666CC;
			    color: #fff;
			    font-size: 0.14rem;
			    // font-weight: bold;
			    margin-left: 2%;
    		}
    	}
    }
    .search_results{
    	padding-bottom: 0.5rem;
    	.address_details{
    		font-size: 0.12rem;
    		color: #2a2a2a;
    		background-color: #fff;
    		padding: 0.1rem 0.15rem;
    		border-bottom: 1px solid #eee;
    		&:last-child{
    			border-bottom: none;
    		}
    		.name{
    			font-size: 0.15rem;
    			font-weight: 700;
    			color: #444;
    		}
    		.details{
    			line-height: 0.2rem;
    			margin-top: 0.02rem;
    		}
    	}
    	.tips{
    		padding: 0.2rem 0.1rem;
    		font-size: 0.14rem;
    		color: #666;
    		background-color: #fff;
				text-align: center;
    	}
    }
	}
</style>
