<template>
  <div class="rating_star">
    <div class="star_gray">
    	<img src="./images/star-gray.svg">
    </div>
    <!-- 根据评分值rating，改变亮星图片所在div的宽度 -->
    <div class="star_light" :style="{width:rating/5*100+'%'}">
    	<img src="./images/star-light.svg">
    </div>
  </div>
</template>

<script>
	export default {
	  props:{
	  	rating:Number
	  }
	}
</script>

<style lang="scss">
  .rating_star{
  	position: relative;
  	display: inline-block;  	
  	.star_light{
  		position: absolute;
  		left: 0;
  		top: 0;
  		overflow: hidden;
  		width: 90%;
  	}
  	img{  		
  		height: 0.1rem;
  		display: block;
  	}
  }
</style>
