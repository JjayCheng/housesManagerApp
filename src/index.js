import Vue from 'vue';
import App from './App.vue';
import router from './router/router';
import VueRouter from 'vue-router';

// 全局样式
import './common/style/reset.styl';
import './common/style/base.styl';
import './common/icon/iconfont.css';

// 全局方法
import filterMaps from "./common/js/filterMaps";
import db from './common/js/db';
import util from './common/js/util';
db.init({
  showToast: Vue.prototype.$notify
});
window.db = db;
window.util = util;
window.filterMaps = filterMaps;

// 全局方法组件
import notification from './components/notification';
Vue.use(notification);
import promptbox from './components/promptbox';
Vue.use(promptbox);
import choicebox from './components/choicebox';
Vue.use(choicebox);

// 全局组件
import actionBar from './components/actionBar';
Vue.use(actionBar)


// java方法
window.Android = window.Android || {};
// java监听的返回键， 按下执行
window.keyBack = util.defaultBack;

Vue.use(VueRouter);

new Vue({
  el: '#app',
  router: router(),
  components: { App },
  template: '<App/>'
})