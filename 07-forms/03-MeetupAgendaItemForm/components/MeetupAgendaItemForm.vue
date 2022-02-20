<template>
  <fieldset class="agenda-item-form">
    <button type="button" class="agenda-item-form__remove-button">
      <ui-icon icon="trash" />
    </button>

    <ui-form-group>
      <ui-dropdown v-model="internalAgendaItem.type" title="Тип" :options="$options.agendaItemTypeOptions" name="type" />
    </ui-form-group>

    <div class="agenda-item-form__row">
      <div class="agenda-item-form__col">
        <ui-form-group label="Начало">
          <ui-input v-model="internalAgendaItem.startsAt" type="time" placeholder="00:00" name="startsAt" />
        </ui-form-group>
      </div>
      <div class="agenda-item-form__col">
        <ui-form-group label="Окончание">
          <ui-input v-model="internalAgendaItem.endsAt" type="time" placeholder="00:00" name="endsAt" />
        </ui-form-group>
      </div>
    </div>

    <ui-form-group label="Тема">
      <ui-input v-model="internalAgendaItem.title" name="title" />
    </ui-form-group>
    <ui-form-group label="Докладчик">
      <ui-input v-model="internalAgendaItem.speaker" name="speaker" />
    </ui-form-group>
    <ui-form-group label="Описание">
      <ui-input v-model="internalAgendaItem.description" multiline name="description" />
    </ui-form-group>
    <ui-form-group label="Язык">
      <ui-dropdown v-model="internalAgendaItem.language" title="Язык" :options="$options.talkLanguageOptions" name="language" />
    </ui-form-group>
  </fieldset>
</template>

<script setup>
//
// https://vuejs.org/api/sfc-script-setup.html
// https://github.com/vuejs/rfcs/issues/55
// https://vuejs.org/guide/extras/composition-api-faq.html#better-logic-reuse
// https://vuejs.org/api/sfc-script-setup.html#using-components
// https://vuejs.org/api/reactivity-core.html
// https://vuejs.org/api/composition-api-setup.html
// https://vuejs.org/api/#composition-api
//

// TODO:
// const agendaItemAPI = {
//   type, startsAt, endsAt, title, description, speaker, language,
// };

import { watch, ref, defineProps, defineEmits } from 'vue';

const props = defineProps({
  agendaItem: {
    type: Object,
    required: true,
  },
});

const internalAgendaItem = ref({ ...props.agendaItem });
const emit = defineEmits(['update:agendaItem']);

watch(
  internalAgendaItem,
  () => emit('update:agendaItem', { ...internalAgendaItem.value }),
  { deep: true, }
);

// const type = ref(props.agendaItem.type);
// const startsAt = ref(props.agendaItem.startsAt);
// const endsAt = ref(props.agendaItem.endsAt);
// const title = ref(props.agendaItem.title);
// const description = ref(props.agendaItem.description);
// const speaker = ref(props.agendaItem.speaker);
// const language = ref(props.agendaItem.language);

// const emit = defineEmits(['update:agendaItem']);

// watch([type, startsAt, endsAt, title, description, speaker, language], (newValuesArray) => {
//   emit('update:agendaItem', { type: newValuesArray[0] });
//   //{type, startsAt, endsAt, title, description, speaker, language
//   //newValuesArray
// });
</script>

<script>
import UiIcon from './UiIcon';
import UiFormGroup from './UiFormGroup';
import UiInput from './UiInput';
import UiDropdown from './UiDropdown';

const agendaItemTypeIcons = {
  registration: 'key',
  opening: 'cal-sm',
  talk: 'tv',
  break: 'clock',
  coffee: 'coffee',
  closing: 'key',
  afterparty: 'cal-sm',
  other: 'cal-sm',
};

const agendaItemDefaultTitles = {
  registration: 'Регистрация',
  opening: 'Открытие',
  break: 'Перерыв',
  coffee: 'Coffee Break',
  closing: 'Закрытие',
  afterparty: 'Afterparty',
  talk: 'Доклад',
  other: 'Другое',
};

const agendaItemTypeOptions = Object.entries(agendaItemDefaultTitles).map(([type, title]) => ({
  value: type,
  text: title,
  icon: agendaItemTypeIcons[type],
}));

const talkLanguageOptions = [
  { value: null, text: 'Не указано' },
  { value: 'RU', text: 'RU' },
  { value: 'EN', text: 'EN' },
];

export default {
  name: 'MeetupAgendaItemForm',

  agendaItemTypeOptions,
  talkLanguageOptions,

  components: { UiIcon, UiFormGroup, UiInput, UiDropdown },

  // props: {
  //   agendaItem: {
  //     type: Object,
  //     required: true,
  //   },
  // },

  // data() {
  //   return {
  //     internalAgendaItem: { ...this.agendaItem },
  //   };
  // },

  // watch: {
  //   internalAgendaItem: {
  //     deep: true,
  //     handler() {
  //       this.$emit('update:agendaItem', { ...this.internalAgendaItem });
  //     },
  //   },
  // },
};
</script>

<style scoped>
.agenda-item-form {
  border: 2px solid var(--blue-light);
  border-radius: 8px;
  position: relative;
  padding: 20px 10% 0 16px;
}

.agenda-item-form__remove-button {
  position: absolute;
  top: 4px;
  right: 0;
  box-shadow: none;
  border: none;
  background-color: transparent;
  outline: none;
  padding: 4px;
  cursor: pointer;
  transition: 0.2s opacity;
}

.agenda-item-form__remove-button:hover {
  opacity: 0.6;
}

.agenda-item-form__row {
  display: flex;
  flex-direction: column;
}

.agenda-item-form__col + .agenda-item-form__col {
  margin-top: 16px;
}

.agenda-item-form__col:first-child {
  margin-left: 0;
}

@media all and (min-width: 992px) {
  .agenda-item-form {
    padding: 28px 25% 4px 24px;
  }

  .agenda-item-form__remove-button {
    top: 20px;
    right: 20px;
  }

  .agenda-item-form__row {
    flex-direction: row;
    justify-content: space-between;
    margin: 0 -12px;
  }

  .agenda-item-form__col {
    flex: 1 1 auto;
    padding: 0 12px;
  }

  .agenda-item-form__col + .agenda-item-form__col {
    margin-top: 0;
  }

  .agenda-item-form__col:first-child {
    margin-left: 0;
  }
}
</style>
