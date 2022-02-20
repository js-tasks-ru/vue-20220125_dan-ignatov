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

    <ui-form-group :label="currentFieldsSettings['title']?.caption">
      <ui-input v-model="internalAgendaItem.title" name="title" />
    </ui-form-group>
    <ui-form-group :label="currentFieldsSettings['speaker']?.caption" v-if="!!currentFieldsSettings['speaker']">
      <ui-input v-model="internalAgendaItem.speaker" name="speaker" />
    </ui-form-group>
    <ui-form-group :label="currentFieldsSettings['description']?.caption" v-if="!!currentFieldsSettings['description']">
      <ui-input v-model="internalAgendaItem.description" multiline name="description" />
    </ui-form-group>
    <ui-form-group :label="currentFieldsSettings['language']?.caption" v-if="!!currentFieldsSettings['language']">
      <ui-dropdown v-model="internalAgendaItem.language" title="Язык" :options="$options.talkLanguageOptions" name="language" />
    </ui-form-group>
  </fieldset>
</template>

<script setup>
//
// https://github.com/vuejs/rfcs/issues/55
// https://vuejs.org/api/sfc-script-setup.html
// https://vuejs.org/guide/extras/composition-api-faq.html#better-logic-reuse
// https://vuejs.org/api/sfc-script-setup.html#using-components
// https://vuejs.org/api/reactivity-core.html
// https://vuejs.org/api/composition-api-setup.html
// https://vuejs.org/api/#composition-api
//

import { watch, ref, defineProps, defineEmits, computed } from 'vue';

const props = defineProps({
  agendaItem: {
    type: Object,
    required: true,
  },
});

const internalAgendaItem = ref({ ...props.agendaItem });
const emit = defineEmits(['update:agendaItem', 'remove']);

watch(
  // https://vuejs.org/api/reactivity-core.html#watch
  // https://www.thisdot.co/blog/vue-3-composition-api-watch-and-watcheffect
  // https://mokkapps.de/blog/why-i-love-vue-3-s-composition-api/
  internalAgendaItem,
  ( newValue ) => emit('update:agendaItem', { ...newValue }),
  { deep: true, }
);

const startsAt = computed(() => internalAgendaItem.value.startsAt);
watch(
  startsAt,
  ( newValue, oldValue ) => {
    const oldStartsAtHours = Number(oldValue.split(':')[0]);
    const oldStartsAtMinutes = Number(oldValue.split(':')[1]);
    const oldStartsAtDate = new Date(0, 0, 0, oldStartsAtHours, oldStartsAtMinutes);
    
    const endsAtHours = Number(internalAgendaItem.value.endsAt.split(':')[0]);
    const endsAtMinutes = Number(internalAgendaItem.value.endsAt.split(':')[1]);
    const endsAtDate = new Date(0, 0, 0, endsAtHours, endsAtMinutes);
    
    const durationMS = endsAtDate.getTime() - oldStartsAtDate.getTime();
    
    const newStartsAtHours = Number(newValue.split(':')[0]);
    const newStartsAtMinutes = Number(newValue.split(':')[1]);

    const newEndsAtDate = new Date(0, 0, 0, newStartsAtHours, newStartsAtMinutes + durationMS / (60 * 1000));
    const newEndsAtHoursString = newEndsAtDate.getHours().toString().padStart(2, '0');
    const newEndsAtMinutesString = newEndsAtDate.getMinutes().toString().padStart(2, '0');

    internalAgendaItem.value.endsAt = `${newEndsAtHoursString}:${newEndsAtMinutesString}`;
  },
);

const fieldsSettings = {
  talk: {
    title: { caption: 'Тема' },
    speaker: { caption: 'Докладчик' },
    description: { caption: 'Описание' },
    language:  { caption: 'Язык' }
  },
  other: {
    title: { caption: 'Заголовок' },
    description: { caption: 'Описание' },
  },
  default: {
    title: { caption: 'Нестандартный текст (необязательно)' },
  },
};

const currentFieldsSettings = computed(() => {
  return fieldsSettings[internalAgendaItem.value.type] || fieldsSettings.default;
});

</script>

<script>
import UiIcon from './UiIcon';
import UiFormGroup from './UiFormGroup';
import UiInput from './UiInput';
import UiDropdown from './UiDropdown';

function getData() {
    // Move to function to avoid error in tests:
    //
    // ● Test suite failed to run

    // C:\Work\GitHub\vue-20220125_dan-ignatov\07-forms\03-MeetupAgendaItemForm\components\MeetupAgendaItemForm.vue:84       
    // const agendaItemTypeIcons = {
    //       ^

    // SyntaxError: Identifier 'agendaItemTypeIcons' has already been declared
    //   1 | import { mount } from '@vue/test-utils';
    // > 2 | const MeetupAgendaItemForm = require(global.getSolutionPath('components/MeetupAgendaItemForm')).default;        
    //     |                              ^
    //   3 |

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

  return {
    agendaItemTypeOptions,
    talkLanguageOptions,
  };
}

export default {
  name: 'MeetupAgendaItemForm',

  agendaItemTypeOptions: getData().agendaItemTypeOptions,
  talkLanguageOptions: getData().talkLanguageOptions,

  components: { UiIcon, UiFormGroup, UiInput, UiDropdown },
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
