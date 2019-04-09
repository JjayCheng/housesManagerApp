import Vue from 'vue';
import component from './notification.vue';

const NotificationConsteuctor = Vue.extend(component);

let notifications = [];

const notify = (options) => {
  if(Vue.prototype.$isServer) return;
  const instance = new NotificationConsteuctor({
    propsData: options
  });
  instance.vm = instance.$mount();
  document.body.appendChild(instance.vm.$el);
  notifications.push(instance.vm);
}

export default (Vue) => {
  Vue.component('notification', NotificationConsteuctor);
  Vue.prototype.$notify = notify
}