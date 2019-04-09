<template>
	<div class="detailsHouse">
		<action-bar title="管理房源" @back="back"></action-bar>
		<div class="uni-textarea">
			<textarea placeholder-style="color:#ccc" placeholder="添加房源信息.." v-model="newContent"/>
		</div>
		<h3>房源分类：</h3>
		<div class="selecte-wrapper">
			<div :class="['selecte-item', {'selected': selected === index + 1}]"
				v-for="(text, index) in classTypeTextListNoAll" :key="text"
				@click="selected = index + 1"
			>
				<span class="text">{{text}}</span>
			</div>
		</div>
		<div class="time">
			<i class="iconfont icon-lishi"></i>
			<span>{{house.friendlyDate}}</span>
		</div>
		<div class="btn-wrapper">
			<transition name="btns-fade" mode="out-in">
				<div v-if="showClear">
					<button class="default" @click="restore" size="mini" >还原</button>
					<button class="primary" @click="update" size="mini">保存</button>
				</div>
				<button v-else class="warn" @click="remove">删除</button>
			</transition>
		</div>
		<div class="call" @click="callPhone">
			<i class="iconfont icon-dianhua"></i>
		</div>
	</div>
</template>

<script>
	export default {
		name: 'detailsHouse',
		data() {
			return {
				house: {},
				selected: 0,
				newContent: '',
				showClear: false,
				phone: '',
				id: 0,
				classTypeTextListNoAll: filterMaps.classTypeTextListNoAll
			};
		},	
		mounted() {
			this.id = this.$router.history.current.params.id;
			this.load()
		},
		methods: {
			load() {
				db.getDataWithID(this.id, result => {
					var item = result[0];
					item.friendlyDate = util.friendlyDate(item.TIME);
					this.house = item;
					this.selected = item.CLASSTYPE;
					var content = this.newContent = item.CONTENT;
					var reg = /1\d{10}/g;
					this.phone = content.replace(/\s*/g,"").match(reg);
					
				});
			},
			restore() {
				var house = this.house;
				this.selected = house.CLASSTYPE;
				this.newContent = house.CONTENT;
			},
			update() {
				db.updateWithID(this.house.ID,this.newContent,this.selected, result => {
					this.$notify({
						title: '修改成功'
					});
					window.history.back();
				});
			},
			remove() {
				this.$promptbox({
					content: '确认删除?',
					cancle_true: ()=>{
						db.deleteDateWithID(this.id, result => {
							window.history.back();
							this.$emit('needLoad');
						});
					}
				});
			},
			callPhone() {
				var phoneArr = this.phone;
				if(phoneArr){
					if(phoneArr.length > 1) {
						this.$choicebox({
							title: '有多个手机号，请选择',
							list: phoneArr,
							method: (i) => {
								Android.callPhone(phoneArr[i])
							}
						});
					} else {
							Android.callPhone(this.phone[0])
					}
				} else {
					this.$notify({
						title: '没找到电话号码,可能输入有误',
						icon: 'none'
					});
				}
			},
			back() {
				window.history.back();
			}
		},
		watch: {
			selected() {
				if(this.selected === this.house.CLASSTYPE) {
					this.showClear = false
				} else {
					this.showClear = true
				}
			},
			newContent() {
				if(this.newContent === this.house.CONTENT) {
					this.showClear = false
				} else {
					this.showClear = true
				}
			},
		}
	}
</script>

<style lang="stylus" scoped>
.detailsHouse
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
		flex-direction row
		justify-content flex-end
		margin-top 30px
		button
			margin 0
			margin-right 20px
	.time
		font-size 12px
		margin-right 20px
		text-align right
		i,text
			display inline
	.call
		position absolute
		bottom 20px
		left 20px
		width 50px
		height 50px
		background skyblue
		border-radius 100%
		line-height 50px
		color #fff
		text-align center
		&:active
			opacity 0.5
		i
			font-size 24px
</style>
