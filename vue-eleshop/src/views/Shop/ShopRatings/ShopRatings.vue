<template>
  <div class="shop_ratings">
    <div class="overview">
    	<div class="overview_left">
    		<div class="score">
    			<span>{{info.score}}</span>
    		</div>
    		<div class="star_wrapper">
    			<span>商家评分</span>
    			<!-- 插入评分星级组件，将评分值rating传递给子组件 -->
    			<RatingStar :rating="info.score"/>
    		</div>
    	</div>
    	<div class="overview_right">
    		<div class="food_score">
    			<div>
    				<span>味道</span>
    				<p>{{info.tasteScore}}</p>
    			</div>
    			<div>
    				<span>包装</span>
    				<p>{{info.packingScore}}</p>
    			</div>
    		</div>
    		<div class="delivery_score">
  				<span>配送</span>
  				<p>{{info.deliveryScore}}</p>
  			</div>
    	</div>
    </div>
    <div class="content">
    	<ul class="rating_tags">
    		<!-- 评价标签，点击显示相应的内容 -->
    		<li :class="{active: selectType===2&&!onlyShowPics}" @click="setSelectType(2)">全部 {{ratings.length*3}}</li>
    		<li :class="{active: selectType===0}" @click="setSelectType(0)">好评 {{positiveSize*3}}</li>
    		<li :class="{active: selectType===1}" @click="setSelectType(1)" class="negative">差评 {{(ratings.length-positiveSize)*3}}</li>
    		<li :class="{active: onlyShowPics}" @click="setSelectType(2); onlyShowPics=true">有图 {{picturesSize*3}}</li>
    	</ul>
    	<p class="switch iconfont icon-check-circle" :class="{on: onlyShowText}" @click="toggleOnlyShowText()">只看有内容的评价</p>
    	<!-- 用mint-ui的InfiniteScroll无限加载 -->
    	<ul class="rating_list" v-infinite-scroll="loadMore" infinite-scroll-disabled="loading" infinite-scroll-distance="10">
    		<!-- 根据评价标签的状态，过滤出满足要求的评论显示 -->
    		<li class="rating_item" v-for="(rating, index) in filterRatings" :key="index">
    			<div class="avatar">
    				<!-- 通过改变图片margin-top值来改变sprite图的位置 -->
    				<img :src="rating.avatar" :style="{marginTop:-0.3*(Math.floor(Math.random()*6))+'rem'}">
    			</div>
    			<div class="comment">
    				<div class="comment_header">
    					<h3 class="username">{{rating.username}}</h3>
    					<!-- 用过滤器处理时间戳 -->
    					<p class="comment_time">{{rating.rateTime | date-format}}</p>
    				</div>
    				<div class="star_wrapper">    					
    					<!-- 插入评分星级组件，将评分值rating传递给子组件 -->
		    			<RatingStar :rating="rating.score"/>
		    			<!-- 根据评分值显示相应文本内容及颜色 -->
		    			<span :style="{color:scoreType(rating.score).color}">{{scoreType(rating.score).text}}</span>
		    		</div>
		    		<p class="comment_text" v-if="rating.text">{{rating.text}}</p>
		    		<ul class="comment_pictures" v-if="rating.pictures.length">
		    			<!-- 默认一行显示2张图片，当图片个数为3的倍数时，保证一行显示3张图片 -->
		    			<li :class="{small:!(rating.pictures.length%3)}" v-for="(picture, index) in rating.pictures" :key="index" @click="showPic(picture)">
		    				<img :src="picture.small">
		    			</li>
		    		</ul>
		    		<div class="recommend" v-if="rating.recommend.length">
		    			<i class="iconfont" :class="rating.rateType===0 ? 'icon-good' : 'icon-bad'"></i>
		    			<div class="details" v-for="(item, index) in rating.recommend" :key="index">
                <span>{{item}}</span>
		    			</div>
		    		</div>		    		
    			</div>
    		</li>
    	</ul>
    	<!-- 滚动到底部的加载提示 -->
    	<LoadMore :hasMoreData="hasMoreData"/>			
    	<!-- 评论大图容器 -->
    	<transition name="scale">
	  		<div class="big_pics" v-if="showBigPic" @click="showBigPic=false">  			
	  			<div class="image_wrapper">
	  				<img :src="currentPic.big">
	  			</div>  			
	  			<p class="name">{{currentPic.name}}</p>
	  			<div class="close iconfont icon-close"></div>
	  		</div>
  		</transition>
    </div>
  </div>
</template>

<script>
	import Vue from 'vue';
	import {mapState, mapGetters} from 'vuex';
	import {InfiniteScroll} from 'mint-ui';
	Vue.use(InfiniteScroll);
	// Vue.component(Spinner.name, Spinner);
	import RatingStar from '../../../components/RatingStar/RatingStar.vue';
	import LoadMore from '../../../components/LoadMore/LoadMore.vue';
	export default {
		data(){
			return{
				onlyShowText: true, // 是否只显示有文本的评价信息
				onlyShowPics: false, // 是否只显示有图片的评价信息
      	selectType: 2, // 选择的评价类型: 0满意, 1不满意, 2全部
      	scoreColor: ['rgb(137, 159, 188)','rgb(251, 154, 11)','rgb(255, 96, 0)'], //评分值文本的color属性值
      	currentPic: {}, //当前需要显示大图片的picture对象
      	showBigPic: false, //是否显示评论大图片
      	loading: false, //是否取消无限滚动，若为true则不会加载新数据
      	ratingsArr: [], //存放从state中获取的ratings
      	loadCount: 0, //加载次数
      	hasMoreData: true //是否还有更多数据
			}
		},
	  components:{
	  	RatingStar,
	  	LoadMore  	
	  },
	  mounted(){
	  	this.$store.dispatch('getShopRatings',()=>{
	  		this.ratingsArr=this.ratings;
	  	});
	  },
	  computed:{
	  	...mapState(['info', 'ratings']),
    	...mapGetters(['positiveSize', 'picturesSize']),
    	// 根据评价标签的状态，从ratings中过滤出满足要求的评论生成新数组
    	filterRatings () {
	      // 得到相关的数据
	      const {ratingsArr, onlyShowText, onlyShowPics, selectType} = this;
	      // 产生一个过滤新数组 
	      // arr.filter(callback(element[, index[, array]])[, thisArg]) 返回布尔值，true才保留
	      return ratingsArr.filter(rating => {
	        const {rateType, text, pictures} = rating;
	        /*
	          条件1:
	              selectType: 0/1/2
	              rateType: 0/1
	              全部 || 满意、不满意中的一种
	              selectType===2 || selectType===rateType
	          条件2
	              onlyShowText: true/false
	              text或pictures: 有值/没值
	              符合条件一的全部评价 || 符合条件一的有文字或图片的评价
	              !onlyShowText || (text.length>0||pictures.length>0)
	          条件3
	              onlyShowPics: true/false
	              pictures: 有值/没值
	              符合条件一、二的全部评价 || 符合条件一、二的有图片的评价
	              !onlyShowPics || pictures.length>0
	          */
	        // 返回一个布尔值
	        return (selectType === 2 || selectType === rateType) && (!onlyShowText || (text.length>0||pictures.length>0)) && (!onlyShowPics || pictures.length > 0)
	      })
	    } 
	  },
	  methods:{
	  	setSelectType (selectType) {
	      this.selectType = selectType;
	      this.onlyShowPics=false;
	    },
	    toggleOnlyShowText () {
	      this.onlyShowText = !this.onlyShowText;
	    },
	    // 根据客户的评分值 返回显示文本内容text和文本color属性值
	    scoreType (score) {
	    	switch(score){
	    		case 1: return{
	    			text: '吐槽',
	    			color: this.scoreColor[0]
	    		}
	    		break;
	    		case 2: return{
	    			text: '较差',
	    			color: this.scoreColor[0]
	    		}
	    		break;
	    		case 3: return{
	    			text: '一般',
	    			color: this.scoreColor[1]
	    		}
	    		break;
	    		case 1: return{
	    			text: '满意',
	    			color: this.scoreColor[1]
	    		}
	    		break;
	    		case 1: return{
	    			text: '超赞',
	    			color: this.scoreColor[2]
	    		}
	    		break;
	    		default: return{
	    			text: '超赞',
	    			color: this.scoreColor[2]
	    		}	    		
	    	}
	    },
	    showPic (picture) {
	    	this.currentPic=picture;
	    	this.showBigPic=true;
	    },
	    // 滚动加载更多数据
	    loadMore () {	    	
	    	this.loading = true;
        setTimeout(() => {
        	this.loadCount++;
        	if (this.loadCount<=3) {
        		this.ratingsArr=this.ratingsArr.concat(this.filterRatings);
          	this.loading = false;
        	}else {
        		this.hasMoreData=false;
        	}        	
        }, 500);	    	
	    	// console.log(this.ratingsArr);
	    }	  
	  }
	}
</script>

<style lang="scss">
	body,html{background-color: #fff;}
	.shop_ratings{
		// overflow-y: auto;
		background-color: #f5f5f5;
		.overview{
			display: flex;
			background-color: #fff;
			padding: 0.2rem 0 0.3rem 0.24rem;
			margin-bottom: 0.08rem;
			.overview_left{
				display: flex;
				align-items: center;
				justify-content: space-between;
				width: 33.6vw;
				color: #666;
				.score{
					font-size: 0.36rem;
					color: #ff6000;
				}
				.star_wrapper{
					display: flex;
					flex-direction: column;
					justify-content: center;
					align-items: flex-start;
					span{
						font-size: 0.12rem;
						margin-bottom: 0.05rem;
					}
				}
			}
			.overview_right{
				flex: 1;
				display: flex;
				justify-content: space-between;
				align-items: center;
				color: #666;
				.food_score{
					flex: 1;
					display: flex;
					justify-content: space-between;
					align-items: center;
					padding: 0 0.27rem;
					&>div{
						display: flex;
						flex-direction: column;
						align-items: center;
						span{
							font-size: 0.12rem;
							margin-bottom: 0.05rem;
						}
						p{
							font-size: 0.2rem;
						}
					}
				}
				.delivery_score{
					display: flex;
					flex-direction: column;
					align-items: center;
					width: 22.933333vw;
					border-left: 1px solid #ddd;
					span{
						font-size: 0.12rem;
						margin-bottom: 0.05rem;
					}
					p{
						font-size: 0.2rem;
					}
				}
			}
		}
		.content{
			background-color: #fff;
			padding: 0.1rem 0.12rem 0;
			font-size: 0.12rem;
			.rating_tags{
				padding-bottom: 0.1rem;
				border-bottom: 1px solid #eee;
				li{
					display: inline-block;
					height: 0.28rem;
					padding: 0 0.09rem;
					margin: 0.03rem;
					border-radius: 0.02rem;
					background-color: #ebf5ff;
					color: #6d7885;
					line-height: 0.28rem;
					&.active{
						color: #fff;
						background-color: #0097ff;
					}
					&.negative{
						color: #aaa;
						background-color: #f5f5f5;
						&.active{
							color: #fff;
							background-color: #ccc;
						}
					}
				}
			}
			.switch{
				padding-left: 0.15rem;
				height: 0.4rem;
				font-size: 0.14rem;
				color: #666;
				line-height: 0.4rem;
				border-bottom: 1px solid #eee;
				&::before{
					padding-right: 0.04rem;
					color: #e8e8e8;
				}
				&.on::before{
					color: #76d572;
				}
			}
			.rating_item{
				margin-top: 0.15rem;
				padding-left: 0.4rem;
				padding-bottom: 0.12rem;
				border-bottom: 1px solid #eee;
				position: relative;
				.avatar{
					position: absolute;
					top: 0;
					left: 0;
					width: 0.3rem;
					height: 0.3rem;
					border-radius: 50%;
					overflow: hidden;
					img{
						width: 100%;
						// height: 100%;
						// margin-top: -0.3rem;
					}
				}
				.comment{
					.comment_header{
						display: flex;
						justify-content: space-between;
						align-items: center;
						.username{
							font-size: 0.13rem;
							font-weight: 400;
							margin-right: 0.06rem;
							color: #333;
						}
						.comment_time{
							font-size: 0.12rem;
							color: #999;
							transform: scale(0.9);
							transform-origin: 100% 50%;
						}
					}
					.star_wrapper{
						margin: 0.06rem 0 0.02rem;
						display: flex;
						align-items: center;
						&>span{
							display: inline-block;
							margin-left: 0.04rem;
							font-size: 0.12rem;
							color: rgb(255, 96, 0);
							transform: scale(0.9);
							transform-origin: 0 50%; 
						}
					}
					.comment_text{
						font-size: 0.14rem;
						color: #333;
						word-break: break-all;
						margin: 0.08rem 0;
					}
					.comment_pictures{
						margin: 0.04rem 0 0.12rem;
						&>li{
							margin: 0 0.02rem;
							display: inline-block;
							img{
								width: 40vw;
								height: 40vw;
							}
							&.small img{
								width: 26vw;
								height: 26vw;
							}
						}
					}
					.recommend{
						display: flex;
						flex-wrap: wrap;
						align-items: center;
						margin-bottom: -0.04rem;
						.iconfont{
							margin-right: 0.06rem;
							margin-bottom: 0.04rem;
							color: #333;
							font-size: 0.15rem;
							line-height: 0.24rem;
						}
						.details{
							height: 0.24rem;
							margin: 0 0.04rem 0.04rem 0;
							padding: 0 0.05rem;
							font-size: 0.12rem;
							text-align: center;
							line-height: 0.24rem;
							color: #6d7885;
							background-color: #ebf5ff;
							border-radius: 0.02rem;
							&>span{
								display: inline-block;
								transform: scale(0.9);
								transform-origin: 50% 50%; 
							}
						}
					}
				}
			}
			// .load-more{
			// 	display: flex;
			// 	justify-content: center;
			// 	align-items: center;
			// 	color: #666;
			// 	min-height: 0.4rem;
			// 	span:first-child{
			// 		margin-right: 0.05rem;
			// 	}
			// 	.mint-spinner-fading-circle{
			// 		// 覆盖mint Spinner的默认样式
			// 		width: 0.2rem !important;
			// 		height: 0.2rem !important;
			// 	}
			// }
			.big_pics{
				position: fixed;
				top: 0;
				left: 0;
				right: 0;
				bottom: 0;
				background-color: #000;
				z-index: 100;							
				.image_wrapper{
					position: absolute;
					top: 0;
					left: 0;
					width: 100%;
					height: 100%;
					transition: all 0.3s;
					img{
						width: 100%;
						position: relative;
						left: 0;
						top: 50%;
						transform: translate(0,-50%);
					}					
				}
				// 过渡效果
				// &.scale-enter-active{
		      // transition: all 0.3s;
				// }
		    &.scale-enter .image_wrapper, &.scale-leave-to .image_wrapper{
		      transform: scale(0.2);
		    } 	
				.name{
					position: absolute;
					left: 0.1rem;
					bottom: 0.17rem;
					font-size: 0.12rem;
					color: #fff;
				}
				.close{
					position: absolute;
					top: 0.12rem;
					right: 0.12rem;
					font-size: 0.18rem;
					color: #fff;
				}
			}
		}
	}
</style>
