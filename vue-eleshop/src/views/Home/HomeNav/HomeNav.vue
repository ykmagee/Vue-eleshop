<template>  
  <nav class="home_nav">
    <!-- mint-ui中的swipe -->
    <mt-swipe :auto="0" v-if="categorys.length">
      <mt-swipe-item class="swipe_slide" v-for="(pages,index) in categorysArr" :key="index">
        <a href="javascript:;" class="link_to_food" v-for="(data,index) in pages" :key="index">
          <div class="food_container">
            <img :src="baseImageUrl+data.image_url">
          </div>
          <span>{{ data.title }}</span>
        </a>
      </mt-swipe-item>      
    </mt-swipe>
    <img src="../images/home_back.svg" alt="back" v-else>
  </nav>
</template>

<script>

  import Vue from 'vue';

  //按需引入mint-ui中的swipe
  import { Swipe, SwipeItem } from 'mint-ui';
  Vue.component(Swipe.name, Swipe);
  Vue.component(SwipeItem.name, SwipeItem);

  // 利用mapState语法糖去读取state对象
  import {mapState} from 'vuex';

	export default {
	  data(){
      return {
        baseImageUrl: 'https://fuss10.elemecdn.com'
      }
    },
    computed:{
      ...mapState(['categorys']),

      /*
      根据categorys一维数组生成一个2维数组
      小数组中的元素个数最大是8
      */
      categorysArr(){
        // 1.先从当前组件中得到所有食品分类的一维数组
        const {categorys} = this;
        const len =categorys.length;
        const n=8;
        let lineNum = len % n === 0 ? len / n : Math.floor( (len / n) + 1 );
        let newArr=[];
        for (let i = 0; i < lineNum; i++) {
          // slice() 方法返回一个从开始到结束（不包括结束）选择的数组的一部分浅拷贝到一个新数组对象。且原始数组不会被修改。
          let temp = categorys.slice(i*n, i*n+n);
          newArr.push(temp);
        }
        return newArr;
      }
    },
    mounted(){      
      this.$store.dispatch('getCategorys');
      // console.log(this.$store.state.categorys);
    }
	}
</script>

<style lang="scss">
  /*引入公共样式*/
  @import "../../../assets/css/mixins.scss";

  .home_nav{
    height: 2rem;
    margin-top: 0.45rem;
    background-color: #fff;
    @include bottom-border-1px($bc);
    .swipe_slide{      
      .link_to_food{
        display: inline-block;
        width: 25%;
        text-align: center;
        margin-top: 0.12rem;
        .food_container{
          img{
            width: 0.5rem;
            height: 0.5rem;
          }
        }
        span{
          font-size: 0.13rem;
          color: #666;
          display: block;
          margin-top: 0.05rem;
        }
      }    
    }
    .mint-swipe-indicators{
      bottom: 0.08rem;
    }
    .mint-swipe-indicator{
      width: 0.12rem;
      height: 0.02rem;
      border-radius: 0;
      &.is-active{
        background-color: $baseColor;
        opacity: 0.7;
      }
    }
  }
</style>
