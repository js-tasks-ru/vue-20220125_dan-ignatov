<template>
  <fieldset class="agenda-item-form">
    <button type="button" class="agenda-item-form__remove-button" @click.prevent="$emit('remove')">
      <ui-icon icon="trash" />
    </button>

    <ui-form-group>
      <ui-dropdown
        v-model="internalAgendaItem.type"
        title="Тип"
        :options="$options.agendaItemTypeOptions"
        name="type"
      />
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

    <ui-form-group v-for="uiItem in uiSchema" :key="uiItem.props.name" :label="uiItem.label">
      <component :is="uiItem.component" v-model="internalAgendaItem[uiItem.props.name]" v-bind="uiItem.props">
      </component>
    </ui-form-group>
  </fieldset>
</template>

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

/**
 * @typedef FormItemSchema
 * @property {string} label
 * @property {string|object} component
 * @property {object} props
 */
/** @typedef {string} AgendaItemField */
/** @typedef {string} AgendaItemType */
/** @typedef {Object.<AgendaItemType, FormItemSchema>} FormSchema */

const mutableAgendaItemProperties = ['speaker', 'description', 'language'];

/** @type FormSchema */
const commonAgendaItemFormSchema = {
  title: {
    label: 'Нестандартный текст (необязательно)',
    component: 'ui-input',
    props: {
      name: 'title',
    },
  },
};

/** @type {Object.<AgendaItemField, FormSchema>} */
const agendaItemFormSchemas = {
  registration: commonAgendaItemFormSchema,
  opening: commonAgendaItemFormSchema,
  talk: {
    title: {
      label: 'Тема',
      component: 'ui-input',
      props: {
        name: 'title',
      },
    },
    speaker: {
      label: 'Докладчик',
      component: 'ui-input',
      props: {
        name: 'speaker',
      },
    },
    description: {
      label: 'Описание',
      component: 'ui-input',
      props: {
        multiline: true,
        name: 'description',
      },
    },
    language: {
      label: 'Язык',
      component: 'ui-dropdown',
      props: {
        options: talkLanguageOptions,
        title: 'Язык',
        name: 'language',
      },
    },
  },
  break: commonAgendaItemFormSchema,
  coffee: commonAgendaItemFormSchema,
  closing: commonAgendaItemFormSchema,
  afterparty: commonAgendaItemFormSchema,
  other: {
    title: {
      label: 'Заголовок',
      component: 'ui-input',
      props: {
        name: 'title',
      },
    },
    description: {
      label: 'Описание',
      component: 'ui-input',
      props: {
        multiline: true,
        name: 'description',
      },
    },
  },
};

function calclNewEndsAt({ oldStartsAt, oldEndsAt, newStartsAt }) {
  const oldStartsAtHours = Number(oldStartsAt.split(':')[0]);
  const oldStartsAtMinutes = Number(oldStartsAt.split(':')[1]);
  const oldStartsAtDate = new Date(0, 0, 0, oldStartsAtHours, oldStartsAtMinutes);

  const endsAtHours = Number(oldEndsAt.split(':')[0]);
  const endsAtMinutes = Number(oldEndsAt.split(':')[1]);
  const endsAtDate = new Date(0, 0, 0, endsAtHours, endsAtMinutes);

  const durationMS = endsAtDate.getTime() - oldStartsAtDate.getTime();

  const newStartsAtHours = Number(newStartsAt.split(':')[0]);
  const newStartsAtMinutes = Number(newStartsAt.split(':')[1]);

  const newEndsAtDate = new Date(0, 0, 0, newStartsAtHours, newStartsAtMinutes, 0, durationMS);
  const newEndsAtHoursString = newEndsAtDate.getHours().toString().padStart(2, '0');
  const newEndsAtMinutesString = newEndsAtDate.getMinutes().toString().padStart(2, '0');

  return `${newEndsAtHoursString}:${newEndsAtMinutesString}`;
}

export default {
  name: 'MeetupAgendaItemForm',

  components: { UiIcon, UiFormGroup, UiInput, UiDropdown },

  agendaItemTypeOptions,
  agendaItemFormSchemas,

  props: {
    agendaItem: {
      type: Object,
      required: true,
    },
  },

  emits: ['update:agendaItem', 'remove'],

  data() {
    return {
      internalAgendaItem: { ...this.agendaItem },
    };
  },

  computed: {
    uiSchema() {
      return agendaItemFormSchemas[this.internalAgendaItem.type];
    },
    startsAt() {
      return this.internalAgendaItem.startsAt;
    },
  },

  watch: {
    // по тестам введенные значения не должны удаляться при смене типа
    // uiSchema: function(newValue) {
    //   const uiSchemaProperties = Object.keys(newValue);
    //   mutableAgendaItemProperties.forEach((propertyName) => {
    //     if(!uiSchemaProperties.includes(propertyName)) {
    //       this.internalAgendaItem[propertyName] = undefined;
    //     }
    //   });
    // },

    startsAt: function (newValue, oldValue) {
      this.internalAgendaItem.endsAt = calclNewEndsAt({
        oldStartsAt: oldValue,
        newStartsAt: newValue,
        oldEndsAt: this.internalAgendaItem.endsAt,
      });
    },

    internalAgendaItem: {
      deep: true,
      handler(newValue) {
        const eventValue = { ...newValue };
        this.$emit('update:agendaItem', { ...newValue });
      },
    },
  },
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
