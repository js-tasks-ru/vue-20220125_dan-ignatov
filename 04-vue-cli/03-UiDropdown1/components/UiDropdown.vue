<template>
  <div class="dropdown" :class="css__dropdown">
    <button type="button" class="dropdown__toggle" :class="css__dropdown__toggle" @click="toggleDropDown">
      <ui-icon v-if="displayIcon" :icon="displayIcon" class="dropdown__icon" :class="css__dropdown__icon" />
      <span>{{ displayText }}</span>
    </button>

    <div
      class="dropdown__menu"
      :class="css__dropdown__menu"
      role="listbox"
      :style="isDropDownOpened ? '' : 'visibility: hidden; for-testes-only;'"
    >
      <button
        v-for="optionItem in options"
        :key="optionItem.value"
        class="dropdown__item"
        :class="css__dropdown__item"
        role="option"
        type="button"
        @click="onItemClicked(optionItem.value)"
      >
        <ui-icon v-if="optionItem.icon" :icon="optionItem.icon" class="dropdown__icon" />
        {{ optionItem.text }}
      </button>
    </div>
  </div>
  <!--
    'v-show' sets "display:none", but such fields will be submitted.
    https://vuejs.org/guide/essentials/conditional.html#v-if-vs-v-show
   -->
  <select v-show="false">
    <option
      v-for="optionItem in options"
      :key="optionItem.value"
      :value="optionItem.value"
      :selected="modelValue === optionItem.value"
    ></option>
  </select>
</template>

<script>
import UiIcon from './UiIcon';

export default {
  name: 'UiDropdown',

  components: { UiIcon },

  props: {
    options: {
      type: Array,
      required: true,
    },
    // Default property name for 'v-model="selectedType"'
    // https://v3.ru.vuejs.org/ru/guide/migration/v-model.html#%D1%81%D0%B8%D0%BD%D1%82%D0%B0%D0%BA%D1%81%D0%B8%D1%81-%D0%B2-3-x
    modelValue: {
      type: String,
      // validator: see this.methods.validateProps
    },
    title: {
      type: String,
      required: true,
    },
  },

  emits: { 'update:modelValue': null },

  data() {
    return {
      isDropDownOpened: false,
      hasIconsInOptions: false,
    };
  },

  computed: {
    css__dropdown() {
      return {
        dropdown_opened: this.isDropDownOpened,
      };
    },
    css__dropdown__menu() {
      return {
        dropdown__menu_invisible: !this.isDropDownOpened,
      };
    },
    css__dropdown__toggle() {
      return {
        dropdown__toggle_icon: this.hasIconsInOptions,
      };
    },
    css__dropdown__icon() {
      return {
        dropdown__icon_nodisplay: !this.hasIconsInOptions,
      };
    },
    css__dropdown__item() {
      return {
        dropdown__item_icon: this.hasIconsInOptions,
      };
    },
    displayText() {
      const displayText = this.modelValue && this.options?.find((item) => item?.value === this.modelValue)?.text;
      return displayText || this.modelValue || this.title;
    },
    displayIcon() {
      return this.modelValue && this.options?.find((item) => item?.value === this.modelValue)?.icon;
    },
  },

  watch: {
    $props: {
      immediate: true,
      handler() {
        this.validateProps();
        this.hasIconsInOptions = this.options?.find((item) => item.icon);
      },
    },
  },

  methods: {
    toggleDropDown() {
      this.isDropDownOpened = !this.isDropDownOpened;
    },
    validateProps() {
      if (this.modelValue && this.options && !this.options.find((item) => item.value === this.modelValue)) {
        // eslint-disable-next-line no-console
        console.error(`${this.$.type.name}: The 'options' array doesn't contain the '${this.modelValue}' value`);
      }
    },
    onItemClicked(value) {
      this.isDropDownOpened = false;
      this.$emit('update:modelValue', value);
    },
  },
};
</script>

<style scoped>
.dropdown {
  position: relative;
  display: inline-block;
}

.dropdown__toggle {
  display: inline-block;
  background-color: var(--white);
  background-position: calc(100% - 10px) calc(100% - 10px);
  border: 2px solid var(--blue-light);
  border-radius: 8px;
  position: relative;
  padding: 10px 56px 10px 24px;
  font-weight: 500;
  font-size: 20px;
  line-height: 28px;
  color: initial;
  text-align: center;
  transition-duration: 0.2s;
  transition-property: background-color, fill, color;
  outline: none;
  box-shadow: none;
  cursor: pointer;
  text-decoration: none;
}

.dropdown__toggle:after {
  content: '';
  position: absolute;
  top: 15px;
  right: 16px;
  transform: none;
  background: url('~@/assets/icons/icon-chevron-down.svg') no-repeat;
  background-size: cover;
  display: block;
  width: 24px;
  height: 24px;
  transition: 0.2s transform;
}

.dropdown__toggle.dropdown__toggle_icon {
  padding-left: 56px;
}

.dropdown_opened .dropdown__toggle {
  border-color: var(--blue);
  border-bottom-color: transparent;
  border-bottom-left-radius: 0;
  border-bottom-right-radius: 0;
}

.dropdown_opened .dropdown__toggle:after {
  transform: rotate(180deg);
}

.dropdown__menu {
  margin: 0;
  width: 100%;
  padding: 0;
  border-radius: 0 0 8px 8px;
  left: 0;
  z-index: 95;
  background-clip: padding-box;
  display: none;
  flex-direction: column;
  border: 2px solid var(--blue);
  border-top: none;
  overflow: hidden;
}

.dropdown__menu_invisible {
  visibility: hidden;
}

.dropdown_opened .dropdown__menu {
  display: flex;
  position: absolute;
  transform: translate3d(0px, 52px, 0px);
  top: -1px;
  left: 0;
  will-change: transform;
  right: auto;
  bottom: auto;
}

.dropdown__item {
  padding: 8px 16px;
  font-weight: 500;
  font-size: 20px;
  line-height: 28px;
  background-color: var(--white);
  box-shadow: none;
  border: none;
  cursor: pointer;
  text-align: left;
  transition-duration: 0.2s;
  transition-property: background-color, border-color, color;
  outline: none;
  text-decoration: none;
}

.dropdown__item:hover,
.dropdown__item:focus {
  background-color: var(--grey-light);
}

.dropdown__item.dropdown__item_icon {
  padding-left: 56px;
  position: relative;
}

.dropdown__item.dropdown__item_icon .dropdown__icon,
.dropdown__toggle_icon .dropdown__icon {
  position: absolute;
  top: 50%;
  left: 16px;
  transform: translate(0, -50%);
}

.dropdown__icon_nodisplay {
  display: none;
}
</style>
