<template>
  <the-toaster ref="toaster" close-toast-timeout="2000" toastsAlign="right" />
  <p>
    <button @click="success">Add Success Message</button>
    <button @click="error">Add Error Message</button>
  </p>

  <hr style="margin: 20px 0" />
  TheToasterSingleComponent

  <the-toaster-single-component ref="toasterSingleComponent" toastsAlign="left" />
  <p>
    <button @click="successSingleComponent">Add Success Message</button>
    <button @click="errorSingleComponent">Add Error Message</button>
  </p>
</template>

<script>
import TheToaster from './components/TheToaster';
import TheToasterSingleComponent from './components/TheToasterSingleComponent';

export default {
  name: 'App',

  components: { TheToaster, TheToasterSingleComponent },

  methods: {
    success() {
      this.$refs.toaster.success('Success ' + new Date().toLocaleTimeString());
    },

    error() {
      this.$refs.toaster.error('Error ' + new Date().toLocaleTimeString());
    },

    successSingleComponent() {
      this.$refs.toasterSingleComponent.success('Success ' + new Date().toLocaleTimeString());
    },

    errorSingleComponent() {
      this.$refs.toasterSingleComponent.error('Error ' + new Date().toLocaleTimeString());
    },
  },
};
</script>

<style></style>
