<template>
  <h1>Use Vue vars in &lt;Vue.style&gt;:</h1>
  <div class="sample">
    <h1 style="text-align: center">С изображением</h1>
    <meetup-cover :title="meetupWithImage.title" :image="meetupWithImage.image" />

    <h1 style="text-align: center">Без изображения</h1>
    <meetup-cover :title="meetupWithoutImage.title" :image="meetupWithoutImage.image" />
  </div>

  <h1 style="margin-top: 50px; border-top: 1px black solid">Override CSS var in HTML 'style' attribute:</h1>
  <div class="sample">
    <h1 style="text-align: center">С изображением</h1>
    <meetup-cover-css-var :title="meetupWithImage.title" :image="meetupWithImage.image" />

    <h1 style="text-align: center">Без изображения</h1>
    <meetup-cover-css-var :title="meetupWithoutImage.title" :image="meetupWithoutImage.image" />
  </div>

  <h1 style="margin-top: 50px; border-top: 1px black solid">Use CSS var(use-if-has-value, var(--default)):</h1>
  <div class="sample">
    <h1 style="text-align: center">С изображением</h1>
    <meetup-cover-css-var-fallback :title="meetupWithImage.title" :image="meetupWithImage.image" />

    <h1 style="text-align: center">Без изображения</h1>
    <meetup-cover-css-var-fallback :title="meetupWithoutImage.title" :image="meetupWithoutImage.image" />
  </div>
</template>

<script>
import MeetupCover from './components/MeetupCover';
import MeetupCoverCssVar from './components/MeetupCoverCssVar';
import MeetupCoverCssVarFallback from './components/MeetupCoverCssVarFallback';

export default {
  name: 'App',

  components: {
    MeetupCover,
    MeetupCoverCssVar,
    MeetupCoverCssVarFallback,
  },

  data() {
    return {
      meetupWithImage: {
        title: 'VueConf US',
        image: 'https://course-vue.javascript.ru/api/images/5',
      },
      meetupWithoutImage: {
        title: 'Demo meetup',
        image: null,
      },
    };
  },
};
</script>

<style></style>
