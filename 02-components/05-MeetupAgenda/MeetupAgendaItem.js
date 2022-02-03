import { defineComponent } from './vendor/vue.esm-browser.js';
import { agendaItemIcons, agendaItemDefaultTitles } from './meetupService.js';

export default defineComponent({
  name: 'MeetupAgendaItem',

  agendaItemDefaultTitles,

  props: {
    agendaItem: {
      type: Object,
      required: true,
    },
  },

  computed: {
    icon() {
      return `/assets/icons/icon-${agendaItemIcons[this.agendaItem.type]}.svg`;
    },
    timeLine() {
      return `${this.agendaItem.startsAt} - ${this.agendaItem.endsAt}`;
    },
    isTalkItem() {
      return this.agendaItem.type === 'talk';
    },
    title() {
      return this.agendaItem.title || agendaItemDefaultTitles[this.agendaItem.type];
    },
    description() {
      return this.agendaItem.description;
    },
    language() {
      return this.agendaItem.language;
    },
    speaker() {
      return this.agendaItem.speaker;
    },
  },

  template: `
    <div class="agenda-item">
      <div class="agenda-item__col">
        <img :src="icon" class="icon" alt="key" />
      </div>
      <div class="agenda-item__col">{{ timeLine }}</div>
      <div class="agenda-item__col">
        <h3 class="agenda-item__title">{{ title }}</h3>
        <p v-if="isTalkItem" class="agenda-item__talk">
          <span>{{ speaker }}</span>
          <span class="agenda-item__dot"></span>
          <span class="agenda-item__lang">{{ language }}</span>
        </p>
        <p v-if="description">{{ description }}</p>
      </div>
    </div>`,
});
