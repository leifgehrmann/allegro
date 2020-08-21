<template>
  <Modal
    @close="close"
  >
    <template v-slot:header>
      Bulk edit worklogs
    </template>
    <template v-slot:body>
      <label>Date</label>
      <DateSelector
        :value.sync="newDate"
      />
    </template>
    <template v-slot:footer>
      <button @click="close">Cancel</button>
      <button
        @click="bulkEdit"
        :disabled="newDate === ''"
      >
        Bulk Edit
      </button>
    </template>
  </Modal>
</template>

<script lang="ts">
import { Vue } from 'vue-property-decorator';
import Modal from '@/components/Modal.vue';
import Worklog from '@/data/worklog';
import DateSelector from '@/components/DateSelector.vue';

export default Vue.extend({
  name: 'BulkEditWorklogsModal',
  props: {
    worklogs: {
      type: Array as () => Worklog[],
      default: (): Worklog[] => [],
    },
  },
  data: () => ({
    newDate: '' as string,
  }),
  components: {
    Modal,
    DateSelector,
  },
  watch: {
    worklogs: {
      handler() {
        this.newDate = '';
      },
      deep: true,
    },
  },
  methods: {
    close() {
      this.$emit('close');
    },
    bulkEdit() {
      this.$emit('bulkEdit', this.newDate);
      this.close();
    },
  },
});
</script>

<style scoped>
p {
  display: inline-block;
  max-width: 400px;
}
hr {
  border: 1px solid rgba(0,0,0,0.1);
}
label {
  display: inline-block;
  width: 70px;
  text-align: right;
  margin: 5px;
}
input {
  display: inline-block;
  margin: 5px;
  vertical-align: top;
}
button {
  margin: 5px;
}
</style>
