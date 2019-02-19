<template>
	<footer class="footer_wrapper">
		<footer class="footer_guide border_1px">
			<router-link to="/home" class="guide_item" active-class="active">
				<span class="item_icon">
					<i class="iconfont icon-order-meal"></i>
				</span>
				<span>首页</span>
			</router-link>
			<router-link to="/search" class="guide_item" active-class="active">
				<span class="item_icon">
					<i class="iconfont icon-search-1"></i>
				</span>
				<span>搜索</span>
			</router-link>
			<router-link to="/order" class="guide_item" active-class="active">
				<span class="item_icon">
					<i class="iconfont icon-order-1"></i>
				</span>
				<span>订单</span>
			</router-link>
			<router-link to="/personal" class="guide_item" active-class="active">
				<span class="item_icon">
					<i class="iconfont icon-user-1"></i>
				</span>
				<span>我的</span>
			</router-link>
		</footer>
	</footer>
	  
</template>

<script>
	export default {
	  methods:{
	  	
	  }
	}
</script>

<style lang="scss">

  /*引入公共样式*/
	@import "../../assets/css/mixins.scss";
	.footer_wrapper{
		height: 0.5rem;
	}
	.footer_guide{
		@include top-border-1px($bc);
		position: fixed;
		left: 0;
		right: 0;
		bottom: 0;
		background-color: #fff;
		width: 100%;
		height: 0.5rem;
		z-index: 3000;
		display: flex;
		justify-content: space-between;
		.guide_item{
			display: flex;
			flex: 1;
			flex-direction: column;
			text-align: center;
			color: #999;
			padding-top: 0.05rem;
			// margin: 5px;
			&.active{
				//统一的基色
				color: $baseColor;
			}
			span{
				font-size: 0.14rem;
				// margin-bottom: 0.02rem;
				.iconfont{
					font-size: 0.22rem;
				}
			}
		}
	}
</style>
