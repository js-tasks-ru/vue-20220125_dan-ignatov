<template>
  <div class="toasts">
    <template v-for="item in items" :key="item.key">
      <div class="ToasterItem">
        <the-toast :type="item.type">{{ item.message }}</the-toast>
      </div>
    </template>
  </div>
</template>

<script>
import TheToast, { ToastTypes } from './TheToast';

const closeToastTimeout = 5000;

function createToasterDataItem(type, message) {
  return {
    type,
    message,
    closeToastTimeout,
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
      newItem.timeoutId = setTimeout(
        () => (this.items = this.items.filter((item) => item.key !== newItem.key)),
        closeToastTimeout,
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
  padding-top: 20px;
}
</style>
