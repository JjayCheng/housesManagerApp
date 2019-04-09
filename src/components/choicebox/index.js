import Vue from 'vue';
import component from './choicebox.vue';

const ChoiceboxConsteuctor = Vue.extend(component);

const choicebox = (options) => {
  if(Vue.prototype.$isServer) return;
  const instance = new ChoiceboxConsteuctor({
    propsData: options
  });
  instance.vm = instance.$mount();
  document.body.appendChild(instance.vm.$el);
}

export default (Vue) => {
  Vue.component('choicebox', ChoiceboxConsteuctor);
  Vue.prototype.$choicebox = choicebox
}