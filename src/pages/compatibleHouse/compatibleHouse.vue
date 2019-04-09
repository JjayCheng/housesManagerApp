<template>
	<div class="house">
		<action-bar :title="title" @back="back"></action-bar>
		<div class="house-wrapper">
			<houselist :keyval="keyval" :hasLoad="hasLoad"></houselist>
		</div>
	</div>
</template>

<script>
	import selectbox from '../../components/selectbox.vue';
	import houselist from '../../components/houselist.vue';
	export default {
		name: 'compatibleHouse',
		props: ['hasLoad'],
		data() {
			return {
				keyval: '',
				title: ''
			}
		},
		mounted() {
			const keyval = this.keyval = this.$router.history.current.params.wd;
			this.title = `包含(${keyval})的房源`;
		},
		methods: {
			back() {
				// util.deleteKeepAliveCache(this);
				window.history.back();
			},
		},
		components: {
			houselist
		}
	}
</script>

<style lang="stylus" scoped>
.house
	.top-bar
		background skyblue
	.house-wrapper
		position absolute
		width 100%
		top 40px
		bottom 0px
</style>