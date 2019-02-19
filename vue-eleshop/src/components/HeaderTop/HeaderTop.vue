<template>
  <header class="header">
  	<!-- slot插槽实现内容分发：可将组件内容放到子组件指定的位置 -->
  	<slot name="left"></slot>
  	<router-link class="to_home" to="/home" v-if="to_home">
			<i class="iconfont icon-left"></i>
		</router-link>
  	<div class="header_title">
  		<span class="header_title_text ellipsis">{{ title }}</span>
  	</div>
  	<slot name="right"></slot>
  </header>
</template>

<script>
	export default {
	  props:{
	  	title:String,
	  	to_home:Boolean
	  }
	}
</script>

<style lang="scss">
	.header{
		position: fixed;
		left: 0;
		top: 0;
		z-index: 300;
		width: 100%;
		height: 0.45rem;
		color: #fff;
		background-color: $baseColor;  // 基色
		.to_home{	
			position: relative;		
			display: inline-block;
			width: 12%;
			height: 100%;
			text-align: center;
			.iconfont{
				position: absolute;
				left: 50%;
				top: 50%;
				transform: translate(-50%,-50%);
				font-size: 0.24rem;
				color: #fff;
			}
		}
		.header_title{
			position: absolute;
			top: 50%;
			left: 50%;
			transform: translate(-50%,-50%);			
			width: 50%;
			text-align: center;
			.header_title_text{
				font-size: 0.18rem;
				display: block;
			}
		}
	}  
</style>
