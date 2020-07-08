<template>
  <span class="connectionStatus">
    <font-awesome-icon :icon="['fab', 'jira']"/> JIRA: {{jiraStateLabel}}
    <font-awesome-icon :icon="['far', 'check-circle']"/> Tempo: {{tempoStateLabel}}
  </span>
</template>

<script lang="ts">
import { Vue } from 'vue-property-decorator';
import { library } from '@fortawesome/fontawesome-svg-core';
import { faCheckCircle } from '@fortawesome/free-regular-svg-icons';
import { faJira } from '@fortawesome/free-brands-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';

library.add(faCheckCircle);
library.add(faJira);

export default Vue.extend({
  name: 'ConnectionStatus',
  props: {
    jiraState: {
      type: String,
      default: 'unknown' as 'unknown'|'connected'|'errored',
    },
    tempoState: {
      type: String,
      default: 'unknown' as 'unknown'|'connected'|'errored',
    },
  },
  components: {
    FontAwesomeIcon,
  },
  computed: {
    jiraStateLabel(): string {
      return this.getLabelForState(this.jiraState);
    },
    tempoStateLabel(): string {
      return this.getLabelForState(this.tempoState);
    },
  },
  methods: {
    getLabelForState(state: string): string {
      switch (state) {
        case 'connected':
          return 'OK';
        case 'errored':
          return 'ERROR';
        default:
          return '?';
      }
    },
  },
});
</script>

<style scoped>
span.connectionStatus {
  display: inline-block;
  margin-left: 5px;
}
</style>
