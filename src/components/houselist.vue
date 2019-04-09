<template>
	<div class="houseCt">
		<selectbox
			:classNumTotal="classNumTotal"
			:regNumTotal="regNumTotal"
			@changedReg="changeReg"
			@changedClass="changeClass"
			@reverse="reverse"
		/>
		<!-- 组列表 -->
		<div class="house-list wrapper" ref="houseListScroll">
			<transition-group tag="div" class="content" name="list-complete" ref="houseList">
				<div class="house-item"
					v-for="house in houses" :key="house.ID"
					@click="open(house.ID, house)"
					v-show="house.regPass && house.classPass">
					<div class="content">
						<span>{{house.friendlyContent}}</span>
					</div>
					<div class="infor-wrapper">
						<div class="infor-item type">
							<i class="iconfont icon-bianji"></i>
							<span class="span">{{house.typeText}}</span>
						</div>
						<div class="infor-item time" :class="{'check-show': checkModel}">
							<i class="iconfont icon-lishi"></i>
							<span class="span">{{house.friendlyDate}}</span>
						</div>
						<input type="checkbox" :checked="house.checked" class="checkbox" v-show="checkModel">
					</div>
				</div>
			</transition-group>
			<div class="big-padding" v-if="checkModel"></div>
		</div>
		<!-- 多选控制台 -->
		<div class="check-control" v-if="checkModel">
			<button class="mini-btn warn" @click="delCheckedData">删除</button>
			<button class="mini-btn primary" @click="exportCheckedData">导出</button>
      <button class="mini-btn default" @click="cancelCheckModel">取消</button>
			<span v-show="checkedNum">{{checkedNum}}</span>
			<input type="checkbox" :checked="checkedAll" class="checkbox" @click="checkAll"/>
		</div>
	</div>
</template>

<script>
	import selectbox from './selectbox.vue';
	export default {
		props:['keyval', 'hasLoad'],
		data() {
			return {
				path: '',
				houses: [],
				classNumTotal: [],
				regNumTotal: [],
				timeup: true,
				selectedClass: 0,
				selectedReg: 0,
				checkModel: false,
				checkedAll: false,
				scrollTop: 0
			}
		},
		mounted() {
			this.initEvent();
		},
		updated() {
			this.$refs.houseListScroll.scrollTop = this.scrollTop;
		},
		methods: {
			// 绑定长按事件
			initEvent(){
				const houseListDom = this.$refs.houseList.$el;
				util.longPress(houseListDom, (event) => {
					this.checkModel = true;
					window.keyBack = () => {
						this.checkModel = false;
						window.keyBack = util.defaultBack;
					}
				});
				let that = this;
				this.$refs.houseListScroll.onscroll = function() {
					that.scrollTop = this.scrollTop;
				}
			},
			getData() {
				if(this.keyval) {
					db.getDataWithKeys(this.keyval.split(' '), (result) => {
						this.initHousesList(result)
					})
				} else {
					db.getAllData((result) => {
						this.initHousesList(result)
					})
				}
			},
			initHousesList(list) {
				const houses = [];
				const CLASSTYPEMAP = filterMaps.classTypeTextList;
				const classNumTotal = [0,0,0,0,0,0];
				const regNumTotal = [0,0,0,0,0,0,0,0];
				for(let i = 0, l = list.length; i < l; i++) {
					let item = list[i];
					let classPass = item.classPass = this.selectedClass === 0 || this.selectedClass === item.CLASSTYPE;
					let regPass = item.regPass = this.selectedReg === 0 || this.selectedReg === item.REGTYPE;
					item.friendlyDate = util.friendlyDate(item.TIME);
					item.friendlyContent = util.friendlyContent(item.CONTENT);
					item.typeText = CLASSTYPEMAP[item.CLASSTYPE];
					item.checked = false;
					houses.push(item);
					// 计数器
					classNumTotal[0]++;
					classNumTotal[item.CLASSTYPE]++;
					regNumTotal[0]++;
					classPass && regNumTotal[item.REGTYPE]++;
				}
				if(this.timeup) {
					houses.reverse();
				}
				this.houses = houses;
				this.classNumTotal = classNumTotal;
				this.regNumTotal = regNumTotal;
			},
			open(id, house) {
				if(this.checkModel) {
					house.checked = !house.checked;
				} else {
					this.$router.push('/detailsHouse/' + id);
				}
			},
			changeClass(num, enableRegSelect) {
				this.selectedClass = num;
				this.houses.forEach(house => {
					// 更新分类验证
					house.classPass = num === house.CLASSTYPE || num === 0;
				});

				// 更改reg子目录
				let regNumTotal = [0,0,0,0,0,0,0,0];
				if(!enableRegSelect) {
					this.houses.forEach(house => {
						if(house.classPass) {
							regNumTotal[0]++;
							regNumTotal[house.REGTYPE]++;
						}
					});
				}
				this.regNumTotal = regNumTotal;
				this.checkModel && (this.checkedAll = false);
				this.$refs.houseListScroll.scrollTop = this.scrollTop = 0;
			},
			changeReg(num) {
				this.selectedReg = num;
				this.houses.forEach(house => {
					// 更新分类验证
					house.regPass = num === house.REGTYPE || num === 0;
				});
				this.checkModel && (this.checkedAll = false);
			},
			reverse(key) {
				this.timeup = key;
				this.houses.reverse();
			},
			getCheckedData(cb) {
				this.houses.forEach((house)=>{
					if(house.checked){
						cb && cb(house)
					}
				})
			},
			exportCheckedData() {
				var exportData = [];
				this.getCheckedData((house) => {
					exportData.push({
						CONTENT: house.CONTENT,
						TIME: house.TIME,
						CLASSTYPE: house.CLASSTYPE
					});
				});
				Android.exportData(JSON.stringify(exportData));
			},
			delCheckedData() {
				this.$promptbox({
					content: '确定删除选中内容?',
					cancle_true: ()=>{
						this.getCheckedData((house) => {
							db.deleteDateWithID(house.ID, ()=>{
								this.checkModel = false;
							});
						});
						this.getData();
					}
				})
			},
			cancelCheckModel() {
				window.keyBack = util.defaultBack;
				this.checkModel = this.checkedAll = false;
				this.getCheckedData((house) => {
					house.checked = false;
				});
			},
			checkAll() {
				var key = this.checkedAll = !this.checkedAll;
				this.houses.forEach((house) => {
					house.regPass && house.classPass && (house.checked = key)
				})
			}
		},
		computed: {
			checkedNum() {
				let checkedNUm = 0;
				this.getCheckedData(()=>{
					checkedNUm ++
				});
				return checkedNUm;
			}
		},
		watch: {
			hasLoad: {
				handler() {
					this.getData();
				},
				deep: true
			}
		},
		components: {
			selectbox
		}
	}
</script>

<style lang="stylus">
.houseCt
	height 100%
	background skyblue
	.house-list
		width 100%
		height calc(100% - 75px)
		background-color #eee
		overflow scroll
		font-size 0
		.big-padding
			height 70px
		.house-item
			position relative
			background-color #fff
			padding 10px 0
			margin-bottom 1px
			padding 20px 10px 10px 10px
			transition all 0.3s
			&:active
				background-color rgba(255,255,255, 0.4)
			.content
				font-size 18px
				padding-bottom 15px
				position relative
				span
					line-height 26px // !important
			.infor-wrapper
				display flex
				justify-content flex-end
			.type
				min-width 60px
			.time
				min-width 70px
				&.check-show
					min-width 85px
			.infor-item
				color #444
				.iconfont
					vertical-align middle
					font-size 16px
					margin-right 2px
				.span
					vertical-align bottom
					font-size 10px
			.checkbox
				position absolute
	.check-control
		display flex
		justify-content right
		flex-direction row
		position fixed
		width 100%
		padding 20px 0
		bottom 0
		left 0
		background-color #fff
		border-top 1px solid #ccc
		button
			margin 0 10px 0 10px
		.checkbox
			margin 6px 10px 0 auto
			font-size 11px
		span
			margin 0 auto
			line-height 28px
			color #999
</style>