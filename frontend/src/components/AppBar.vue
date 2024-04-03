<script setup lang="ts">
import { ref, watch, onMounted } from 'vue';
import { useTheme } from 'vuetify';

const lightMood = ref(true);
const disableSwitch = ref(false);

const theme = useTheme();

// Broadcast channel to share user theme between tabs
const channel = new BroadcastChannel('user.settings.theme');

onMounted(() => {
  const userTheme = window.localStorage.getItem('user.settings.theme');
  if (userTheme) {
    lightMood.value = userTheme === 'light';
  }
  theme.global.name.value = lightMood.value ? 'light' : 'dark';
});

// Cross tabs message
channel.onmessage = (event) => {
  theme.global.name.value = event.data;
  lightMood.value = event.data === 'light';
};

watch(lightMood, () => {
  theme.global.name.value = lightMood.value ? 'light' : 'dark';
  window.localStorage.setItem('user.settings.theme', theme.global.name.value);

  // Temporary disable the switch till the theme get switched
  disableSwitch.value = true;
  setTimeout(() => {
    disableSwitch.value = false;
  }, 300);

  // Cross tabs message
  channel.postMessage(theme.global.name.value);
});
</script>

<template>
  <main class="app-bar">
    <v-app-bar :elevation="0">
      <template v-slot:prepend>
        <v-app-bar-nav-icon></v-app-bar-nav-icon>
      </template>

      <v-app-bar-title>{{ $route.meta.pageTitle || 'Store' }}</v-app-bar-title>

      <v-switch
        :disabled="disableSwitch"
        prepend-icon="mdi-theme-light-dark"
        class="me-4"
        v-model="lightMood"
        hide-details
        inset
      />
    </v-app-bar>
  </main>
</template>

<style scoped lang="scss">
.app-bar {
  height: 85px;
}

.app-bar :deep(header) {
  left: 0.5rem !important;
  right: 0.5rem !important;
  top: 0.5rem !important;
  width: unset !important;
  background-color: rgba(255, 255, 255, 0);
}

:deep(.v-toolbar) {
  display: flex;
  align-items: center;
}

:deep(.v-toolbar__content) {
  max-width: 1100px !important;
  -webkit-backdrop-filter: blur(10px);
  backdrop-filter: blur(10px);
  background-color: rgba(255, 255, 255, 0.5);
  border: rgba(186, 186, 186, 0.5) solid 2px;
  border-radius: 20rem;
}
</style>
