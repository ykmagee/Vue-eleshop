<template>
  <div class="personal">
    <HeaderTop :to_home="true" title="我的"></HeaderTop>
    <section class="personal_info">
    	<!-- 利用router-link实现到Login组件的跳转 -->
      <router-link :to="userInfo._id ? '/userinfo': '/login'" class="personal_link">
        <div class="personal_image">
          <!-- <i class="iconfont icon-user-fill"></i> -->
          <!-- 通过改变图片margin-top值来改变sprite图的位置 -->
    			<img src="https://shadow.elemecdn.com/faas/h5/static/sprite.3ffb5d8.png" :style="{marginTop:-0.6*(Math.floor(Math.random()*6))+'rem'}">
        </div>
        <div class="info">
          <p class="info_top">{{userInfo.name || '登录/注册'}}</p>
          <p>
            <span class="info_icon">
              <i class="iconfont icon-mobile"></i>
            </span>
            <span class="info_number">{{userInfo.phone || '暂无绑定手机号'}}</span>
          </p>
        </div>
        <span class="arrow">
          <i class="iconfont icon-right"></i>
        </span>
      </router-link>
    </section>
    <section class="info_data">
      <ul class="info_data_list">
        <a href="javascript:" class="info_data_link">
          <span class="info_data_top"><span>0.00</span>元</span>
          <span class="info_data_bottom">钱包</span>
        </a>
        <a href="javascript:" class="info_data_link">
          <span class="info_data_top"><span>0</span>个</span>
          <span class="info_data_bottom">红包</span>
        </a>
        <a href="javascript:" class="info_data_link">
          <span class="info_data_top"><span>0</span>分</span>
          <span class="info_data_bottom">金币</span>
        </a>
      </ul>
    </section>
    <!-- 插入PersonalItem组件 -->
    <PersonalItem :personal_data="personal_data"></PersonalItem>
    <!-- 退出登录按钮 -->
    <section class="personal_logout" v-if="userInfo._id">
      <mt-button type="danger" style="width: 100%" @click="logout">退出登录</mt-button>
    </section>
  </div>
</template>

<script>
	import HeaderTop from '../../components/HeaderTop/HeaderTop.vue';
	import PersonalItem from './PersonalItem/PersonalItem.vue';
	import { MessageBox, Toast } from 'mint-ui';
	import { mapState } from 'vuex';
	export default {
		data(){
			return{
				personal_data:[
					[
						{
							title:'我的地址',
							icon:'icon-address',
							color:'rgb(74, 165, 240)',
							link:'/personal'
						},
						{
							title:'我的订单',
							icon:'icon-order',
							color:'rgb(102, 102, 204)',
							link:'/order'
						}
					],
					[
						{
							title:'金币商城',
							icon:'icon-shopping-mall',
							color:'rgb(148, 217, 74)',
							link:'/personal'
						},
						{
							title:'我的客服',
							icon:'icon-service',
							color:'rgb(77, 160, 240)',
							link:'/personal'
						}
					]
				]
			}
		},
	  components:{
	  	HeaderTop,
	  	PersonalItem	  	
	  },
	  mounted(){
	  	// console.log(this.userinfo);
	  },
	  computed: {
	    ...mapState(['userInfo'])
	  },
	  methods:{
	  	logout () {
	      MessageBox.confirm('确认退出吗?').then(
	      	// 确认的回调
	        action => {
	          // 请求退出
	          this.$store.dispatch('logout');
	          Toast({
	          	message: '退出成功',
	          	duration: 1200
	          });
	        },
	        // 取消的回调
	        action => {
	          // console.log('取消退出登录');
	        }
	      )
	    }
	  }
	}
</script>

<style lang="scss">
	.personal{
		width: 100%;
  	overflow: hidden;
  	.personal_info{
	  	margin-top: 0.45rem;
	  	.personal_link{
	  		display: flex;
	  		background-color: $baseColor;
	  		padding: 0.16rem 0.16rem;
	  		color: #fff;
	  		align-items: center;
	  		.personal_image{
	  			width: 0.6rem;
	  			height: 0.6rem;
	  			border-radius: 50%;
	  			background-color: #eee;
	  			text-align:center;
	  			overflow: hidden;
	  			// display: flex;
	  			// justify-content: center;
	  			// align-items: center;
	  			img{width: 100%;}
	  			// .iconfont{						
						// font-size: 0.45rem;
						// color: #bbb;
	  			// }
	  		}
	  		.info{
	  			flex: 1;
	  			margin-left: 0.2rem;
	  			overflow: hidden;
	  			.info_top{
						font-size: 0.2rem;
						font-weight: 700;
						margin-bottom: 0.08rem;
	  			}
	  			.info_icon{
	  				vertical-align: middle;
	  				.iconfont{
							font-size: 0.16rem;
	  				}
	  			}
	  			.info_number{
	  				font-size: 0.15rem;
	  			}
	  		}
	  		.arrow{
	  			.iconfont{
	  				font-size: 0.18rem;
	  			}
	  		}
	  	}
	  }
	  .info_data{
	  	width: 100%;
	  	background-color: #fff;
	  	border-bottom: 1px solid #ddd;	  	
	  	.info_data_list{
	  		display: flex;
	  		.info_data_link{
	  			// float: left;
	  			width: 33.333%;
	  			text-align: center;
	  			// vertical-align: middle;
	  			border-right: 1px solid #ddd;
	  			padding: 0.2rem 0;
	  			display: flex;
	  			flex-direction: column;
	  			&:last-child{
	  				border-right: none;
	  			}
	  			.info_data_top{
	  				font-size: 0.14rem;
	  				color: rgb(0, 152, 251);
	  				margin-bottom: 0.05rem;
	  				span{
	  					font-size: 0.26rem;
	  					font-weight: 700;
	  				}
	  			}
	  			.info_data_bottom{
	  				font-size: 0.14rem;
	  				color: #666;
	  				font-weight: 600;
	  			}
	  			&:nth-child(2){
	  				.info_data_top{
	  					color: rgb(255, 95, 62);
	  				}
	  			}
	  			&:nth-child(3){
	  				.info_data_top{
	  					color: rgb(106, 194, 11);
	  				}
	  			}
	  		}
	  	}
	  }
	  .personal_logout{
	  	margin-top: 0.1rem;
	  }
	} 
</style>
