<template>
  <div class="dateField">
    <label>
      <input
        name="date"
        type="date"
        v-model="mountedValue"
        :disabled="disabled"
      >
      <button
        name="date-minus"
        @click="minus"
        :disabled="disabled"
      >
        <font-awesome-icon icon="chevron-left" />
      </button>
      <button
        name="date-plus"
        @click="plus"
        :disabled="disabled"
      >
        <font-awesome-icon icon="chevron-right" />
      </button>
    </label>
  </div>
</template>

<script lang="ts">
import { Vue } from 'vue-property-decorator';
import { library } from '@fortawesome/fontawesome-svg-core';
import { faChevronLeft, faChevronRight } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';

library.add(faChevronLeft);
library.add(faChevronRight);

function formatDate(date: Date): string {
  return (date).toISOString().split('T')[0];
}

function addDaysToDate(date: Date, days: number): Date {
  const newDate = new Date(date);
  newDate.setDate(newDate.getDate() + days);
  return newDate;
}

export default Vue.extend({
  name: 'DateSelector',
  props: {
    value: {
      type: String,
      default: '',
    },
    disabled: {
      type: Boolean,
      default: false,
    },
  },
  data: () => ({
    mountedValue: '',
  }),
  watch: {
    mountedValue() {
      this.update();
    },
  },
  components: {
    FontAwesomeIcon,
  },
  methods: {
    update() {
      this.$emit('update:value', this.mountedValue);
    },
    minus() {
      this.mountedValue = formatDate(addDaysToDate(new Date(this.mountedValue), -1));
    },
    plus() {
      this.mountedValue = formatDate(addDaysToDate(new Date(this.mountedValue), 1));
    },
  },
  mounted() {
    if (this.value === '') {
      this.mountedValue = formatDate(new Date());
    } else {
      this.mountedValue = this.value;
    }
  },
});
</script>

<style scoped>
.dateField {
  white-space: nowrap;
}
.dateField input {
  width: 135px;
}
.dateField [name=date] {
  width: 135px;
  border-bottom-right-radius: 0;
  border-top-right-radius: 0;
}
.dateField [name=date-minus] {
  border-radius: 0;
}
.dateField [name=date-plus] {
  border-bottom-left-radius: 0;
  border-top-left-radius: 0;
}
</style>
