<template>
  <div class="dateField">
    <label>
      <input
        name="date"
        type="date"
        v-model="mountedValue"
        :disabled="disabled"
      >
    </label>
  </div>
</template>

<script lang="ts">
import { Vue } from 'vue-property-decorator';

function formatDate(date: Date): string {
  return (date).toISOString().split('T')[0];
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
  methods: {
    update() {
      this.$emit('update:value', this.mountedValue);
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
  width: 118px;
}
</style>
