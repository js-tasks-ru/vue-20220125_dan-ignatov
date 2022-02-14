<template>
  <ui-container>
    <h2 class="title">IndexPage</h2>
    Для проверки: <router-link :to="{ name: 'login', query: { from: '/register' } }">/login?from=/register</router-link>
  </ui-container>
</template>

<script>
import UiContainer from '../components/UiContainer';

export default {
  name: 'PageIndex',
  components: { UiContainer },
};
</script>

<style></style>
