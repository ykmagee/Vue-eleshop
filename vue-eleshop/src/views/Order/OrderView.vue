<template>
  <div class="order">
    <HeaderTop :to_home="true" title="订单列表"></HeaderTop>
    <section class="order_no_login" v-if="!user_id">
      <img src="./images/person.png">
      <h3>登录后查看外卖订单</h3>
      <button @click.prevent="toLogin">立即登陆</button>
    </section>
    <section class="order_login" v-else>
      <p>您目前还没有订单记录哦</p>
    </section>
  </div>
</template>

<script>
	import { mapState } from 'vuex';
	import HeaderTop from '../../components/HeaderTop/HeaderTop.vue';
	export default {
		data(){
			return {
				user_id: ''
			}
		},
	  components:{
	  	HeaderTop	  	
	  },
	  mounted(){
			const user_id = sessionStorage.getItem("user_id");
			if (user_id) {
				this.user_id = user_id;
			}
	  },
	  computed:{
	    // ...mapState(['userInfo'])
	  },
	  methods:{
	  	toLogin(){
	  		this.$router.push({path:'/login'});
	  	}	  	
	  }
	}
</script>

<style lang="scss">
	.order{
		width: 100%;
		.order_no_login{
			width: 100%;
			padding-top: 0.6rem;
			margin: 0 auto;
			text-align: center;
			&>img{
				// width: 60%;				
				width: 2rem;				
				height: 2rem;				
			}
			&>h3{
				padding: 0.15rem 0;
				font-size: 0.16rem;
				color: #666;
				font-weight: normal;
			} 
			&>button{
				font-size: 0.14rem;
				color: #fff;
				background-color: $baseColor;
				border: none;
				outline: none;
				border-radius: 0.05rem;
				padding: 0.1rem 0.16rem;
			}
		}
		.order_login{
			width: 100%;
			padding-top: 0.6rem;
			margin: 0 auto;
			text-align: center;
			&>p{
				font-size: 0.14rem;
				color: #333;
			}
		}
	}
</style>
