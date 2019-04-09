<template>
	<div class="addform">
		<action-bar title="添加房源" @back="back"></action-bar>
		<textarea placeholder="添加房源信息.." v-model="content"/>
		<h3>选择分类：</h3>
		<div class="selecte-wrapper">
			<div :class="['selecte-item', {'selected': selected === index + 1}]"
				v-for="(text, index) in classTypeTextListNoAll" :key="text"
				@click="selected = index + 1"
			>
				<span class="text">{{text}}</span>
			</div>
		</div>
		<div class="btn-wrapper">
			<button class="default" @click="clear">清空</button>
			<button class="primary" @click="add">添加房源</button>
		</div>
		
	</div>
</template>

<script>
	export default {
		data() {
			return {
				selected: 1,
				content: '',
				classTypeTextListNoAll: filterMaps.classTypeTextListNoAll
			};
		},
		methods: {
			add() {
				var content = this.content,
						type = this.selected;
				if(content && type) {
					db.insterData(content, type, 0, (result) => {
						this.$notify({
							icon: 'success',
							title: '添加成功！'
						});
						this.clear();
						window.history.back();
						this.$emit('needLoad');
					});
				} else {
					this.$notify({
						icon: 'none',
						title: '请输入内容！'
					})
				}
			},
			back() {
				window.history.back();
			},
			clear() {
				this.content = ''
			}
		}
	}
</script>

<style lang="stylus" scoped>
	.addform
		position absolute
		width 100%
		height 100%
		background #fff
		.uni-textarea
			padding-top 10px
			textarea
				width 95%
				margin auto
				border-bottom 1upx solid #ccc
		h3
			font-size 18px
			padding 25px 0 0 10px
		.selecte-wrapper
			display flex
			padding 25px 0
			.selecte-item
				font-size 0
				padding 6px 8px
				color rgb(77, 85, 93)
				margin-left 8px
				border-radius 4px
				background-color rgba(255,255,255 0.6)
				.text
					font-size 13px
				.num
					margin-left 2px
					font-size 8px
			.selecte-item.selected
				color #fff
				background rgb(0, 160, 220)
		.btn-wrapper
			display flex
			margin-top 20px
			button
				width 40%
</style>
