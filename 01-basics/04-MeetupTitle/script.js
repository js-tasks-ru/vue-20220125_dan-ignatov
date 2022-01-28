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
        this.selectedMeetupTitle = meetup.title;
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