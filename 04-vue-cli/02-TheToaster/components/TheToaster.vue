<template>
  <div class="toasts" :class="cssClass">
    <template v-for="item in items" :key="item.key">
      <div class="ToasterItem">
        <toast :type="item.type">{{ item.message }}</toast>
      </div>
    </template>
  </div>
</template>

<script>
import Toast, { ToastTypes } from './Toast';

export default {
  name: 'TheToaster',

  components: { Toast },

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
      // Map or Set can be a bit faster, but there will no be more than 100 items
      // and I found only a list of Array wrapped methods: https://vuejs.org/guide/essentials/list.html#array-change-detection
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
      newItem.timeoutId = setTimeout(
        () => (this.items = this.items.filter((item) => item.key !== newItem.key)), // indexOf + splice
        this.closeToastTimeout,
      );
      newItem.key = newItem.timeoutId;
      this.items.push(newItem);
    },
    success(message) {
      this._addItem(ToastTypes.success.name, message);
    },
    error(message) {
      this._addItem(ToastTypes.error.name, message);
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

.ToasterItem + .ToasterItem {
  padding-top: 20px;
}
</style>
