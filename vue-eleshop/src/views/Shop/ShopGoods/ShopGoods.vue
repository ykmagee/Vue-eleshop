<template>
  <div class="shop_goods">
    <div class="goods">
    	<!-- 左侧商品分类菜单 -->
    	<div class="menu_wrapper">
    		<ul>
    			<li class="menu_item" v-for="(item,index) in goods" :key="index" :class="{current:index===currentIndex}" @click="clickToItem(index)">
    				<img class="icon" :src="item.icon" v-if="item.icon">
    				<span :class="{menu_name:!item.icon}">{{item.name}}</span>              
    			</li>
    		</ul>
    	</div>
    	<!-- 右侧展示所有商品，与左侧菜单对应 -->
    	<div class="foods_wrapper" ref="foodsWrapper">
    		<dl class="foods_list" v-for="(item,index) in goods" :key="index">
    			<dt>
    				<span>{{item.name}}</span>
    			</dt>
    			<dd class="food_item" v-for="(food,index) in item.foods" :key="index" @click="showFood(food)">
    				<div class="food_icon">
    					<span class="tag" v-if="food.is_special">
    						<span>招牌</span>
    					</span>
    					<img :src="food.icon">
    				</div>
    				<div class="food_info">
    					<h3 class="name ellipsis">{{food.name}}</h3>
              <p class="desc ellipsis" v-if="food.description">{{food.description}}</p>
              <div class="sales">
                <span class="count">月售{{food.sellCount}}份</span>
                <span>好评率{{food.rating}}%</span>
              </div>
              <div class="activity" v-if="food.oldPrice">
              	<span class="discount">{{ Math.round((food.price/food.oldPrice)*100)/10 }}折</span>
                <span class="activity_desc">限量抢购</span>
              </div>
              <div class="price">
                <span class="now">{{food.price}}</span>
                <del class="old" v-if="food.oldPrice">¥{{food.oldPrice}}</del>
              </div>
              <!-- 插入控制按钮组件，增加或减少所选商品数量 -->
              <div class="control_button_wrapper">
                <ControlButton :food="food"></ControlButton>
              </div>
    				</div>
    			</dd>
    		</dl>
    	</div>
    </div>
    <!-- 插入商品详情页组件 -->
    <FoodDetails :food="currentFood" ref="food"></FoodDetails>
    <!-- 插入购物车组件 -->
    <ShoppingCart></ShoppingCart>
  </div>
</template>

<script>
	import {mapState} from 'vuex';
	import ControlButton from '../../../components/ControlButton/ControlButton.vue';
	import FoodDetails from './FoodDetails.vue';
	import ShoppingCart from './ShoppingCart.vue';
	export default {
		data(){
			return{
				scrollY: 0, // 右侧页面的scrollTop值
      	tops: [], // 包含右侧所有分类小列表的top值
      	currentFood:{} // 需要显示的food对象，传递给详情页组件
			}
		},
	  components:{
	  	ControlButton,
	  	FoodDetails,
	  	ShoppingCart	  	
	  },
	  mounted(){
	  	// console.log(this.$route.params);
	  	this.$store.dispatch('getShopGoods',()=>{
	  		this.$nextTick(()=>{ //数据更新后立即执行此方法
	  			// 给goods区域设置高度
					this.setGoodsHeight();
								
					this.initData();	
			  })
	  	});
					
	  },
	  // beforeDestroy(){
	  // 	// 实例销毁之前将window上绑定的scroll事件解除
	  // 	window.removeEventListener('scroll',this.scroll);
	  // },
	  // 导航守卫
	  beforeRouteEnter(to,from,next){	  	
	  	next(vm => {
	  		// 导航进入该组件的对应路由之前在window上绑定scroll、resize事件
	  		window.addEventListener('scroll',vm.scroll);
	  		// 窗口缩放重置goods高度
				window.addEventListener('resize',vm.setGoodsHeight);		
	  	});
	  },
	  // 导航守卫
	  beforeRouteLeave(to,from,next){
	  	// 导航离开该组件的对应路由之前将window上绑定的scroll、resize事件解除
	  	window.removeEventListener('scroll',this.scroll);
	  	window.removeEventListener('resize',this.setGoodsHeight);
	  	next();
	  },
	  computed:{
	  	...mapState(['goods']),
	  	// 计算得到当前scrollY值所处分类的下标
	  	currentIndex(){
	  		const {scrollY,tops}=this;
	  		// findIndex() 方法返回传入一个测试条件（函数）符合条件的数组第一个元素位置。
	  		let index=tops.findIndex(function(top,index){
	  			return scrollY>=top && scrollY<tops[index+1];
	  		});
	  		// 返回index值
	  		return index;
	  	}
	  },
	  methods:{	 
	  	// 给goods区域设置高度 
	  	setGoodsHeight(){
	  		let tab=document.getElementsByClassName('tab')[0];	
				let goods=document.getElementsByClassName('goods')[0];
				// 调用自定义全局方法client()
				goods.style.height=this.client().height-tab.clientHeight+'px';
	  	},
			// 控制右侧商品页面是否有滚动条
			scroll(){
				let scrollTop = document.documentElement.scrollTop || window.pageYOffset || document.body.scrollTop;
	  		let shop_header=document.getElementsByClassName('shop_header')[0];
	  		let foods_wrapper=document.getElementsByClassName('foods_wrapper')[0];
	  		// console.log(scrollTop+','+shop_header.clientHeight);
	  		if(scrollTop>=shop_header.clientHeight){
	  			foods_wrapper.style.overflowY='auto';
	  		}else{
	  			foods_wrapper.style.overflowY='hidden';
	  		}
			},
			// 初始化data中的scrollY和tops值
    	initData(){
    		let that=this;
    		// 初始化scrollY
    		this.$refs.foodsWrapper.onscroll=function(){    			
    			that.scrollY=this.scrollTop;
    			// console.log(that.scrollY);
    		}
    		// 初始化tops
    		const tops=[];
    		let top=0;
    		const dlArr=this.$refs.foodsWrapper.children;
    		// 第一个dl的top值为0
    		tops.push(top);
    		// dlArr为类数组对象，不能直接使用数组的方法；此处也可直接使用for循环
    		// 类数组对象转换为数组方法： Array.prototype.slice.call(arrayLike)
    		Array.prototype.slice.call(dlArr).forEach(function(dl){
    			top += dl.clientHeight;
    			tops.push(top);    			
    		});
    		// console.log(tops);
    		// 更新data中的tops
    		this.tops=tops;
    	},    
    	// 点击左侧菜单，使右侧列表滑动到对应的位置
    	clickToItem(index){
    		// 得到目标位置的scrollY
    		const scrollY=this.tops[index];
    		this.scrollY=scrollY;
    		// 使用自定义的全局方法animate()
    		this.animate(this.$refs.foodsWrapper,{'scrollTop':scrollY});
    	},
    	showFood(food){
    		// 传递给商品详情页组件的food对象数据
    		this.currentFood=food;
    		// 在父组件中调用子组件的方法,定义ref='name'，用this.$refs.name调用
    		this.$refs.food.toggleShow();
    	} 	
		}
	}
</script>

<style lang="scss">
	.shop_goods{
		position: relative;
		z-index: 10;
		background-color: #fff;		
		.goods{
			display: flex;
			padding-bottom: 0.48rem;
			.menu_wrapper{
				width: 0.8rem;
				height: 100%;
				background-color: #f5f5f5;
				overflow-y: auto;
				&>ul{width: 100%;}
				padding-bottom: 0.3rem;
				// 隐藏左侧菜单栏的滚动条
				&::-webkit-scrollbar{display:none;}
				.menu_item{
					width: 100%;
					padding: 0.18rem 0.08rem;
					font-size: 0.12rem;
					color: #666;
					text-align: center;
					// overflow: hidden;
					// 当前分类的样式
					&.current{
						color: #333;
						background-color: #fff;
					}
					.icon{
						width: 0.13rem;
						height: 0.13rem;
						margin-right: 0.02rem;
						vertical-align: top;		
					}
					span{
						line-height: 1.4;
						&.menu_name{
							overflow: hidden;
			        text-overflow: ellipsis;
			        // 使元素子元素排列在同一水平线上
			        display: -webkit-box;
			        // 该属性可控制文本最多显示的行数
			        -webkit-line-clamp: 3;
			        -webkit-box-orient: vertical;
						}						
					}
				}
			}
			.foods_wrapper{
				flex: 1;
				height: 100%;
				overflow-y: hidden;
				// padding-left: 0.1rem;
				.foods_list{
					overflow-y: auto;
					dt{
						padding: 0.08rem 0.3rem 0.08rem 0.1rem;
						overflow: hidden;
						background-color: #f3f5f7;
						border-left: 2px solid #d9dde1;
						span{
							font-size: 0.12rem;
							font-weight: 600;
							color: #666;
						}
					}
					.food_item{
						padding: 0.1rem 0 0.1rem 0.1rem;
						display: flex;
						.food_icon{
							width: 0.95rem;
							height: 0.95rem;
							margin-right: 0.1rem;
							position: relative;
							.tag{
								position: absolute;
								left: 0;
								top: 0;
								background-image: linear-gradient(135deg,#ffae1b,#f57751);
								width: 0.24rem;
								height: 0.12rem;
								border-top-left-radius: 0.03rem;
								border-bottom-right-radius: 0.03rem;
								text-align: center;
								span{
									font-size: 0.2rem;
									color: #fff;
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
								border-radius: 0.03rem;
							}
						}
						.food_info{
							flex: 1;
							padding: 0 0.15rem 0.25rem 0;
							position: relative;
							.name{
								font-size: 0.15rem;
								font-weight: 700;
								width: 45vw;
							}
							.desc,.sales{
								font-size: 0.12rem;
								color: #999;
								margin: 0.04rem 0;
								width: 45vw;
								transform: scale(0.85);
								transform-origin: 0 50%;
							}
							.sales{
								.count{
									margin-right: 0.04rem;
								}
							}
							.price{
								position: absolute;
								bottom: 0;
								font-size: 0.18rem;
								color: rgb(255, 83, 57);
								padding-bottom: 0.02rem;
								&::before{
									content: "\A5";
									font-size: 0.15rem;
									margin-right: 0.01rem;
								}
								.old{
									font-size: 0.13rem;
									color: #999;
									margin-left: 0.04rem;
								}
							}
							.activity{
								font-size: 0.12rem;
								color: #eb6551;
								width: 40vw;
								transform: scale(0.85);
								transform-origin: 0 50%;
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
							.control_button_wrapper{
								position: absolute;
								bottom: 0;
								right: 0.15rem;
							}
						}
					}
				}
			}
		}
	}
</style>
