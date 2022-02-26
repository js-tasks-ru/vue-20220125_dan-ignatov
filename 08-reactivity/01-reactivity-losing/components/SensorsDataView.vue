<template>
  <div v-if="!sensors">Loading...</div>
  <template v-else>
    <sensors-data-row v-for="sensor in sensors" :key="sensor.id" :sensor="sensor" />
  </template>
</template>

<script>
import { cloneDeep } from 'lodash-es';

import { SensorsDataController } from '../services/SensorsDataController';
import { SensorsDataStreamingService } from '../services/SensorsDataStreamingService';
import SensorsDataRow from './SensorsDataRow';

export default {
  name: 'SensorsDataView',

  components: { SensorsDataRow },

  data() {
    return {
      sensors: null,
    };
  },

  mounted() {
    this.sensorsDataController = new SensorsDataController(new SensorsDataStreamingService());
    this.sensorsDataController.addDataCallback(this.callback);

    // Раз в секунду запрашиваем и выводим новые данные сенсоров
    setInterval(() => {
      this.sensorsDataController.getData();
    }, 1000);
  },

  beforeUnmount() {
    this.sensorsDataController.removeDataCallback(this.callback);
    this.sensorsDataController.close();
  },

  methods: {
    callback(data) {
      this.setData(data);
    },

    setData(sensors) {
      // пришли данные из неизвестного источника
      // лучше полностью отделить данные для компонента от этой неизвестности

      this.sensors = Object.values(sensors).map(({ id, label, value, unit }) => ({ id, label, value, unit }));

      // можно сделать глубокую копию, но не известно насколько глубока структура внешнего объекта
      // и все равно заранее известно какие от него нужны свойства
      //this.sensors = cloneDeep(sensors);

      // нет смысла делать ref вокруг полученного объекта
      // так как неизвестный источник все равно сможет менять свои исходные объекты напрямую
      // и я об этих изменениях никак не узнаю
    },
  },
};
</script>

<style scoped></style>
