import Vue from 'vue';
import component from './promptbox.vue';

const PromptboxConsteuctor = Vue.extend(component);

const promptbox = (options) => {
  if(Vue.prototype.$isServer) return;
  const instance = new PromptboxConsteuctor({
    propsData: options
  });
  instance.vm = instance.$mount();
  document.body.appendChild(instance.vm.$el);
}

export default (Vue) => {
  Vue.component('promptbox', PromptboxConsteuctor);
  Vue.prototype.$promptbox = promptbox
}