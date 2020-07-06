<template>
  <Modal
    @close="close"
  >
    <template v-slot:header>
      Error
    </template>
    <template v-slot:body>
      {{errorMessage}}
    </template>
    <template v-slot:footer>
      <button @click="close">OK</button>
    </template>
  </Modal>
</template>

<script lang="ts">
import { Vue } from 'vue-property-decorator';
import Modal from '@/components/Modal.vue';

export default Vue.extend({
  name: 'ValidationModal',
  components: {
    Modal,
  },
  props: {
    errorMessage: {
      type: String,
      default: '',
    },
  },
  methods: {
    close() {
      this.$emit('close');
    },
  },
});
</script>

<style scoped>

</style>
