<template>
  <Modal
    @close="close"
  >
    <template v-slot:header>
      Select worklog to merge
    </template>
    <template v-slot:body>
      <p>
        Select the worklog to merge all selected worklogs into.
        Only the minutes will be summed up.
        Message descriptions and other worklog attributes will be lost.
      </p>
      <hr>
      <div
        class="merge-worklogs-scrollable"
      >
        <div
          v-for="(worklogIndex) in selectedWorklogIndexes"
          :key="worklogIndex"
        >
          <input
            type="radio"
            name="worklogMergeSelector"
            v-model="selectedWorklogIndexToMergeInto"
            :id="`worklog-${worklogIndex}`"
            :value="worklogIndex"
          >
          <label :for="`worklog-${worklogIndex}`">
            {{ [
              worklogs[worklogIndex].date,
            worklogs[worklogIndex].issueKey,
            worklogs[worklogIndex].minutes ? `${worklogs[worklogIndex].minutes} minutes` : null,
            worklogs[worklogIndex].message
            ].filter((val) => (val)).join(', ') }}
          </label>
        </div>
      </div>
    </template>
    <template v-slot:footer>
      <button @click="close">Cancel</button>
      <button
        @click="merge"
        :disabled="selectedWorklogIndexToMergeInto === null"
      >
        Merge
      </button>
    </template>
  </Modal>
</template>

<script lang="ts">
import { Vue } from 'vue-property-decorator';
import Modal from '@/components/Modal.vue';
import Worklog from '@/data/worklog';

export default Vue.extend({
  name: 'MergeWorklogsModal',
  props: {
    worklogs: {
      type: Array as () => Worklog[],
      default: (): Worklog[] => [],
    },
  },
  data: () => ({
    selectedWorklogIndexToMergeInto: null as null|number,
  }),
  components: {
    Modal,
  },
  computed: {
    selectedWorklogIndexes(): number[] {
      return this.worklogs
        .reduce(
          (accumulator, worklog, index) => {
            if (worklog.selected) {
              accumulator.push(index);
            }
            return accumulator;
          },
          [] as number[],
        );
    },
  },
  watch: {
    selectedWorklogIndexes: {
      handler() {
        this.selectedWorklogIndexToMergeInto = null;
      },
      deep: true,
    },
  },
  methods: {
    close() {
      this.$emit('close');
    },
    merge() {
      this.$emit('merge', this.selectedWorklogIndexToMergeInto);
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
  margin: 5px;
  max-width: 400px;
}
input {
  display: inline-block;
  margin: 5px;
  vertical-align: top;
}
button {
  margin: 5px;
}
.merge-worklogs-scrollable {
  overflow-y: scroll;
  max-height: 200px;
}
</style>
