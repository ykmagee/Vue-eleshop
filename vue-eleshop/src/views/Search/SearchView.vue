<template>
  <div class="search">
    <HeaderTop :to_home="true" title=""></HeaderTop>
    <!-- '.prevent'让提交事件不再重载页面 -->
    <form class="search_form" @submit.prevent="search()">
    	<i class="iconfont icon-search"></i>
      <input type="search" placeholder="请输入商家、商品名称" class="search_input" v-model="keyword">
      <input type="submit" class="search_submit" value="搜索">
    </form>
    <section class="search_history" v-if="!showResult">
		  <section class="history" v-if="searchHistory.length">
		    <header class="title">
		    	<span>历史搜索</span>
		      <div aria-label="清除历史搜索" class="clear iconfont icon-clear" @click="clearHistory">	</div>
		    </header>
		    <section class="search_items">
		    	<button class="item" v-for="(item,index) in searchHistory" :key="index" @click="search(item)">{{ item }}</button>
		    </section>
		  </section>
		  <section class="hot">
		    <header class="title">热门搜索</header>
		    <section class="search_items">
		    	<button class="item" v-for="(item,index) in hotSearch" :key="index" @click="search(item)">{{ item }}</button>
		    	</section>
		  </section>
    </section>
    <section class="search_result" v-else>
    	<!--商家列表组件,搜索有结果时显示-->
			<ShopList :shops="searchShops" :presetImg="false" v-if="!noSearchShops"></ShopList>
			<!-- 搜索没有结果时显示 -->
			<div class="no_result" v-else>
				<img src="./images/no-result.png">
				<div class="text">
					<p>很抱歉！附近没有搜索结果</p>
					<p>换个关键词试试吧</p>
				</div>			
			</div>
			<LoadMore :hasMoreData="hasMoreData" v-if="!noSearchShops"/>
    </section>	    
  </div>
</template>

<script>
	import {mapState} from 'vuex';
	// localStorage插件
	import Store from 'store';
	import HeaderTop from '../../components/HeaderTop/HeaderTop.vue';
	import ShopList from '../../components/ShopList/ShopList.vue';
	import LoadMore from '../../components/LoadMore/LoadMore.vue';
	import { reqUpdateHistory } from '../../api';
	export default {
		data () {
	    return {
	      keyword: '', // 输入的搜索关键词   
	      noSearchShops: false, // 是否有搜索结果，true表示没有结果
	      showResult: false, // 是否显示搜索结果页面，true为显示
	      hasMoreData: true, // 是否还有更多搜索结果
	      searchHistory: [], // 搜索历史
	      hotSearch: ['面','饭','饺子'] // 热门搜索
	    }
	  },

	  components:{
	  	HeaderTop,
	  	ShopList,
	  	LoadMore	  	
	  },

	  mounted(){	  	
	  	// 读取本地搜索历史记录	  	
	  	const localSearch = Store.get('searchHistory');
	  	if (localSearch) {
	  		this.searchHistory = localSearch;
	  	}
	  	// const userId=sessionStorage.getItem("user_id");
	  	// this.$nextTick(()=>{
	  	// 	// 若用户已登录则获取用户信息中的搜索历史
	  	// 	if (userId) {
	  	// 		this.searchHistory=this.userInfo.searchHistory;
	  	// 	}
	  	// 	// 若用户没有登录则获取本地的搜索历史
	  	// 	if (!userId && localSearch) {
		  // 		this.searchHistory=localSearch;	  		
		  // 	}
	  	// })	  	
	  },

	  computed: {
	    ...mapState(['searchShops','userInfo'])	  
	  },

	  methods: {
	    search (tagName) {
	    	// 如果点击了搜索标签，将标签名作为keyword进行搜索
	    	if (tagName) {
	    		this.keyword=tagName;
	    	}
	      // 得到搜索关键字  trim()方法会从一个字符串的两端删除空白字符
	      const keyword = this.keyword.trim();
	      // 进行搜索
	      if (keyword) {
	      	this.hasMoreData=true;
	      	// 显示搜索结果页面
	      	this.showResult=true;
	      	// 重置noSearchShops
	      	this.noSearchShops = false;
	      	// 清空searchShops
	      	this.$store.dispatch('clearSearchShops');
	      	// 进行搜索
	        this.$store.dispatch('searchShops', {keyword, callback:()=>{	       
	        	this.$nextTick(()=>{
	        		this.hasMoreData=false;
	        		if (!this.searchShops.length) { // 没有数据
				        this.noSearchShops = true
				      } else { // 有数据
				        this.noSearchShops = false
				      }
	        	})
	        }});
	        // 判断keyword是否已存在于searchHistory中
	        let findIndex=this.searchHistory.findIndex((value)=>{
	        	return value===keyword;
	        });
	        // 如果keyword还没有搜索过，就添加到searchHistory中并更新相关数据
	        if (findIndex === -1) {
	        	// 保证搜索历史数组长度为10
	        	if (this.searchHistory.length<=9) {
	        		this.searchHistory.unshift(keyword);
	        	}else{
	        		this.searchHistory.pop();
	        		this.searchHistory.unshift(keyword);
	        	}
	        	// 若用户已登录则将搜索历史(searchHistory)在vuex和数据库中更新
	        	if (this.userInfo._id) {
	        		this.$options.methods.updateHistory.bind(this)();
	        	}	        	
        		// 将搜索历史记录保存到本地localStorage
        		Store.set('searchHistory',this.searchHistory);
	        }	        
	      }
	    },
	    // 清空搜索历史
	    clearHistory () {
	    	this.searchHistory=[];
	    	if (this.userInfo._id) {
	    		this.$options.methods.updateHistory.bind(this)();
	    	}
	    	Store.remove('searchHistory');
	    },
	    // 已登录用户更新searchHistory
	    async updateHistory(){	    	
    		// 更新vuex中的用户搜索信息
    		this.$store.dispatch('updateSearchHistory',this.searchHistory);
    		// 更新数据库中的用户搜索信息
    		try{
    			await reqUpdateHistory(this.userInfo._id, this.searchHistory);
    		} catch(err){
    			console.log(err);
    		}    		
	    }
	  },

	  watch: {	    
	    keyword (value) {
	    	// 搜索关键词为空时关闭搜索结果页面
	    	if (!value) {
	    		this.showResult=false;
	    	}
	    }
	  }
	}
</script>

<style lang="scss">
	.search{
		background-color: #fff;
		position: relative;
		width: 100%;
		height: calc(100% - 0.5rem);
		// overflow: hidden;
		.search_form{
			position: fixed;
			// left: 0;
			// top: 0.45rem;
			left: 13vw;
			top: 0.075rem;
			width: 87vw;
			// margin-top: 0.45rem;
			// padding: 0.12rem 0.08rem;
			// background-color: #fff;
			display: flex;	
			z-index: 300;		
			.iconfont{
				position: absolute;
				left: 0.09rem;
				top: 50%;
				transform: translateY(-45%);
				color: #666;
				font-size: 0.14rem;
			}
			input{
				height: 0.3rem;
				padding: 0 0.04rem;
				border-radius: 0.02rem;
				&.search_input{
					// flex: 5.5;
					flex: 1;
					background-color: #f5f5f5; 
					color: #666;
					font-size: 0.14rem;
					padding-left: 0.30rem;
				}
				&.search_submit{
					// flex: 1;
					width: 0.5rem;
					background-color: $baseColor;
					// background-color: #f5f5f5;
					// color: $baseColor;
					color: #fff;
					font-size: 0.16rem;
					font-weight: bold;
					margin-left: 0.06rem;
				}					
			}
		}
		.search_history{
			padding-top: 0.45rem;
			background-color: #fff;
			height: 100%;
			&>section{
				margin-top: 0.1rem;
			}
			.title{
				font-size: 0.16rem;
				padding: 0.06rem 0.12rem;
				font-weight: 700;
				color: #666;
				display: flex;
				justify-content: space-between;
				.clear{
					font-size: 0.16rem;
					font-weight: normal;
					color: #aaa;
					width: 0.2rem;
					text-align: center;
				}
			}
			.search_items{
				padding: 0 0.12rem 0.12rem;
				.item{
					display: inline-block;
					padding: 0.06rem 0.1rem;
					margin: 0.12rem 0.12rem 0 0;
					border-radius: 0.02rem;
					background-color: #f7f7f7;
					font-size: 0.14rem;
					color: #666;
				}
			}
		}
		.search_result{
			padding-bottom: 0.5rem;
		}
		.shop_container{
			// margin-top: 1.04rem;
			padding-top: 0.45rem;
			background-color: #fff;
		}
		.no_result{
			// margin-top: 1.04rem;
			padding-top: 0.45rem;
			display: flex;
			justify-content: center;
			align-items: center;
			height: 1.55rem;
			background-color: #fff;
			img{
				width: 1rem;
			}
			.text p{
				&:first-child{
					margin-bottom: 0.06rem;
					color: #666;
					font-size: 0.14rem;
				}
				&:last-child{
					color: #999;
					font-size: 0.12rem;
				}
			}
		}
	}
</style>
