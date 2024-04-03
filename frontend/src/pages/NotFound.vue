<script setup lang="ts"></script>

<template>
  <v-container fluid fill-height class="not-found">
    <v-layout justify="center" align-center>
      <div class="error-message">
        <h1 class="error-title">Oops!<br />Page Not Found</h1>
        <p class="error-text">
          We can't seem to find the page you're looking for. Don't worry, let's try navigating back
          to the homepage.
        </p>
        <v-btn class="mt-12" color="primary" variant="tonal" size="large" to="/">
          <v-icon class="me-2">mdi-home</v-icon>
          Go Home
        </v-btn>
      </div>
    </v-layout>
  </v-container>
</template>

<style scoped lang="scss">
.not-found {
  max-width: 20rem;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}

.error-message {
  text-align: center;
}

.error-title {
  margin: 0;
  font-size: 2.5rem;
}

.error-text {
  margin-top: 16px;
  font-size: 1rem;
}
</style>
