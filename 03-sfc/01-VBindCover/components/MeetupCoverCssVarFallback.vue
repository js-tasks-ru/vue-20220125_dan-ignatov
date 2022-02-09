<template>
  <div class="meetup-cover" :style="cssVars">
    <h1 class="meetup-cover__title">{{ title }}</h1>
  </div>
</template>

<script>
export default {
  name: 'MeetupCoverCssVarFallback',

  props: {
    title: {
      type: String,
    },
    image: {
      image: String,
    },
  },

  computed: {
    cssVars() {
      // Внутри v-bind('meetupCoverBackgroungImage') работает почти как мой cssVars: всегда прописывает в style свою переменную:
      // style="--2b039ab4-meetupCoverBackgroungImage:url(https\:\/\/course-vue\.javascript\.ru\/api\/images\/3);"
      // UA поддерживают вложенность "var(--2b039ab4-meetupCoverBackgroungImage)" когда значение "var(--default-cover)"
      // В этом варианте эта функция не использует строку 'default-cover' в своем коде, они есть только в <style>
      return {
        '--meetupCoverBackgroungImage': this.image ? `url(${this.image})` : null,
      };
    },
  },
};
</script>

<style scoped>
.meetup-cover {
  background-size: cover;
  background-position: center;
  background-image: linear-gradient(0deg, rgba(0, 0, 0, 0.4), rgba(0, 0, 0, 0.4)),
    var(--meetupCoverBackgroungImage, var(--default-cover));
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 410px;
  max-width: 1216px;
  margin: 0 auto;
}

.meetup-cover__title {
  color: var(--white);
  font-family: Roboto, sans-serif;
  font-weight: 700;
  font-size: 36px;
  line-height: 48px;
  padding: 0 16px;
  text-align: center;
}

@media all and (min-width: 992px) {
  .meetup-cover__title {
    font-size: 72px;
    line-height: 84px;
  }
}
</style>
