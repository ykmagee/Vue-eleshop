<template>
  <div class="shop">
  	<!-- 插入店铺头部组件 -->
    <ShopHeader></ShopHeader>
    <div class="tab">
    	<div class="tab_item">
    		<!-- 使用replace的方式进行路由切换时，不会向history里面添加新的记录 -->
    		<router-link to="goods" replace active-class="active">点餐</router-link to>
    	</div>
    	<div class="tab_item">
    		<router-link to="ratings" replace active-class="active">评价</router-link to>
    	</div>
    	<div class="tab_item">
    		<router-link to="info" replace active-class="active">商家</router-link to>
    	</div>
    </div>
    <!-- 缓存路由组件对象 -->
    <keep-alive>
    	<router-view></router-view>
    </keep-alive>    
  </div>
</template>

<script>
	import ShopHeader from './ShopHeader/ShopHeader.vue';
	export default {
		mounted () {
	    this.$store.dispatch('getShopInfo')
	  },
	  components:{
	  	ShopHeader	  	
	  }
	}
</script>

<style lang="scss">
	.tab{
		position: sticky;
		top: 0;
		display: flex;
		background-color: #fff;
		z-index: 2;
		.tab_item{
			position: relative;
			flex: 1;
			text-align: center;
			font-size: 0.15rem;
			color: #666;
			border-bottom: 1px solid #ebebeb;
			line-height: 0.4rem;
			font-weight: 700;
			a{
				color: #666;
				display: inline-block;
				position: relative;
				&.active{
					color: $baseColor;
					&::after{
						content:'';
						position: absolute;
						left: 0;
						bottom: 0;
						width: 100%;
						height: 0.02rem;
						background-color: $baseColor;
					}
				}				
			}
		}
	}
</style>
