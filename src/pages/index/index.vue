<template>
	<div class="page">
		<div class="top-bar">
			<div class="search-wrapper">
				<div class="search-btn" @click="openSearchPage">
					<span>搜索房源..</span>
					<i class="iconfont icon-chazhao"></i>
				</div>
				<div class="icon-btn-wrapper">
					<i class="iconfont icon-icon_roundadd" @click="openAddPage"></i>
					<i class="iconfont icon-shezhi" @click="showMoreControl"></i>
				</div>
			</div>
		</div>
		<div class="house-wrapper">
			<houselist :hasLoad="hasLoad"/>
		</div>
	</div>
</template>

<script>
import houselist from '../../components/houselist.vue';

const importData = (vue) => {
	vue.$choicebox({
		title: '选择导入方式',
		list: ['从剪贴板中读取','从接收到的备份文件'],
		method: (i) => {
			const data = i === 0 ? Android.getClipboardText() : Android.importData(),
			promptboxTitle = `从${ i === 0 ? '剪贴板' : '微信文件'}检测到数据, 确认导入? 这可能造成数据混乱。`,
			notifyTitle = i === 0 ? '未在剪贴板中找到数据' : '未找到备份文件';
			if(data[0] === '{' || data[0] === '[') {
				vue.$promptbox({
					content: promptboxTitle,
					cancle_true: () => {
						db.insterDataByJson(JSON.parse(data), (successNum, failNum, repeatNum) => {
							vue.$notify({title: `导入完成, 成功${successNum}, 失败${failNum}, 重复${repeatNum}`});
							vue.$emit('needLoad');
						});
					}
				});
			} else {
				vue.$notify({title: notifyTitle});
			}
		}
	});
	
}

export default {
	props: ['hasLoad'],
	methods: {
		change(num) {
			this.selected = num;
		},
		openAddPage() {
			this.$router.push('/addform');
		},
		openSearchPage() {
			this.$router.push('/search');
		},
		showMoreControl() {
			this.$choicebox({
				title: '选择你的操作',
				list: ['导入数据','导出数据','清空数据'],
				method: (i) => {
					switch (i) {
						case 0: // 导入数据
							importData(this);
							break;
						case 1: // 导出数据
							db.getExportOfData((result)=>{
								if(result.length) {
									Android.exportData(JSON.stringify(result));
								}	else {
									this.$notify({title:'没有任何数据'});
								}
							});
							break;
						case 2: // 清空数据
							this.$promptbox({
								content: '确认清空? 这将删除所有数据',
								cancle_true: () => {
									db.deleteAllDate(() => {
										this.$notify({title: '清空完成'});
										this.$emit('needLoad');
									});
								}
							});
							break;
						default:
							break;
					}
				}
			});
		}
	},
	components: {
		houselist
	}
}
</script>

<style lang="stylus" scoped>
.page
	.top-bar
		background-color skyblue
		.search-wrapper
			display flex
			padding 10px 10px 5px 10px
			.search-btn
				flex 1
				height 30px
				text-align left
				background-color #fff
				border-radius 50px
				font-size 20px
				padding 0 10px
				color #999
				&:active
					background-color rgba(255,255,255, 0.8)
				i
					float right
					line-height 30px
				span
					line-height 30px
					font-size 15px
			.icon-btn-wrapper
				margin-left auto
				.iconfont
					display inline-block
					color #fff
					height 30px
					line-height 30px
					font-size 0px
					margin-left 10px
					&:before
						font-size 26px
					&:active
						color rgba(255,255,255, 0.6)
	.house-wrapper
		position absolute
		width 100%
		top 45px
		bottom 0px
</style>
