<template>
  <div class="city_wrapper">
    <div>
      <!-- 头部组件 -->
      <HeaderTop title="城市选择" :to_home="false">
        <a class="to_home" slot="left" @click="back">
          <i class="iconfont icon-left"></i>
        </a>      
      </HeaderTop>
      <div class="city_search">
        <i class="iconfont icon-search"></i>
        <input type="text" placeholder="输入城市名或者拼音" v-model="keyWord" @input="searchCity">
      </div>
    </div>
  	<mt-index-list v-if="!keyWord">
      <!-- 当前定位城市 -->
      <mt-index-section index="">
        <mt-cell :title="currentCity"></mt-cell>
      </mt-index-section>
      <!-- 所有城市列表 -->
      <mt-index-section v-for="(item,index) in cityData" :key="index" :index="item.name">
        <!-- mt-cell组件无法直接绑定click事件，在外层添加一层div即可 -->
        <div v-for="(city,index) in item.cities" :key="index" @click="chooseCity(city.name)">
          <mt-cell :title="city.name"></mt-cell>
        </div>       
      </mt-index-section>      
    </mt-index-list>
    <div class="search_results" v-else>
      <div class="results" v-if="searchList.length">
        <div v-for="(city,index) in searchList" :key="index" @click="chooseCity(city.name)">
          <p>{{city.name}}</p>
        </div>
      </div>
      <div class="none" v-else>
        <p>很抱歉！没有搜索结果</p>
        <p>换个关键词试试吧</p>
      </div>
    </div>
  </div>
</template>

<script>
	import { mapState } from 'vuex';
  import HeaderTop from '../../../components/HeaderTop/HeaderTop.vue';
  import cityData from './data/city.js';
  import Vue from 'vue';
  import { IndexList, IndexSection, Cell } from 'mint-ui';
  Vue.component(IndexList.name, IndexList);
  Vue.component(IndexSection.name, IndexSection);
  Vue.component(Cell.name, Cell);
	// import VueCity from 'vue-city';
	export default {
		data(){
			return {
        cityData: cityData, //所有城市数据
        keyWord: '', //搜索框输入的城市名
        searchList: [], //搜索结果
			}
		},
	  components:{
	  	HeaderTop	  	
	  },
	  mounted(){
			let mintIndex=document.getElementsByClassName('mint-indexsection')[0];
      mintIndex.children[0].innerHTML='当前定位城市';
	  },
	  computed:{
	    ...mapState(['currentCity'])
	  },
    watch:{
      
    },
	  methods:{
	  	back(){
	  		this.$parent.showCity=false;
        this.$parent.showAddress=true;
	  	},
      // 点选城市
      chooseCity(city){
        // 更新vuex中的curreCity
        city = city.split('市')[0];
        this.$store.dispatch('recordCurrentCity',city);
        this.back();
      },
      // 搜索城市并显示结果
      searchCity(){
        var reg = new RegExp(this.keyWord == '' ? 'xxyy' : this.keyWord, 'ig');
        var _arr = [];
        for(var i in this.cityData){
            for(var j = 0; j < this.cityData[i].cities.length; j++){
                if(
                    reg.test(this.cityData[i].cities[j]['tags'])
                ){
                    _arr.push(this.cityData[i].cities[j]);
                }
            }
        }
        this.searchList = _arr;
      }
	  }
	}
</script>

<style lang="scss">
	.city_wrapper{
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    z-index: 1000;
    overflow: auto;
    background-color: #fff;
    .header{
      position: relative;
    }
    .city_search{
      height: 0.44rem;
      background-color: $baseColor;
      text-align: center;
      position: relative;
      input{
        width: 80vw;
        height: 0.28rem;
        margin-top: 0.08rem;
        border-radius: 0.14rem;
        padding-left: 0.3rem;
        font-size: 0.13rem;
      }
      .iconfont{
        font-size: 0.16rem;
        position: absolute;
        top: 50%;
        left: 12.6vw;
        transform: translateY(-50%);
      }
    }
    // 更改mint-ui默认样式
    .mint-indexlist{
      .mint-indexlist-content{
        height: calc(100vh - 1.39rem) !important;
        // padding-bottom: 0.5rem;
        margin-right: 0.28rem !important;
        .mint-indexsection{
          .mint-indexsection-index{
            padding: 0.1rem;
            background-color: #f5f5f5;
          }
          .mint-cell{
            height: 0.48rem;
            .mint-cell-wrapper{
              font-size: 0.14rem;
              padding: 0 0.12rem;
              line-height: 0.48rem;
            }
          }
        }
      }
      .mint-indexlist-nav{
        .mint-indexlist-navitem{
          width: 0.28rem;
          padding: 0.02rem 0;
          font-size: 0.12rem;
          text-align: center;
        }
      }
    }
    .search_results{
      .results{
        height: calc(100vh - 1.4rem);
        overflow-y: auto;
        &>div{
          height: 0.5rem;
          margin-left: 0.15rem;
          font-size: 0.12rem;
          line-height: 0.5rem;
          border-bottom: 1px solid #ddd;
        }
      }
      .none{
        margin: 0.15rem 0;
        text-align: center;
        font-size: 0.14rem;
        p{
          margin-bottom: 0.05rem;
          color: #555;
        }
      }
    }
  }
</style>
