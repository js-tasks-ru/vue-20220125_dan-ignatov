<template>
  <div class="toasts">
    <template v-for="item in items" :key="item.key">
      <div v-if="item.type === 'success'" class="toast toast_success">
        <ui-icon class="toast__icon" icon="check-circle" />
        <span>{{ item.message }}</span>
      </div>

      <div v-else class="toast toast_error">
        <ui-icon class="toast__icon" icon="alert-circle" />
        <span>{{ item.message }}</span>
      </div>
    </template>
  </div>
</template>

<!--
  Убирать "v-if" и переходить на :class="`toast_${item.type}`"
  не хочу потому что надо менять и icon="alert-circle"
  а там названия не совпадают с типами сообщений
-->

<script>
import UiIcon from './UiIcon';

const leaveTimeout = 5000;

function createToasterDataItem(type, message) {
  return {
    key: new Date().getTime() + message + type, // I don't think we need uuid in learning samples
    type,
    message,
    leaveTimeout,
  };
}

export default {
  name: 'TheToasterSingleComponent',

  components: { UiIcon },

  data() {
    return {
      items: new Array(),
    };
  },

  beforeUnmount() {
    this.items?.foreach((item) => clearTimeout(item.timeoutId));
  },

  methods: {
    _addItem(type, message) {
      const newItem = createToasterDataItem(type, message);
      this.items.push(newItem);
      newItem.timeoutId = setTimeout(
        () => (this.items = this.items.filter((item) => item.key !== newItem.key)),
        leaveTimeout,
      );
    },
    success(message) {
      this._addItem('success', message);
    },
    error(message) {
      this._addItem('error', message);
    },
  },
};
</script>

<style scoped>
.toasts {
  position: fixed;
  bottom: 8px;
  right: 8px;
  display: flex;
  flex-direction: column;
  justify-content: flex-end;
  white-space: pre-wrap;
  z-index: 999;
}

@media all and (min-width: 992px) {
  .toasts {
    bottom: 72px;
    right: 112px;
  }
}

.toast {
  display: flex;
  flex: 0 0 auto;
  flex-direction: row;
  align-items: center;
  padding: 16px;
  background: #ffffff;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.15);
  border-radius: 4px;
  font-size: 18px;
  line-height: 28px;
  width: auto;
}

.toast + .toast {
  margin-top: 20px;
}

.toast__icon {
  margin-right: 12px;
}

.toast.toast_success {
  color: var(--green);
}

.toast.toast_error {
  color: var(--red);
}
</style>
