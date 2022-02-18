<template>
  <ui-input ref="uiInput" v-model="modelValueAsString" :type="type" v-bind="$attrs">
    <template v-for="(_, slot) in $slots" #[slot]="scope">
      <slot :name="slot" v-bind="scope" />
    </template>
  </ui-input>
</template>

<script>
//
// https://stackoverflow.com/questions/50891858/vue-how-to-pass-down-slots-inside-wrapper-component
// convertUTCDateToLocalDate - https://stackoverflow.com/questions/6525538/convert-utc-date-time-to-local-date-time
//
import UiInput from './UiInput';

export default {
  name: 'UiInputDate',

  components: { UiInput },

  inheritAttrs: false,

  props: {
    type: {
      type: String,
      validator: (val) => ['date', 'time', 'datetime-local'].includes(val),
      default: 'date',
    },
    modelValue: {
      type: [Number, Object],
      validator: (val) => typeof val === 'number' || val === null,
    },
  },

  emits: ['update:modelValue'],

  computed: {
    modelValueAsString: {
      get() {
        if (!this.modelValue) {
          return;
        }
        const localDate = new Date(this.modelValue);
        const utcDateInISOStringFormat = localDate.toISOString();
        // const localDateInISOStringFormat = new Date(
        //   localDate.getTime() - localDate.getTimezoneOffset() * 60 * 1000,
        // ).toISOString();

        if (this.type === 'date') {
          // https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input/date
          return utcDateInISOStringFormat.slice(0, 10);
        }
        if (this.type === 'time') {
          // https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input/time
          return utcDateInISOStringFormat.slice(11, 16);
        }
        if (this.type === 'datetime-local') {
          // https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input/datetime-local
          return utcDateInISOStringFormat.slice(0, 23);
        }
        return null;
      },
      set() {
        const inputValue = this.$refs.uiInput.$refs.input.valueAsNumber;
        this.$emit('update:modelValue', inputValue);
      },
    },
  },
};
</script>
