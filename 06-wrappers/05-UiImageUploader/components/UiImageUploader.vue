<template>
  <div class="image-uploader">
    <label
      class="image-uploader__preview"
      :style="{ '--bg-url': preview ? `url('${preview}')` : null }"
      :class="{ 'image-uploader__preview-loading': isLoading }"
    >
      <span class="image-uploader__text">{{ backgroundText }}</span>
      <input
        ref="fileInput"
        type="file"
        v-bind="$attrs"
        accept="image/*"
        class="image-uploader__input"
        @change="handleInputChange"
        @click="handleInputClick"
      />
    </label>
  </div>
</template>

<script>
// 'File' component from vuetifyjs: https://vuetifyjs.com/en/components/file-inputs/

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
    handleInputChange(e) {
      //
      // v-model doesn't support 'file': https://stackoverflow.com/questions/64607995/v-model-directives-dont-support-input-type-file
      // "c:\fakepath\" + URL.createObjectURL: https://html.spec.whatwg.org/multipage/input.html#fakepath-srsly
      // updateImageDisplay: https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input/file#examples
      //
      const files = e.target.files || e.dataTransfer.files;
      if (!files.length) {
        return;
      }
      if (files.length > 1) {
        throw Error('"files.length > 1" is not supported');
      }

      const newImageUrl = URL.createObjectURL(files[0]);

      // Notify parent that there is a new value to receive it through 'preview' and show
      // Otherwise, provide a reaction to new 'preview' value if it was changed in parent
      // this.$emit('upload', { image: newImageUrl });
      if (this.uploader) {
        this.isLoading = true;
        this.uploader(files[0]).then(
          (successResult) => {
            this.isLoading = false;
            this.$emit('upload', { image: successResult.image });
          },
          (errorResult) => {
            this.isLoading = false;
            //console.log(errorResult);
            this.$emit('error', errorResult);
            this.$emit('select', { image: null });
          },
        );
      }

      this.$emit('select', { image: newImageUrl });
    },

    handleInputClick(event) {
      if (this.isLoading) {
        event.preventDefault();
      } else if (this.preview) {
        //   https://stackoverflow.com/questions/12030686/html-input-file-selection-event-not-firing-upon-selecting-the-same-file

        this.$refs.fileInput.value = null;
        event.preventDefault();

        this.$emit('upload', { image: null });
        this.$emit('select', { image: null });
      }
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
