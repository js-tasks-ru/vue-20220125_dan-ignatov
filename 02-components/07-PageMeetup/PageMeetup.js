import { defineComponent } from './vendor/vue.esm-browser.js';
import UiContainer from './UiContainer.js';
import UiAlert from './UiAlert.js';
import MeetupView from '../06-MeetupView/MeetupView.js';

import { fetchMeetupById } from './meetupService.js';

const states = {
  defaultErrorMessage: 'error',

  loading: 'loading',
  error: 'error',
  success: 'success',

  isLoading(value) {
    return value === this.loading;
  },

  isError(value) {
    return value === this.error;
  },

  isSuccess(value) {
    return value === this.success;
  },
};

export default defineComponent({
  name: 'PageMeetup',

  components: {
    UiAlert,
    UiContainer,
    MeetupView,
  },

  props: {
    meetupId: {
      type: Number,
      required: true,
    },
  },

  data() {
    return {
      meetup: null,
      state: states.loading,
      errorMessage: 'error',
    };
  },

  computed: {
    isLoading() {
      return states.isLoading(this.state);
    },

    isError() {
      return states.isError(this.state);
    },

    isSuccess() {
      return states.isError(this.state);
    },
  },

  watch: {
    meetupId: {
      immediate: true,
      async handler(newValue) {
        this.meetup = null;
        this.state = states.loading;
        this.errorMessage = states.defaultErrorMessage;
        try {
          this.meetup = await fetchMeetupById(newValue);
          if (this.meetup) {
            this.state = states.success;
          } else {
            this.state = states.error;
          }
        } catch (err) {
          this.state = states.error;
          this.errorMessage = err.message;
        }
      },
    },
  },

  template: `
    <div v-if="!meetupId">NO DATA</div>
    <div v-else class="page-meetup">
      <meetup-view v-if="meetup" :meetup="meetup"/>

      <ui-container v-if="isLoading">
        <ui-alert>Загрузка...</ui-alert>
      </ui-container>

      <ui-container v-if="isError">
        <ui-alert>{{ errorMessage }}</ui-alert>
      </ui-container>
    </div>`,
});
