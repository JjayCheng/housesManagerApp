<template>
	<transition name="fade"  v-on:after-leave="afterLeave">
		<div class="choice-wrapper" v-show="show" @click="show = false">
			<div class="choice-box">
				<div class="title">{{title}}</div>
				<div class="choice-list">
          <div class="choice-item"
					v-for="(item, index) in list" :key="item"
					@click="choiced = index" >{{item}}</div>
        </div>
			</div>
		</div>
	</transition>
	
</template>

<script>
	export default {
		props: ['title','list', 'method'],
		data() {
			return {
				show: false,
				choiced: -1
			};
		},
		mounted() {
			this.show = true;
			window.keyBack = () => {
				this.show = false;
			}
		},
		methods: {
			afterLeave() {
				this.$destroy();
				this.$el.remove();
				window.keyBack = util.defaultBack;
				this.choiced > -1 && this.method(this.choiced);
			}
		}
	}
</script>

<style lang="stylus">
.choice-wrapper
	position absolute
	width 100%
	height 100%
	top 0
	left 0
	background rgba(0,0,0,0.5)
	display flex
	flex-direction column
	justify-content center
	.choice-box
		width 70%
		padding 10px 0
		background #fff
		margin auto
		text-align center
		border-radius 10px
		.title
			font-size 16px
			padding 10px 0 15px 0
		.choice-list
			.choice-item
				border-top 1px solid #eee
				padding 15px 0px
				&:active
					background #eee
</style>
