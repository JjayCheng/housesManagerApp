<template>
	<transition name="fade"  v-on:after-leave="afterLeave">
		<div class="prompt-wrapper" v-show="show" @click="show = false">
			<div class="prompt-box">
				<div class="content">{{content}}</div>
				<div class="btn-wrapper">
					<button class="btn cancle default">取消</button>
					<button class="btn confirm primary" @click="confirm = true">确认</button>
				</div>
			</div>
		</div>
	</transition>
	
</template>

<script>
	export default {
		props: ['content','cancle_true'],
		data() {
			return {
				show: false,
				confirm: false
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
				this.confirm && this.cancle_true();
			}
		}
	}
</script>

<style lang="stylus">
.prompt-wrapper
	position absolute
	width 100%
	height 100%
	top 0
	left 0
	background rgba(0,0,0,0.5)
	display flex
	flex-direction column
	justify-content center
	.prompt-box
		width 70%
		background #fff
		margin auto
		text-align center
		border-radius 10px
		.content
			font-size 16px
			margin 40px
		.btn-wrapper
			button
				margin 10px 20px
</style>
