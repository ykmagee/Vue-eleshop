<template>
  <div class="shop_container">
    <ul class="shop_list" v-if="shops.length">
    	<li class="shop_li border-1px" v-for="(shop,index) in shops" :key="index" @click="$router.push({path: '/shop/'+shop.id})">
    		<!-- <div class="clearfix"> -->
    			<!-- 左侧为商家图片 -->
	    		<div class="shop_left">
	    			<img class="shop_img" :src="baseImgUrl+shop.image_path">
	    		</div>
	    		<!-- 右侧为详情 -->
	    		<div class="shop_right">
	    			<!-- 商家名称、支持服务 -->
	    			<section class="detail_header">
	    				<span class="premium" v-if="shop.is_premium">品牌</span>
	    				<h3 class="shop_title ellipsis">{{ shop.name }}</h3>
	    				<ul>
	    					<li class="supports" v-for="(support,index) in shop.supports" :key="index">
	    						{{ support.icon_name }}
	    					</li>
	    				</ul>
	    			</section>
	    			<!-- 评分、月订单数、是否专送 -->
	    			<section class="rating_order">
	    				<!-- 评分星级组件，将评分值rating传递给子组件 -->
	    				<RatingStar :rating="shop.rating"></RatingStar>
	    				<div class="rating_order_left">
	    					<span class="rating">{{ shop.rating }}</span>
	    					<span class="order">月售{{ shop.recent_order_num }}单</span>
	    				</div>
	    				<div class="rating_order_right" v-if="shop.delivery_mode">
	    					<div class="delivery" v-show="shop.delivery_mode.is_solid">{{ shop.delivery_mode.text }}</div>
	    				</div>
	    			</section>
	    			<!-- 起送价、配送费、距离、时间 -->
	    			<section class="limit_distance">
	    				<div class="limit">
	    					<span>￥{{ shop.float_minimum_order_amount }}起送</span>
	    					<span class="separation">|</span>
	    					<span>配送费￥{{ shop.float_delivery_fee }}</span>
	    				</div>
	    				<div class="distance">
	    					<span>{{ shop.distance }}</span>
	    					<span class="separation">|</span>
	    					<span>{{ shop.order_lead_time }}</span>
	    				</div>
	    			</section>
	    		</div>
    		<!-- </div>	    		 -->
    	</li>
    </ul>
    <!-- 页面内容加载前显示预设svg图片 -->
    <ul v-else v-show="presetImg">
    	<li v-for="item in 6" :key="item">
    		<img src="./images/shop_back.svg" alt="back">
    	</li>
    </ul>
  </div>
</template>

<script>
	// import {mapState} from 'vuex';
	import RatingStar from '../RatingStar/RatingStar.vue';

	export default {
		data () {
	    return {
	      baseImgUrl: 'https://fuss10.elemecdn.com'
	    }
	  },
	  components:{
	  	RatingStar
	  },
	  props:{
	  	shops:Array,
	  	presetImg:Boolean
	  },
		computed:{
			// ...mapState(['shops'])
		},
		methods:{
			
		},
	  mounted () {    
	    // this.$store.dispatch('getShops');
	  }
	}
</script>

<style lang="scss">
	@import "../../assets/css/mixins.scss";

  .shop_container{
  	// margin-bottom: 0.5rem;
  	width: 100%;
  	.shop_list:first-child{
  		// 首个有顶部分割线
  		@include top-border-1px($bc);
  	}
  	.shop_li{
  		// 底部分割线
  		@include bottom-border-1px($bc);
  		width: 100%;  		
  		padding: 0.15rem 0.08rem;  
  		display: flex;		
  		.shop_left{
				// float: left;
				width: 0.75rem;
				height: 0.75rem;
				margin-right: 0.1rem;
				flex: none;
				.shop_img{
					width: 100%;
					height: 100%;
					border: 1px solid rgba(0,0,0,0.08);
					border-radius: 0.05rem;
				}
  		}
  		.shop_right{
  			// float: right;
  			flex: 1;
  			width: calc(100% - 0.85rem);
  			height: 0.75rem;
  			display: flex;
  			flex-direction: column;
  			justify-content: space-between;
  			.detail_header{
  				display: flex;
  				align-items: center;
					.premium{
						font-size: 0.12rem;
						font-weight: 700;
						margin-right: 0.06rem;
						padding: 0.02rem;
						background-image: linear-gradient(-139deg,#fff100,#ffe339);
						color: #6f3f15;
						white-space: nowrap; 
					}
					.shop_title{
						display: inline-block;
						font-size: 0.16rem;
						color: #333;
						font-weight: 700;
					}
					ul{
						display: flex;
						align-items: center;
						margin-left: auto;
						.supports{
							font-size: 0.12rem;
							color: #888;
							padding: 0 0.01rem;
							margin: 0.02rem;
							border: 1px solid #ddd;
							border-radius: 0.02rem;	
							transform: scale(0.9);
							transform-origin: 100%;													
						}
					}
  			}
  			.rating_order{
					display: flex;
					align-items: center;
					font-size: 0.12rem;
					.rating_order_left{
						margin-left: 0.05rem;
						transform: scale(0.9);
						transform-origin: 0;
						.rating{							
							color: #ff6000;
							margin-right: 0.02rem;
						}
						.order{							
							color: #666;							
						}
					}
					.rating_order_right{
						margin-left: auto;
						transform: scale(0.9);
						transform-origin: 100%;
						.delivery{
							background-color: $baseColor;
							color: #fff;
							padding: 0.015rem;
							border: 1px solid transparent;
							border-radius: 0.02rem;
							opacity: 0.85;
						}
					}
  			}
  			.limit_distance{
					display: flex;
					justify-content: space-between;
					font-size: 0.12rem;
					color: #666;
					.limit{
						transform: scale(0.9);
						transform-origin: 0;
					}
					.distance{
						transform: scale(0.9);
						transform-origin: 100%;
					}
					.separation{
						color: #ddd;
					}
  			}
  		}
  	}
  }
</style>
