<template>
  <div class="control_button">
  	<transition name="move">
  		<div class="iconfont icon-reduce" v-if="food.count" @click.stop="updateFoodCount(false)"></div>
  	</transition>
  	<div class="count" v-if="food.count">{{food.count}}</div>
  	<div class="iconfont icon-add" @click.stop="updateFoodCount(true)"></div>
  </div>
</template>

<script>
	export default {
	  props:{
	  	food:Object
	  },
	  methods:{
	  	updateFoodCount(isAdd){
	  		this.$store.dispatch('updateFoodCount',{isAdd,food:this.food})
	  	}
	  }
	}
</script>

<style lang="scss">
	.control_button{
		display: inline-flex;
		align-items: center;
		line-height: 1;
		.iconfont{
			font-size: 0.21rem;
			color: $baseColor;
			// display: inline-block;	
			&.move-enter-active, &.move-leave-active{
        transition: all 0.2s;
			}
      &.move-enter, &.move-leave-to{
        opacity: 0;
        transform: translateX(15px) rotate(180deg);
      }  	
		}
		.count{
			font-size: 0.15rem;
			text-align: center;
			color: rgba(0,0,0,.87);
			min-width: 0.25rem;
		}
	}
</style>
