<template>
  <div id="app">
    <router-view></router-view>
    <!-- 通过router中的meta信息控制是否显示底部组件 -->
    <FooterGuide v-if="$route.meta.showFooter"></FooterGuide>
  </div>
</template>

<script>
  // import {mapActions} from 'vuex';
  import FooterGuide from './components/FooterGuide/FooterGuide.vue';

  export default {
    name: 'App',
    components:{
      FooterGuide
    },
    created(){
      // 通过this.$store.dispatch 方法触发调用Action
      this.$store.dispatch('getUserInfo');
      // 去掉加载动画
      document.body.removeChild(document.getElementById('loading'));          

      // //在页面加载时读取sessionStorage里的状态信息
      // if (sessionStorage.getItem("store") ) {
      //     this.$store.replaceState(Object.assign({}, this.$store.state,JSON.parse(sessionStorage.getItem("store"))))
      // } 
      // //在页面刷新时将vuex里的信息保存到sessionStorage里
      // window.addEventListener("beforeunload",()=>{
      //     sessionStorage.setItem("store",JSON.stringify(this.$store.state))
      // })
    },
    methods:{
      
    }
  }
</script>

<style>
  @import './assets/css/reset.css';
  #app{
    width: 100%;
    height: 100%;
  }
  
/*#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}*/
</style>
