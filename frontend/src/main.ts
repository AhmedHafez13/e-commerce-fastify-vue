import './assets/main.css';

import { createApp } from 'vue';
import { createPinia } from 'pinia';
import { createVuetify } from 'vuetify';
import * as vuetifyComponents from 'vuetify/components';
import * as vuetifyLabs from 'vuetify/labs/components';
import * as vuetifyDirectives from 'vuetify/directives';
import 'vuetify/styles';

import App from './App.vue';
import router from './router';

const app = createApp(App);

app.use(
  createVuetify({
    components: {
      ...vuetifyComponents,
      ...vuetifyLabs
    },
    directives: vuetifyDirectives
  })
);
app.use(createPinia());
app.use(router);

app.mount('#app');
