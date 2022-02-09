<template>
  <div class="toast" :class="cssClass">
    <ui-icon class="toast__icon" :icon="iconName" />
    <span>{{ message }}</span>
  </div>
</template>

<script>
import UiIcon from './UiIcon';

const ToastTypes = {
  success: {
    name: 'success',
    iconName: 'check-circle',
    cssClass: 'toast_success',
  },
  error: {
    name: 'error',
    iconName: 'alert-circle',
    cssClass: 'toast_error',
  },
};

export { ToastTypes };

export default {
  name: 'TheToast',

  components: { UiIcon },

  props: {
    message: {
      type: String,
      required: true,
    },
    type: {
      type: String,
      required: true,
      validator: (name) => Object.keys(ToastTypes).includes(name),
    },
  },

  computed: {
    cssClass() {
      return ToastTypes[this.type].cssClass;
    },
    iconName() {
      return ToastTypes[this.type].iconName;
    },
  },
};
</script>

<style scoped>
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
