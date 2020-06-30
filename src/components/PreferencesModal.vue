<template>
  <Modal
    @close="close"
  >
    <template v-slot:header>
      Preferences
    </template>
    <template v-slot:body>
      <label>JIRA Domain</label>
      <input type="text">
      <br>
      <label>JIRA Username</label>
      <input type="text">
      <br>
      <label>JIRA API Key</label>
      <input type="text">
      <br>
      <label>Tempo API Key</label>
      <input type="text">
    </template>
    <template v-slot:footer>
    </template>
  </Modal>
</template>

<script>
import { Vue } from 'vue-property-decorator';
import Modal from '@/components/Modal.vue';

export default Vue.extend({
  name: 'PreferencesModal',
  components: {
    Modal,
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
