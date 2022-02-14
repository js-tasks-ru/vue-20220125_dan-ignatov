<template>
  <div class="toasts" :class="cssClass">
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

export default {
  name: 'TheToasterSingleComponent',

  components: { UiIcon },

  props: {
    closeToastTimeout: {
      type: Number,
      default: 5000,
    },
    toastsAlign: {
      type: String,
      default: 'right',
    },
  },

  data() {
    return {
      items: new Array(),
    };
  },

  computed: {
    cssClass() {
      return {
        toast_alignRight: this.toastsAlign === 'right',
        toast_alignLeft: this.toastsAlign !== 'right',
      };
    },
  },

  beforeUnmount() {
    this.items?.foreach((item) => clearTimeout(item.timeoutId));
  },

  methods: {
    _addItem(type, message) {
      const newItem = { type, message };
      newItem.timeoutId = setTimeout(() => this.items.splice(this.items.indexOf(newItem), 1), this.closeToastTimeout);
      newItem.key = newItem.timeoutId;
      this.items.push(newItem);
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
  display: flex;
  flex-direction: column;
  justify-content: flex-end;
  white-space: pre-wrap;
  z-index: 999;
}

.toast_alignRight {
  right: 8px;
}

.toast_alignLeft {
  left: 8px;
}

@media all and (min-width: 992px) {
  .toasts {
    bottom: 72px;
  }

  .toast_alignRight {
    right: 112px;
  }

  .toast_alignLeft {
    left: 112px;
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
