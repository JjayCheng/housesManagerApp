<template>
	<div id="app">
		<transition :name="animationName"  v-on:after-enter="animationOver">
			<keep-alive>
				<router-view
					v-if="$route.meta.keepAlive"
					:hasLoad="hasLoad" 
					@needLoad="hasLoad = !hasLoad"
				></router-view>
			</keep-alive>
		</transition>
		<transition name="fade-side-on"  v-on:after-enter="animationOver">
			<router-view
				v-if="!$route.meta.keepAlive"
				:hasLoad="hasLoad"
				@needLoad="hasLoad = !hasLoad"
			></router-view>
		</transition>
	</div>
</template>

<script>

const hasLoadPages = [/\/compatibleHouse/, /\/index/];

export default {
	data() {
		return {
			hasLoad: false, // 子组件监听，取反改变即触发, (主要监听路由过渡动画结束)
			animationName: 'fade-side-on'
		}
	},
	mounted() {
		this.hasLoad = !this.hasLoad;
		this.$router.beforeEach((to, from, next)=>{
			if(from.name === 'compatibleHouse') {
				if(to.name === 'detailsHouse') {
					from.meta.keepAlive = true;
				} else {
					from.meta.keepAlive = false;
					util.deleteKeepAliveCache(from.matched[0].instances.default);
				}
			}
			if((to.name === 'compatibleHouse' || to.name === 'index') && from.name === 'detailsHouse') {
				this.animationName = 'noAnimation';
			} else {
				this.animationName = 'fade-side-on';
			}
			next()
		});
	},
	methods: {
		animationOver() {
			const path = this.$router.history.current.path;
			hasLoadPages.forEach(hasLoadPage => {
				hasLoadPage.test(path) && (this.hasLoad = !this.hasLoad );
			});
		}
	}
}
</script>

<style lang="stylus" scoped>
#app
	width 100%
	height 100%
</style>
