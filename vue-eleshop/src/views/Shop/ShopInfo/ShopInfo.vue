<template>
  <div class="shop_info">
    <div class="info_content">
      <section class="section">
        <h3 class="section_title">配送信息</h3>
        <div class="delivery">
          <div v-if="info.delivery_mode">
            <span class="delivery_icon" v-if="info.delivery_mode.id===1">{{info.delivery_mode.text}}</span>
            <span  v-if="info.delivery_mode.id===1">约{{info.deliveryTime}}分钟送达，距离{{info.distance}}</span>
            <span  v-if="info.delivery_mode.id!==1">由{{info.delivery_mode.text}}提供配送，约{{info.deliveryTime}}分钟送达，距离{{info.distance}}</span>
          </div>
          <div class="delivery_money">配送费￥{{info.deliveryPrice}}</div>
        </div>
      </section>
      <section class="section">
        <h3 class="section_title">活动与服务</h3>
        <ul class="activity">
  				<li class="activity_item" v-for="(support,index) in info.supports" :key="index">
  					<span class="tag" :class="supportColor[support.type]">{{ support.name }}</span>
  					<span class="detail ellipsis">{{ support.content }}</span>
  				</li>
  			</ul>       
      </section>
      <section class="section" v-if="info.pics!==undefined&&info.pics.length>0">
        <h3 class="section_title">商家实景</h3>
        <div class="pic_wrapper">
          <ul class="pic_list" ref="picsUl">
            <li class="pic_item" v-for="(pic, index) in info.pics" :key="index" @click="showPic(pic)">
              <img :src="pic"/>
            </li>
          </ul>
        </div>
      </section>
      <section class="section">
        <h3 class="section_title">商家信息</h3>
        <ul class="detail">
          <li v-if="info.description">{{info.description}}</li>
          <li v-if="!info.description">暂无简介</li>
          <li><span class="bold">品类</span> <span>{{info.category}}</span></li>
          <li><span class="bold">商家电话</span> <span>{{info.phone}}</span></li>
          <li><span class="bold">地址</span> <span>{{info.address}}</span></li>
          <li><span class="bold">营业时间</span> <span>{{info.workTime}}</span></li>
        </ul>
      </section>
    </div>
    <!-- 实景大图容器 -->
  	<transition name="scale">
  		<div class="big_pics" v-if="showBigPic" @click="showBigPic=false">  			
  			<div class="image_wrapper">
  				<img :src="currentPic">
  			</div>
  			<div class="close iconfont icon-close"></div>
  		</div>
		</transition>
  </div>
</template>

<script>
	import {mapState} from 'vuex';
	import BetterScroll from 'better-scroll';

	export default {
		data(){
			return{
				supportColor: ['activity-green', 'activity-red', 'activity-orange'],
				showBigPic: false,
				currentPic: ''
			}
		},
	  components:{
	  		  	
	  },
	  mounted(){
	  	// console.log(this.info.length,this.info.pics);
	  	// 有数据时创建BetterScroll
	  	if (this.info.pics) {
      	this._initScroll();
      }	  	
  	},
	  computed:{
	  	...mapState(['info'])
	  },
	  methods:{
	  	_initScroll () {
	      // 动态计算ul的宽度
	      const ul = this.$refs.picsUl;
	      const liWidth = 1.2;
	      const space = 0.07;
	      let count = 1;
	      if (this.info.pics.length!==0) {
	      	count=this.info.pics.length;
	      }
	      // const count = this.info.pics.length;
	      ul.style.width = (liWidth + space) * count - space + 'rem';
	      this.$nextTick(()=>{
	      	if (!this.scroll) {
	      		this.scroll=new BetterScroll('.pic_wrapper', {
			        scrollX: true, // 水平滑动
			        // click: true,
			        eventPassthrough: 'vertical' // 垂直方向保留原生滚动
			      })
	      	}else{
	      		this.scroll.refresh();
	      	}
	      })	      
	    },
	    showPic (pic) {
	    	this.currentPic=pic;
	    	this.showBigPic=true;
	    }
	  },
	  watch:{
	  	info () { // 监测info 更新数据时重置BetterScroll
	      this.$nextTick(() => {
	        this._initScroll();
	      })
	    }
	  }
	}
</script>

<style lang="scss">
	.shop_info{
		font-size: 0.13rem;
		background-color: #f5f5f5;
		overflow-y: auto;
		.section{
			padding: 0.15rem;
			margin-bottom: 0.1rem;
			background-color: #fff;
			color: #666;
			border-bottom: 1px solid #eee;
			.section_title{
				font-size: 0.15rem;
				color: #000;
				font-weight: 700;
				line-height: 0.2rem;
			}
			.delivery{
				margin-top: 0.16rem;
				&>div{
					margin-bottom: 0.06rem;
				}
				.delivery_icon{
					display: inline-block;
					margin-right: 0.08rem;
					font-size: 0.12rem;
					color: #fff;
					background-color: #0097ff;
					border-radius: 0.03rem;
					padding: 0.02rem 0.03rem;
					text-align: center;
				}
			}
			.activity{
				margin-top: 0.16rem;
				.activity_item{
					margin-bottom: 0.11rem;
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
			.pic_wrapper{
				margin-top: 0.08rem;
				width: 100%;
				overflow: hidden;
				// overflow-x: auto;
				white-space: nowrap;
				touch-action: none;
				.pic_item{
					width: 1.2rem;
					height: 0.9rem;
					margin-right: 0.07rem;
					display: inline-block;
					&:last-child{
						margin-right: 0;
					}
					img{
						width: 100%;
						height: 100%;
						object-fit: cover;
					}
				}
			}
			.detail{
				li{
					display: flex;
					padding: 0.15rem 0;
					justify-content: space-between;
					align-items: center;
					&:not(:first-child){
						border-top: 1px solid #ddd;
					}
					&:last-child{
						padding-bottom: 0;
					}
					.bold{
						color: #333;
						font-weight: 700;
					}
					span:last-child{
						max-width: 60vw;
						text-align: right;
					}
				}
			}
		}
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
			.close{
				position: absolute;
				top: 0.12rem;
				right: 0.12rem;
				font-size: 0.18rem;
				color: #fff;
			}
		}
	}
</style>
