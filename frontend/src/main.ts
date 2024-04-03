import './assets/main.scss';

import { createApp } from 'vue';
import { createPinia } from 'pinia';
import { createVuetify } from 'vuetify';
import * as vuetifyComponents from 'vuetify/components';
import * as vuetifyLabs from 'vuetify/labs/components';
import * as vuetifyDirectives from 'vuetify/directives';
import { VTreeview } from 'vuetify/labs/VTreeview';
import { Cropper } from 'vue-advanced-cropper';
import 'vue-advanced-cropper/dist/style.css';
import 'vuetify/styles';

import App from './App.vue';
import router from './router';

// Custom Components
import AppProgressLinear from './components/AppProgressLinear.vue';
import AppCompactAlert from './components/AppCompactAlert.vue';

// Custom settings
import { vuetifyDefaults } from './settings/vuetify-defaults';

const app = createApp(App);

app.use(
  createVuetify({
    components: {
      ...vuetifyComponents,
      ...vuetifyLabs,
      VTreeview,
      Cropper,
      AppProgressLinear,
      AppCompactAlert
    },
    directives: vuetifyDirectives,
    defaults: vuetifyDefaults
  })
);
app.use(createPinia());
app.use(router);

declare module '@vue/runtime-core' {
  export interface GlobalComponents {
    Cropper: typeof Cropper;
    AppProgressLinear: typeof AppProgressLinear;
    AppCompactAlert: typeof AppCompactAlert;
  }
}

app.mount('#app');
