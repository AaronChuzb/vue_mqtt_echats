import Vue from 'vue'
import App from './App.vue'
import router from './router'
import ElementUI from 'element-ui'
import './styles.scss'

Vue.use(ElementUI)
import axios from 'axios';
Vue.prototype.$axios=axios;
Vue.prototype.NM = '/api';

Vue.config.productionTip = false

new Vue({
  router,
  render: h => h(App)
}).$mount('#app')
