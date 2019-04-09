<template>
	<div class="search">
		<div class="search-wrapper">
			<div class="input-wrapper">
				<input class="uni-input" placeholder="输入关键字" v-model="keyval" @keyup.enter="search"/>
				<i class="iconfont icon-chazhao" @click="search"></i>
			</div>
		</div>
		<div class="hestory">
			<h3 class="title">
				<span>搜索历史</span>
				<i class="iconfont icon-shanchu" @click="clear"></i>
			</h3>
			<div class="hestory-wrapper">
				<div class="hestory-item" v-for="(val, index) in hestory_keyval" :key="index" @click="open(val)">{{val}}</div>
			</div>
		</div>
	</div>
</template>

<script>
	export default {
		data() {
			return {
				hestory_keyval: [],
				keyval: ''
			};
		},
		created() {
			this.hestory_keyval = util.getStorageSync('hestory_keyval');
		},
		methods: {
			open(keyval) {
				this.$router.push('/compatibleHouse/' + keyval)
			},
			clear() {
				this.$notify({content: 'asdasdasd'});
				this.hestory_keyval = [];
				util.setStorageSync('hestory_keyval', []);
			},
			search() {
				var hestory_keyval = this.hestory_keyval
				var keyval = this.keyval;
				var outside = true;
				if(keyval) {
					// 检索是否历史存在
					hestory_keyval.forEach(val => {
						if(val === keyval) {
							outside = false;
							return;
						}
					});
					if(outside) {
						hestory_keyval.push(keyval);
						util.setStorageSync('hestory_keyval', hestory_keyval)
					}
					this.open(keyval);
				} else {
					this.$notify({
						title: '请输入内容',
						icon: 'none'
					});
				}
			
			}
		}
	}
</script>

<style lang="stylus" scoped>
.search
	width 100%
	height 100%
	background #fff
	.search-wrapper
		padding 20px
		background skyblue
		.input-wrapper
			display flex
			height 30px
			font-size 0
			.uni-input
				display block
				border none
				flex 1
				height 28px
				background-color #fff
				border-radius 50px 0 0 50px
				font-size 14px
				padding-left 10px
				color #999
				outline none
			i
				display block
				width 40px
				height 100%
				text-align center
				border-radius 0 50px 50px 0
				line-height 30px
				background #fff
				font-size 14px
				&:active
					background-color #ccc
	.hestory
		.title
			font-size 16px
			padding 10px 10px 0 10px
			i
				display inline-block
				padding 0 10px
				float right
	.hestory-wrapper
		padding 10px 20px 0 20px
		display flex
		flex-wrap wrap 
		.hestory-item
			padding 3px 10px
			font-size 12px
			span-align center
			line-height 20px
			border 1px solid #ccc
			border-radius 30px
			overflow hidden
			margin 0 4px 7px 0
			&:active
				background-color #ccc
</style>
