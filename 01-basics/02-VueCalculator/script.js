import { createApp, defineComponent } from './vendor/vue.esm-browser.js';

// Создайте Vue приложение
class Calculator {
    static sum(left, right) {
        return left + right;
    }

    static subtract(left, right) {
        return left - right;
    }

    static multiply(left, right) {
        return left * right;
    }

    static divide(left, right) {
        return left / right;
    }
}

const MyCalculator = defineComponent({
    data() {
        return {
            left: 2,
            right: 3,
            operation: 'divide',
            Calculator
        };
    },

    computed: {
        result() {
            return Calculator[this.operation](this.left, this.right);
        }
    }
});

const app = createApp(MyCalculator);
app.mount('#app');
