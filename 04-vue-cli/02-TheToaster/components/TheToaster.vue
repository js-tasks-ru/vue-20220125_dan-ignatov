<template>
  <div class="toasts">
    <template v-for="item in items" :key="item.key">
      <div class="ToasterItem">
        <the-toast :type="item.type" :message="item.message"></the-toast>
      </div>
    </template>
  </div>
</template>

<script>
import TheToast, { ToastTypes } from './TheToast';

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
  name: 'TheToaster',

  components: { TheToast },

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

.ToasterItem + .ToasterItem {
  margin-top: 20px;
}
</style>
