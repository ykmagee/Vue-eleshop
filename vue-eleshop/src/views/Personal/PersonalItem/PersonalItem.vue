<template>
  <section class="personal_items">
  	<div class="personal_item" v-for="(item,index) in personal_data" :key="index">
  		<router-link class="item_link" v-for="(data,index) in item" :to="data.link" :key="index">
  			<i class="iconfont" :class="data.icon" :style="{color:data.color}"></i>
  			<div class="item_link_right">
  				<span>{{ data.title }}</span>
  				<i class="iconfont icon-right"></i>
  			</div>
  		</router-link>
  	</div>
  </section>
</template>

<script>
	export default {
	  props:{
	  	personal_data:Array
	  }
	}
</script>

<style lang="scss">
	.personal_items{
		width: 100%;
		overflow: hidden;		
		.personal_item{
			margin-top: 0.1rem;
			background-color: #fff;
			border-top: 1px solid #ddd;
			border-bottom: 1px solid #ddd;
			.item_link{
				display: flex;
				align-items: center;
				padding-left: 0.14rem;
				&>.iconfont{
					font-size: 0.18rem;
				}
				.item_link_right{
					display: flex;
					justify-content: space-between;
					flex: 1;
					padding: 0.14rem 0.1rem 0.14rem 0;
					margin-left: 0.14rem;
					border-bottom: 1px solid #eee;
					&>span{
						font-size: 0.16rem;
						color: #333;
					}
					&>.iconfont{
						font-size: 0.16rem;
						color: #aaa;
					}
				}
				&:last-child .item_link_right{
					border-bottom: none;
				}
			}			
		}
	}
</style>
