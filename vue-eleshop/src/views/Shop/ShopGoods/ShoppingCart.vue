<template>
  <div class="shopping_cart">
  	<transition name="fade">
  		<div class="cart_mask" v-show="isShow" @click="toggleShow"></div>
  	</transition>  	
  	<!-- 购物车商品详情 -->
  	<div class="cart_body">
  		<transition name="move">
        <div class="cart_list" v-show="isShow">
          <div class="list_header">
            <span class="title">已选商品</span>
            <span class="empty iconfont icon-clear" @click="clearCart">清空</span>
          </div>
          <div class="list_content">
            <ul>
              <li class="food" v-for="(food, index) in cartFoods" :key="index">
                <span class="name ellipsis">{{food.name}}</span>
                <div class="price">
                	<del class="old" v-if="food.oldPrice">¥{{food.oldPrice}}</del>
                	<span class="now">{{food.price}}</span>
                </div>
                <!-- 插入控制按钮组件，增加或减少所选商品数量 -->
                <div class="control_button_wrapper">
                  <ControlButton :food="food"/>
                </div>
              </li>
            </ul>
          </div>
        </div>
      </transition>
  	</div>
  	<!-- 购物车固定底部 -->
  	<div class="cart_footer">
  		<div class="cart_icon" :class="{active: totalCount}" @click="toggleShow">
				<i class="iconfont icon-shopping-cart"></i>
				<div class="count" v-if="totalCount">{{totalCount}}</div>
			</div>
			<div class="cart_price">
				<p class="total">
					<span class="now" v-if="totalCount">¥{{totalPrice}}</span>
					<del class="old" v-if="totalCount&&totalOldPrice">¥{{totalOldPrice}}</del>
					<span class="init" v-if="!totalCount">未选购商品</span>
				</p>
				<p class="delivery">另需配送费{{info.deliveryPrice}}元</p>
			</div>
			<div class="cart_submit" :class="submitClass">
				<span>{{submitText}}</span>
			</div>
  	</div>		
  </div>
</template>

<script>
	import {mapState, mapGetters} from 'vuex';
	import ControlButton from '../../../components/ControlButton/ControlButton.vue';
	export default {
		data(){
			return{
				isShow: false
			}
		},
	  components:{
	  	ControlButton
	  },
	  computed:{
	  	// 在购物车中获取到cartFoods的state 以及商家的info
    	...mapState(['cartFoods', 'info']),
    	// 获取相应的Getters里的数据
    	...mapGetters(['totalCount', 'totalPrice', 'totalOldPrice']),
    	// 通过计算已选商品价格是否达到起送价来设置购物车不同的样式和提示文字
    	submitClass(){
    		const {totalPrice} = this;
      	const {minPrice} = this.info;
      	return totalPrice >= minPrice ? 'enough' : 'not-enough';
    	},
    	submitText(){
    		const {totalPrice} = this;
      	const {minPrice} = this.info;
      	if (totalPrice === 0) {
	        return `¥${minPrice}元起送`;
	      } else if (totalPrice < minPrice) {
	        return `还差¥${minPrice - totalPrice}元起送`;
	      } else {
	        return '去结算';
	      }
    	}
	  },
	  watch:{
	  	// 监测totalCount的值，当其值为0时，将isShow设为false，即不显示购物车商品详情
	  	totalCount(){	  		
	  		if (this.totalCount===0) {
	  			this.isShow=false;
	  		}
	  	}
	  },
	  methods:{
	  	// 显示隐藏购物车商品详情
	  	toggleShow(){
	  		// 当购物车商品数量大于0时才切换
	  		if (this.totalCount>0) {
	  			this.isShow=!this.isShow;
	  		}	  		
	  	},
	  	// 清空购物车
	  	clearCart(){
	  		this.$store.dispatch('clearCart');
	  	}
	  }
	}
</script>

<style lang="scss">
	.shopping_cart{
		.cart_mask{
			position: fixed;
			top: 0;
			bottom: 0;
			left: 0;
			right: 0;
			background-color: #000;
			opacity: 0.4;
			transition: opacity 0.3s ease;
			// 显示隐藏过渡效果
      &.fade-enter, &.fade-leave-to{
        opacity: 0;
      }  	
		}
		.cart_footer{
			position: fixed;
			bottom: 0;
			left: 0;
			right: 0;
			height: 0.48rem;
			background-color: rgba(61,61,63,.95);
			color: #fff;
			padding-left: 0.8rem;
			display: flex;
			align-items: center;
			.cart_icon{
				position: absolute;
				left: 0.15rem;
				bottom: 0.07rem;
				width: 0.5rem;
				height: 0.5rem;
				border: 0.05rem solid #444;
				border-radius: 50%;
				background-image: radial-gradient(circle,#363636 6.266667vw,#444 0);
				display: flex;
				align-items: center;
				justify-content: center;
				.iconfont{
					font-size: 0.24rem;
					color: #777;
				}
				.count{
					position: absolute;
					right: -0.045rem;
					top: -0.05rem;
					min-width: 0.16rem;
					height: 0.16rem;
					border-radius: 0.12rem;
					background-image: linear-gradient(-90deg,#ff7416,#ff3c15 98%);
					text-align: center;
					font-size: 0.12rem;
					line-height: 1;		
					padding: 0.02rem;		
				}
				// 购物车内有商品时的样式
				&.active{
					background-image: none;					
					background-color: $baseColor;
					.iconfont{color: #fff;}
				}
			}
			.cart_price{
				flex: 1;
				font-size: 0.13rem;
				color: #999;
				.total{
					margin-bottom: 0.01rem;
					.now{
						font-size: 0.18rem;
						color: #fff;
					}
					.old{
						// font-size: 0.13rem;
					}
				}
				.delivery{
					transform: scale(0.85);
					transform-origin: 0 50%;
				}
			}
			.cart_submit{
				width: 1rem;
				height: 100%;
				background-color: #555;
				text-align: center;
				line-height: 0.48rem;
				font-size: 0.13rem;
				font-weight: 700;
				// 达到起送价时的样式
				&.enough{
					background-color: #38ca73;
					font-size: 0.15rem;
				}
			}
		}		
		.cart_body{
			position: fixed;
			left: 0;
			bottom: 0.48rem;
			width: 100%;
			// background-color: #fff;
			.cart_list{
				background-color: #fff;
				&.move-enter-active, &.move-leave-active{
	        transition: transform 0.3s;
				}
	      &.move-enter, &.move-leave-to{
	        transform: translateY(100%);
	      }  	
				.list_header{
					display: flex;
					align-items: center;
					padding: 0 0.15rem;
					background-color: #eceff1;
					font-size: 0.16rem;
					color: #666;
					border-bottom: 1px solid #ddd;
					height: 0.4rem;
					.title{
						flex: 1;
					}
					.empty{
						flex: none;
						font-size: 0.15rem;
						color: #00a0dc;
						&::before{
							margin-right: 0.03rem;
						}
					}
				}
				.list_content{
					overflow: auto;
					max-height: 3rem;
					.food{
						display: flex;
						align-items: center;
						padding: 0.07rem 0.12rem 0.07rem 0;
						margin-left: 0.12rem;
						min-height: 0.52rem;
						border-bottom: 1px solid #eee;
						font-size: 0.15rem;
						.name{
							flex: 5.5;
						}
						.price{
							flex: 2.5;
							text-align: right;
							white-space: nowrap;
							font-weight: 700;
							font-size: 0.16rem;
							color: rgb(255, 83, 57);
							.old{
								font-size: 0.12rem;
								color: #999;
								font-weight: 400;
								margin-right: 0.02rem;
								display: inline-block;
								transform: scale(0.9);
								transform-origin: 100% 0;
							}
							.now::before{
								content: "\A5";
								font-size: 0.12rem;
							}
						}
						.control_button_wrapper{
							flex: 3.5;
							text-align: right;
						}
					}
				}
			}
		}
	}
</style>
