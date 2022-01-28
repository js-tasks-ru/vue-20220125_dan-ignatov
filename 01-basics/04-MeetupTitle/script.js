import { createApp } from './vendor/vue.esm-browser.js';

const API_URL = 'https://course-vue.javascript.ru/api';

function fetchMeetupById(meetupId) {
  return fetch(`${API_URL}/meetups/${meetupId}`).then((response) => {
    if (response.ok) {
      return response.json();
    } else {
      return response.json().then((error) => {
        throw error;
      });
    }
  });
}

function fetchMeetups() {
  return fetch(`${API_URL}/meetups`).then((response) => {
    if (response.ok) {
      return response.json();
    } else {
      return response.json().then((error) => {
        throw error;
      });
    }
  });
}

// Требуется создать Vue приложение

const MeetupList = [1, 2, 3, 4, 5];

const MeetupSelector = {
  data() {
    return {
      MeetupList,
      selectedMeetupId: MeetupList[0],
      selectedMeetupTitle: 'MEETUP_TITLE',
    }
  },

  watch: {
    selectedMeetupId: {
      immediate: true,
      async handler(newValue) {
        const meetup = await fetchMeetupById(newValue);
        this.selectedMeetupTitle = meetup?.title;
      }
      // async selectedMeetupId(newValue) {
      //   const meetup = await fetchMeetupById(newValue);
      //   this.selectedMeetupTitle = meetup.title;
      // }
    }
  }
};

const app = createApp(MeetupSelector);
app.mount('#app');

// ============ v2 ============

const MeetupSelector2 = {
  data() {
    return {
      meetupList2: [],
      selectedMeetupId: undefined, // explicit declaration is required to create a proxied property, track changes and call 'watch'
    }
  },

  async mounted() {
    this.meetupList2 = await fetchMeetups();
    this.selectedMeetupId = this.meetupList2.length > 0 ? this.meetupList2[0].id : undefined;
  },

  watch: {
    selectedMeetupId: {
      immediate: true,
      handler(newValue) {
        this.selectedMeetupTitle = this.meetupList2.find(item => item.id === newValue)?.title;
      }
    }
  }
};

const app2 = createApp(MeetupSelector2);
app2.mount('#app2');