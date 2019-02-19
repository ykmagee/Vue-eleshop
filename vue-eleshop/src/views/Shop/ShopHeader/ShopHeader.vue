<template>
  <div class="shop_header">
    <nav class="shop_nav" :style="{backgroundImage: `url(${info.bgImg})`}">
    	<a href="javascript:;" class="back" @click="$router.back()">
    		<i class="iconfont icon-left-1"></i>
    	</a>
    </nav>
    <div class="shop-content">
    	<div class="content_img">
    		<span class="tag"><span>品牌</span></span>
    		<img :src="info.avatar">
    	</div>
    	<div class="content_header" @click="toggleShopShow">
    		<h2 class="title">
    			<span class="ellipsis">{{ info.name }}</span>
    			<i class="content_icon"></i>
    		</h2>
    		<div class="shop_message">
    			<span>评价{{ info.score }}</span>
    			<span>月售{{ info.sellCount }}单</span>
    			<span v-if="info.delivery_mode">{{info.delivery_mode.text}}约{{ info.deliveryTime }}分钟</span>
    		</div>
    	</div>
    	<div class="shop_discounts" v-if="info.supports" @click="toggleSupportShow">
    		<div class="discounts_left">
    			<span class="tag" :class="supportColor[info.supports[0].type]">{{ info.supports[0].name }}</span>
    			<span class="detail ellipsis">{{ info.supports[0].content }}</span>
    		</div>
    		<div class="discounts_right">
    			<span>{{ info.supports.length }}个优惠</span>
    		</div>
    	</div>
    	<div class="shop_notice ellipsis">
    		<span>公告：{{ info.bulletin }}</span>
    	</div>
    </div>
    <transition name="fade">
    	<div class="brief_modal" v-if="shopShow">
    		<div class="content">
    			<h2 class="content_title">
    				<i class="tag">品牌</i>{{ info.name }}
    			</h2>
    			<ul class="content_msg">
    				<li>
              <h3>{{info.score}}</h3>
              <p>评分</p>
            </li>
            <li>
              <h3>{{info.sellCount}}单</h3>
              <p>月售</p>
            </li>
            <li>
              <h3 v-if="info.delivery_mode">{{info.delivery_mode.text}}</h3>
              <p>约{{info.deliveryTime}}分钟</p>
            </li>
            <li>
              <h3>{{info.deliveryPrice}}元</h3>
              <p>配送费用</p>
            </li>
            <li>
              <h3>{{info.distance}}</h3>
              <p>距离</p>
            </li>
    			</ul>
    			<h3 class="content_notice">
    				<span>公告</span>    				
    			</h3>
    			<div class="notice_detail">{{ info.bulletin }}</div>    			
    		</div>
    		<div class="close" @click="toggleShopShow">
  				<i class="iconfont icon-close"></i>
  			</div>
    		<div class="cover" @click="toggleShopShow"></div>
    	</div>
    </transition>
    <!-- <transition name="slide"> -->
    <div class="activity_sheet" v-show="supportShow">
    	<transition name="slide">
	    	<div class="content" v-if="supportShow">
	  			<h2 class="content_title">优惠活动</h2>
	  			<ul class="list">
	  				<li class="activity_item" v-for="(support,index) in info.supports" :key="index">
	  					<span class="tag" :class="supportColor[support.type]">{{ support.name }}</span>
	  					<span class="detail ellipsis">{{ support.content }}</span>
	  				</li>
	  			</ul>
	  			<div class="close" @click="toggleSupportShow">
	  				<i class="iconfont icon-close"></i>
	  			</div>
	  		</div>  
  		</transition>  	 		
  		<div class="cover" @click="toggleSupportShow"></div>
  	</div>   	
    <!-- </transition> 	     -->
  </div>
</template>

<script>
	import {mapState} from 'vuex'
	export default {
		data(){
			return {
	      supportColor: ['activity-green', 'activity-red', 'activity-orange'],
	      shopShow: false,
	      supportShow: false
	    }
		},
	  computed: {
	    ...mapState(['info'])
	  },
	  methods:{
	  	toggleShopShow(){
	  		this.shopShow=!this.shopShow
	  	},
	  	toggleSupportShow(){
	  		this.supportShow=!this.supportShow
	  	}
	  }
	}
</script>

<style lang="scss">
	.shop_header{
		color: #333;
		background-color: #fff;
		padding-top: 1rem;
		position: relative;
		.shop_nav{
			width: 100%;
			height: 1rem;
			position: absolute;
			left: 0;
			top: 0;
			background-repeat: no-repeat;
			background-position: center;
			background-size: cover;
			&::before{
				content:"";
				display: block;
				width: 100%;
				height: 100%;
				background-image: linear-gradient(0deg,hsla(0,0%,100%,0),rgba(0,0,0,.5));				
			}
			.back{
				position: absolute;
				left: 0.1rem;
				top: 0.1rem;
				color: #fff;
				.iconfont{
					font-size: 0.2rem;
				}
			}
		}
		.shop-content{
			position: relative;
			padding-top: 0.3rem;
			display: flex;
			flex-direction: column;
			align-items: center;
			.content_img{
				width: 0.75rem;
				height: 0.75rem;
				position: absolute;
				top: -0.6rem;
				left: 50%;
				transform: translate(-50%,0);
				.tag{
					position: absolute;
					top: 0;
					left: 0;
					background-image: linear-gradient(90deg,#fff100,#ffe339);
					width: 0.24rem;
					height: 0.12rem;
					border-top-left-radius: 0.03rem;
					border-bottom-right-radius: 0.03rem;
					text-align: center;
					span{
						font-size: 0.2rem;
						color: #6f3f15;
						font-weight: 700;
						position: absolute;
						top: 0;
						left: 0;
						right: -100%;
						bottom: -100%;
						transform: scale(0.5);
						transform-origin: 0 0;
					}
				}
				img{
					width: 100%;
					height: 100%;
					border-radius: 0.03rem;
					box-shadow: 0 0 0.02rem 0 rgba(0,0,0,.2);
				}
			}
			.content_header{
				width: 72%;
				.title{
					font-size: 0.2rem;
					font-weight: 700;
					white-space: nowrap;
					text-align: center;
					display: flex;
					align-items: baseline;
					justify-content: center;
					padding-left: 0.08rem;
					overflow: hidden;
					.content_icon{
						width: 0.14rem;
						height: 0.14rem;
						position: relative;
						display: inline-block;
						margin-left: 0.04rem;
						&::after{
							content:"";
							border-style: solid;
							border-width: 0.07rem;
							// border-width: 0.03rem 0 0.03rem 0.04rem;
							border-color: transparent transparent transparent rgba(0,0,0,.67);
							position: absolute;
							left: 0;
							top: 0;
						}
					}
				}
				.shop_message{
					margin-top: 0.05rem;
					font-size: 0.12rem;
					font-weight: 500;
					white-space: nowrap;
					color: #666;
					text-align: center;
					transform-origin: 50% 50%;
					transform: scale(0.9);
					span{
						padding-right: 0.08rem;					
						&:last-child{
							padding-right: 0;
						}
					}
				}
			}
			.shop_discounts{
				width: 100%;
				margin: 0.06rem 0;
				padding: 0 0.38rem;
				display: flex;
				align-items: center;
				justify-content: space-between;
				color: #333;
				font-size: 0.12rem;
				overflow: hidden;
				.discounts_left{
					flex: 1;
					transform-origin: 50% 50%;
					transform: scale(0.9);
					display: flex;
					align-items: center;
					overflow: hidden;
					.tag{
						color: #fff;
						background-color: rgb(240, 115, 115);
						display: inline-block;
						padding: 0.015rem 0.04rem;
						margin-right: 0.06rem;
						border-radius: 0.02rem;
						&.activity-green{background-color: rgb(112, 188, 70);}
						&.activity-orange{background-color: rgb(241, 136, 79);}
					}
					.detail{
						flex: 1;
					}
				}
				.discounts_right{
					flex-shrink: 0;
					transform-origin: 50% 50%;
					transform: scale(0.9);
					color: #999;
					span{
						padding-right: 0.08rem;
						position: relative;
						&::after{
							content:"";
							display: inline-block;
							border-style: solid;
							border-width: 0.05rem;
							border-color: #999 transparent transparent;
							position: absolute;
							right: -0.04rem;
							top: 50%;
							transform: translateY(-25%);
						}
					}					
				}
			}
			.shop_notice{
				width: 80%;
				font-size: 0.12rem;
				color: #999;
				text-align: center;
				transform-origin: 50% 0%;
				transform: scale(0.9);
			}
		}
		.brief_modal{
			width: 100%;
			height: 100%;
			position: fixed;
			left: 0;
			top: 0;
			display: flex;
			flex-direction: column;
			justify-content: center;
			align-items: center;
			z-index: 50;
			.content{
				position: relative;
				z-index: 99;
				width: 80%;
				max-height: 60%;
				background-color: #fff;
				border-radius: 0.04rem;
				// overflow: hidden;
				display: flex;
				flex-direction: column;
				// transition: transform 0.2s;
				// will-change: transform;
				padding: 0.27rem 0.25rem;
				.content_title{
					font-size: 0.25rem;
					color: #333;
					text-align: center;
					font-weight: bolder;
					.tag{
						font-size: 0.12rem;
						color: #6a3709;
						font-weight: 700;
						font-style: normal;
						border-radius: 0.04rem;
						background-image: linear-gradient(90deg,#fff100,#ffe339);
						padding: 0.02rem;
						display: inline-block;
						transform: translate(-0.05rem,-0.05rem);
					}
				}
				.content_msg{
					display: flex;
					margin: 0.18rem -0.25rem 0;
					li{
						flex: 1;
						text-align: center;
						h3{
							font-size: 0.15rem;
							font-weight: 600;
							color: #333;
							margin-bottom: 0.06rem;
						}
						p{
							font-size: 0.12rem;
							color: #999;
						}
					}
				}
				.content_notice{
					width: 25%;
					text-align: center;
					margin: 0.18rem auto 0.08rem;
					font-size: 0.12rem;
					font-weight: normal;
					background: center no-repeat;
					background-image: linear-gradient(90deg,#fff,#333 50%,#fff);
					background-size: 100% 1px;
					span{
						color: #999;
						background-color: #fff;
						padding: 0 0.04rem;
					}
				}
				.notice_detail{
					font-size: 0.13rem;
					line-height: 1.5;
					color: #333;
					max-height: 0.8rem;
					overflow-y: auto;
				}				
			}
			.close{
				// position: absolute;
				// left: 50%;
				// bottom: -0.6rem;
				// transform: translateX(-50%);
				color: rgba(255,255,255,0.6);
				border: 1px solid rgba(255,255,255,0.6);
				border-radius: 50%;				
				width: 0.3rem;
				height: 0.3rem;
				text-align: center;
				margin-top: 0.3rem;
				z-index: 2;
				.iconfont{
					font-size: 0.18rem;
					line-height: 0.3rem;
				}
			}
			.cover{
				width: 100%;
				height: 100%;
				background-color: rgba(0,0,0,.5);
				position: absolute;
				left: 0;
				top: 0;
				z-index: 1;
			}
		}
		.activity_sheet{
			width: 100%;
			height: 100%;
			position: fixed;
			left: 0;
			top: 0;
			z-index: 99;
			.content{
				position: absolute;
				bottom: 0;
				left: 0;
				right: 0;
				z-index: 100;
				height: 2.55rem;
				background-color: #f5f5f5;
				transition: transform 0.25s;
				//提前通知浏览器将要对元素做的动画类型
				will-change: transform;
				padding: 0.20rem 0.25rem;
				box-shadow: 0 -1px 5px 0 rgba(0,0,0,.4);				
				.content_title{
					font-size: 0.17rem;
					font-weight: 600;
					text-align: center;
					margin-bottom: 0.15rem;
				}
				.list{
					height: 1.8rem;
					overflow-y: scroll;
					.activity_item{
						margin-bottom: 0.1rem;
						display: flex;
						align-items: center;
						font-size: 0.13rem;
						.tag{
							font-size: 0.12rem;
							color: #fff;
							background-color: rgb(240, 115, 115);
							display: inline-block;
							height: 0.17rem;
							line-height: 0.17rem;
							padding: 0 0.03rem;
							margin-right: 0.06rem;
							border-radius: 0.02rem;
							&.activity-green{background-color: rgb(112, 188, 70);}
							&.activity-orange{background-color: rgb(241, 136, 79);}
						}
						.detail{
							line-height: 1.35;
							flex: 1;
						}
					}
				}
				.close{
					position: absolute;
					top: 0.1rem;
					right: 0.1rem;
					.iconfont{
						font-size: 0.24rem;
						color: #777;
					}
				}
				// &.slide-enter-active, &.slide-leave-active {
		      // transition: all 0.3s;
		    // }
		    //定义进入过渡的开始状态和离开过渡的结束状态
		    &.slide-enter, &.slide-leave-to {
		    	transform: translateY(100%);
		    }		   
			}
			.cover{
				width: 100%;
				height: 100%;
				background-color: rgba(0,0,0,.5);
				position: absolute;
				left: 0;
				top: 0;
			}			
		}
		//过渡动画
		.fade-enter-active, .fade-leave-active {
      transition: opacity 0.3s;
    }
    .fade-enter, .fade-leave-to {
      opacity: 0;
    }		
	}
</style>
