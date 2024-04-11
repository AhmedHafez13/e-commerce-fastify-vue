<script setup lang="ts"></script>

<template>
  <v-container fluid fill-height class="home glow">
    <v-layout wrap>
      <v-sheet class="text-container" rounded>
        <v-card-text class="text-h1 glow-text">Welcome to<br />My Shop</v-card-text>
        <v-card-text class="glow-text">
          Shop with confidence at Me Shop. Satisfaction guaranteed!
        </v-card-text>
        <v-btn class="ma-6 hover:shadow glow-btn" color="primary" size="large" to="/products">
          Explore Products <v-icon right>mdi-chevron-right</v-icon>
        </v-btn>
      </v-sheet>
    </v-layout>
  </v-container>
</template>

<style scoped lang="scss">
.home {
  min-width: 530px;
  display: flex;
  flex-wrap: wrap;
}

.text-container {
  width: 100%;
  padding: 24px;
}

.image-container {
  background-image: url('your_image.jpg');
  background-size: cover;
  background-position: center;
}

.text-h1 {
  font-size: 2.5rem;
}

.glow {
  filter: drop-shadow(0 0 5px rgba(255, 255, 255, 0.7)) brightness(1.2);
}

.glow-text {
  text-shadow: 0 0 10px rgba(255, 255, 255, 0.7);
}

.glow-btn {
  box-shadow: 0 0 10px rgba(255, 255, 255, 0.7);
}

.glow-image {
  filter: brightness(1.2) contrast(1.2);
}
</style>
``` In this updated version, I added glow effects using `text-shadow`, `box-shadow`, and `filter`
properties to create a glowing and lighting effect on the text, buttons, and image. Feel free to
adjust the values to achieve the desired glow and lighting effect for your home page.
