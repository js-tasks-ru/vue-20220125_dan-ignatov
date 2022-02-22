<template>
  <button @click="handleClick">{{ internalCount }}</button>
</template>

<script>
export default {
  name: 'CounterButton',

  props: {
    count: {
      type: Number,
      default: 0,
    },
  },

  emits: ['update:count'],

  data() {
    return {
      internalCount: this.count,
    };
  },

  watch: {
    count: function (newValue, oldValue) {
      this.internalCount = newValue;
    },
    internalCount: function (newValue, oldValue) {
      // Handle changes from Vue Dev Tools
      this.$emit('update:count', this.internalCount);
    },
  },

  methods: {
    handleClick() {
      this.internalCount = this.internalCount + 1;
    },
  },
};
</script>
