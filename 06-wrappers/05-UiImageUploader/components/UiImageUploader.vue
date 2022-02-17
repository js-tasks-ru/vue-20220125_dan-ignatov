<template>
  <div class="image-uploader">
    <label
      class="image-uploader__preview image-uploader__preview-loading"
      :style="{ '--bg-url': preview ? `url('${preview}')` : null }"
      @click="handleClick"
    >
      <span class="image-uploader__text">{{ backgroundText }}</span>
      <input type="file" v-bind="$attrs" accept="image/*" class="image-uploader__input" @change="handleChange" />
    </label>
  </div>
</template>

<script>
// Some library component: https://vuetifyjs.com/en/components/file-inputs/

const backgroundTexts = {
  noImage: 'Загрузить изображение',
  loading: 'Загрузка',
  remove: 'Удалить изображение',
};

export default {
  name: 'UiImageUploader',

  inheritAttrs: false,

  props: {
    preview: String, // ссылка на отображаемое изображение;
    uploader: Function, // асинхронная функция загрузки изображения.
  },

  emits: [
    'select', // В любом случае после выбора файла порождается событие select с выбранным файлом.
    'upload', // После успешного окончания загрузки порождается событие upload с результатом работы загрузчика.
    'error', // При неуспешной загрузке изображения порождается событие error с ошибкой загрузчика, а компонент возвращается в предыдущее состояние.
    'remove', // При наличии выбранного изображения по клику удаляется изображение и порождается событие remove.
  ],

  data() {
    return {
      isLoading: false,
      //imageUrl: '/link.jpeg',
      //imageUrl: 'https://course-vue.javascript.ru/api/images/1',
    };
  },

  computed: {
    backgroundText() {
      if (this.isLoading) {
        return backgroundTexts.loading;
      } else if (this.preview) {
        return backgroundTexts.remove;
      }
      return backgroundTexts.noImage;
    },
  },

  methods: {
    handleClick() {
      this.imageUrl = null;
      this.imageUrl1 = null;
    },
    // handleCLick() {
    //   Handle the 'select the same file' scenario:
    //   https://stackoverflow.com/questions/12030686/html-input-file-selection-event-not-firing-upon-selecting-the-same-file
    // }

    handleChange(e) {
      //
      // v-model doesn't support 'file': https://stackoverflow.com/questions/64607995/v-model-directives-dont-support-input-type-file
      // "c:\fakepath\" + URL.createObjectURL: https://html.spec.whatwg.org/multipage/input.html#fakepath-srsly
      // updateImageDisplay: https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input/file#examples
      //
      const files = e.target.files || e.dataTransfer.files;
      if (!files.length) {
        return;
      }

      const imageUrl = URL.createObjectURL(files[0]);

      // Notify parent that there is a new value to receive it through 'preview' and show
      // Otherwise, there will be no reaction to new 'preview' value if it was changed in parent
      this.$emit('upload', { image: imageUrl });

      this.$emit('select', imageUrl);
    },
  },
};
</script>

<style scoped>
.image-uploader {
}

.image-uploader__input {
  opacity: 0;
  height: 0;
}

.image-uploader__preview {
  --bg-url: var(--default-cover);
  background-size: cover;
  background-position: center;
  background-image: linear-gradient(0deg, rgba(0, 0, 0, 0.4), rgba(0, 0, 0, 0.4)), var(--bg-url);
  border: 2px solid var(--blue-light);
  border-radius: 8px;
  transition: 0.2s border-color;
  cursor: pointer;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  max-width: 512px;
  height: 228px;
}

.image-uploader__text {
  color: var(--white);
  font-family: 'Nunito', sans-serif;
  font-weight: 600;
  font-size: 20px;
  line-height: 28px;
}

.image-uploader__preview:hover {
  border-color: var(--blue);
}

.image-uploader__preview.image-uploader__preview-loading {
  cursor: no-drop;
}
</style>
