<template>
  <!-- 滚动到底部的加载提示 -->
	<p class="load-more">
		<!-- mint-ui加载动画 -->
    <mt-spinner type="fading-circle" color="#6666CC" v-if="hasMoreData"></mt-spinner>
    <span v-if="hasMoreData">正在加载...</span>
    <span v-if="!hasMoreData">没有更多了哦~</span>
  </p>
</template>

<script>
	import Vue from 'vue';
	import {Spinner} from 'mint-ui';
	Vue.component(Spinner.name, Spinner);
	export default {
	  props:{
	  	hasMoreData:Boolean
	  },
	  methods:{
	  	
	  }
	}
</script>

<style lang="scss">
	.load-more{
		display: flex;
		justify-content: center;
		align-items: center;
		color: #666;
		background-color: #fff;
		min-height: 0.4rem;
		span:first-child{
			margin-right: 0.05rem;
		}
		.mint-spinner-fading-circle{
			// 覆盖mint Spinner的默认样式
			width: 0.2rem !important;
			height: 0.2rem !important;
		}
	}
</style>
