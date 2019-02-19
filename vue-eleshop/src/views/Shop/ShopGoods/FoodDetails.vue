<template>
	<transition name="slide">
	  <div class="food_details" v-if="isShow">
	    <div class="details_content">
	    	<div class="image">
	    		<img :src="food.image" :alt="food.name">
	    	</div>
	    	<div class="info">
	    		<h3 class="name ellipsis">{{food.name}}</h3>
	        <div class="sales">
	          <span class="count">月售{{food.sellCount}}份</span>
	          <span>好评率{{food.rating}}%</span>
	        </div>        
	        <div class="price">
	          <span class="now">{{food.price}}</span>
	          <del class="old" v-if="food.oldPrice">¥{{food.oldPrice}}</del>
	          <div class="activity" v-if="food.oldPrice">
		        	<span class="discount">{{ Math.round((food.price/food.oldPrice)*100)/10 }}折</span>
		          <span class="activity_desc">限量抢购</span>
		        </div>
		        <!-- 插入控制按钮组件，增加或减少所选商品数量 -->
		        <div class="control_button_wrapper">
		          <ControlButton :food="food"></ControlButton>
		        </div>
	        </div>
	        <p class="desc" v-if="food.description">{{food.description}}</p>        
	    	</div>
	    </div>
	    <div class="close" @click="toggleShow()">
	    	<i class="iconfont icon-close"></i>
	    </div>
	  </div>
  </transition>
</template>

<script>
	import ControlButton from '../../../components/ControlButton/ControlButton.vue';
	export default {
		data(){
			return{
				isShow: false
			}
		},
		props:{
			food: Object
		},
	  components:{
	  	ControlButton  	
	  },
	  methods:{
	  	toggleShow(){
	  		this.isShow=!this.isShow
	  	}
	  }
	}
</script>

<style lang="scss">
	.food_details{
		position: fixed;
		top: 0;
		left: 0;
		height: 100%;
		width: 100%;	
		// 过渡效果
		&.slide-enter-active, &.slide-leave-active{
      transition: left 0.2s;
		}
    &.slide-enter, &.slide-leave-to{
      left: 100%;
    }  		
		.close{
			position: absolute;
			top: 0.08rem;
			right: 0.15rem;
			width: 0.28rem;
			height: 0.28rem;
			border-radius: 50%;
			background-color: rgba(0,0,0,0.2);
			text-align: center;
			.iconfont{
				font-size: 0.18rem;
				color: #fff;
				line-height: 0.28rem;
			}
		}
		.details_content{
			width: 100%;
			height: 100%;
			overflow-y: auto;
			background-color: #fff;
			padding-bottom: 0.45rem;
			position: relative;
			.image{
				width: 100%;
				height: 100vw;
				img{
					width: 100%;
					height: 100%;
					max-width: 100%;
				}
			}
			.info{
				padding: 0.18rem 0.18rem 0;
				position: relative;
				width: 100%;
				min-height: 1.1rem;
				.name{
					font-size: 0.2rem;
					font-weight: 700;
					width: 75vw;
					margin-bottom: 0.09rem;
				}
				.desc,.sales{
					font-size: 0.12rem;
					color: #666;
					margin-bottom: 0.09rem;
					// transform: scale(0.85);
					// transform-origin: 0 50%;
				}
				.sales{
					.count{
						margin-right: 0.04rem;
					}
				}
				.price{		
					display: flex;
					align-items: baseline;			
					font-size: 0.18rem;
					color: rgb(255, 83, 57);
					margin-bottom: 0.09rem;
					&::before{
						content: "\A5";
						font-size: 0.15rem;
						margin-right: 0.01rem;
					}
					.old{
						font-size: 0.13rem;
						color: #999;
						margin-left: 0.04rem;
						padding-right: 0.04rem;
					}
					.activity{
						font-size: 0.12rem;
						color: #eb6551;
						width: 40vw;
						// transform: scale(0.85);
						// transform-origin: 0 50%;
						display: flex;
						&>span{
							height: 0.15rem;
							padding: 0 0.03rem;
							position: relative;
						}
						.discount{
							&::after{
								content: "";
								position: absolute;
								left: 0;
								top: 0;
								width: 200%;
								height: 200%;
								transform: scale(0.5);
								transform-origin: 0 0;
								border: 0.01rem solid hsla(8,79%,62%,.3);
							}
						}
						.activity_desc{
							color: #f07373;
						}
					}
				}				
				.control_button_wrapper{
					position: absolute;
					// bottom: 0;
					right: 0.18rem;
				}
			}
		}
	}
</style>
