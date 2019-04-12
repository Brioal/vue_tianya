import Vue from 'vue';
import App from './App.vue';
import router from './router';
import store from './store';
import './registerServiceWorker';

// element
import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';

Vue.use(ElementUI);

// iView
import iView from 'iview';
import 'iview/dist/styles/iview.css';

Vue.use(iView);

// VueResource
import Vueresource from 'vue-resource';

Vue.use(Vueresource);

// 工具类
// @ts-ignore
import Validater from './utils/Validater';

Vue.prototype.Validater = Validater;
Vue.prototype.NetUtil = Validater;
Vue.use(Validater);

Vue.config.productionTip = false;

new Vue({
    router,
    store,
    render: (h) => h(App),
}).$mount('#app');
