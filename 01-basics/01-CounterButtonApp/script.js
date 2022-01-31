import { createApp, defineComponent } from './vendor/vue.esm-browser.js';

// Создайте Vue приложение
const MyRootComponent = defineComponent({
    name: 'MyRoot',
    data() {
        return {
            value: 0,
        };
    },
    methods: {
        incrementValue() {
            this.$data.value++;
        }
    }
});

const app = createApp(MyRootComponent);
app.mount('#app');
