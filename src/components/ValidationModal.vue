<template>
  <Modal
    @close="close"
  >
    <template v-slot:header>
      Error
    </template>
    <template v-slot:body>
      Please make sure every worklog has a <font-awesome-icon icon="check"/> icon before submitting.
    </template>
    <template v-slot:footer>
      <button @click="close">OK</button>
    </template>
  </Modal>
</template>

<script lang="ts">
import { Vue } from 'vue-property-decorator';
import Modal from '@/components/Modal.vue';
import { library } from '@fortawesome/fontawesome-svg-core';
import { faCheck } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';

library.add(faCheck);

export default Vue.extend({
  name: 'ValidationModal',
  components: {
    Modal,
    FontAwesomeIcon,
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
