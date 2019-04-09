<template>
	<div class="selectbox">
		<div class="select">
			<div class="selecteCt"
				ref='selecteClassListScroll'
				@scroll="selecteClassListScrollX =  $refs.selecteClassListScroll.scrollLeft"
			>
				<div class="selecte-wrapper">
					<div class="selecte-item" v-for="(item, i) in textMaps.class" :key="i"
					:class="{'selected': selectedClass === i}" @click="changeClass(i)">
						<span class="span">{{item}}</span>
						<span class="num">{{classNumTotal[i]}}</span>
					</div>
				</div>
			</div>
			<i :class="'control iconfont ' + (timeup ? 'icon-mayi-shengxusvg' : 'icon-mayi-jiangxusvg')" @click="reverse" ></i>
		</div>
		<div
			:class="['select2', {'enable': enableRegSelect}]"
			ref='selecteRegListScroll'
			@scroll="selecteRegListScrollX =  $refs.selecteRegListScroll.scrollLeft"
		>
			<span class="span" v-for="(item, i) in textMaps.reg" :key="i"
			:class="{active: selectedReg === i}" @click="changeReg(i)">
				{{item}} {{regNumTotal[i]}}
			</span>
		</div>
	</div>
</template>
<script>

	// 选择的classtype为需要关闭 reg筛选 的值
	const ENABLE_REGSELECT_CLASSTYPE = [3, 4];

	export default {
		props: ['classNumTotal', 'regNumTotal'],
		data() {
			return {
				textMaps: {
					reg: filterMaps.regTypeTextList,
					class: filterMaps.classTypeTextList
				},
				selectedClass: 0,
				selectedReg: 0,
				selecteRegListScrollX: 0,
				selecteClassListScrollX:0,
				timeup: true,
				enableRegSelect: false
			};
		},
		updated() {
			this.$refs.selecteRegListScroll.scrollLeft = this.selecteRegListScrollX;
			this.$refs.selecteClassListScroll.scrollLeft = this.selecteClassListScrollX;
		},
		methods: {
			changeReg(num) {
				if(!this.enableRegSelect) {
					this.selectedReg = num;
					this.$emit('changedReg', num);
				}
			},
			changeClass(num) {
				this.selectedClass = num;
				this.enableRegSelect = ENABLE_REGSELECT_CLASSTYPE.indexOf(num) !== -1;
				this.$refs.selecteRegListScroll.scrollLeft = this.selecteRegListScrollX = 0;
				this.changeReg(0);
				this.$emit('changedClass', num, this.enableRegSelect);
			},
			reverse() {
				this.timeup = !this.timeup;
				this.$emit('reverse');
			}
		}
	}
</script>

<style lang="stylus" scoped>
.selectbox
	background skyblue
	padding-top 10px
	.select
		display flex
		height 30px
		padding 0 8px
		.control
			width 30px
			height 30px
			margin-left auto
			text-align center
			color #fff
			background skyblue
			line-height 30px
			font-size 26px
			&:active
				color rgba(255,255,255, 0.6)
		.selecteCt
			width calc(100% - 45px)
			overflow scroll
			.selecte-wrapper
				font-size 0
				white-space nowrap
				.selecte-item
					display inline-block
					height 25px
					line-height 27px
					margin-top 3px
					text-align center
					color rgb(77, 85, 93)
					margin-right 12px
					border-radius 4px
					background-color rgba(255,255,255 0.6)
					padding 0 10px
					transition all 0.5s
					.span
						font-size 13px
					.num
						margin-left 2px
						font-size 8px
				.selecte-item.selected
					color #fff
					background rgb(0, 160, 220)
	.select2
		width 100%
		height 30px
		margin-top 5px
		font-size 14px
		color #fff
		overflow scroll
		white-space nowrap
		.span
			display inline-block
			height 30px
			padding 0 10px
			line-height 30px
			transition all 0.5s
			&.active
				color rgb(0, 160, 220)
				font-weight 600
		&.enable
			.span
				color rgba(255,255,255, 0.3);
				text-decoration line-through
</style>
