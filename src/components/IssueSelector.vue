import {shell} from "electron";
<template>
  <div
    class="issueField"
    :class="{ issueKeyIsValid }"
  >
    <label>
      <input
        name="issueKey"
        type="text"
        placeholder="ABC-123"
        v-model="mountedIssueKey"
        v-uppercase
      >
    </label>
    <span
      class="resolvedIssueTitle inputComponentPiece"
      :title="issueTitle"
      v-if="issueKeyIsValid"
    >
              {{ issueTitle }}
            </span>
    <button
      class="resolvedIssueLink"
      :title="`Open ${mountedIssueKey} in JIRA`"
      v-if="issueKeyIsValid"
      @click="openUrl"
    >
      <font-awesome-icon icon="external-link-alt"/>
    </button>
  </div>
</template>

<script lang="ts">
import { Vue } from 'vue-property-decorator';
import { library } from '@fortawesome/fontawesome-svg-core';
import { faExternalLinkAlt } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';
import { shell } from 'electron';

library.add(faExternalLinkAlt);

export default Vue.extend({
  name: 'IssueSelector',
  directives: {
    uppercase: (el: unknown) => {
      if (el instanceof HTMLInputElement) {
        // eslint-disable-next-line no-param-reassign
        el.value = el.value.toUpperCase();
      }
    },
  },
  props: {
    issueKey: {
      type: String,
      default: '',
    },
    issueUrl: {
      type: String,
      default: '',
    },
    issueTitle: {
      type: String,
      default: '',
    },
    issueKeyIsValid: {
      type: Boolean,
      default: false,
    },
  },
  data: () => ({
    mountedIssueKey: '',
  }),
  watch: {
    mountedIssueKey() {
      this.mountedIssueKey = this.mountedIssueKey.toUpperCase();
      this.$emit('update:issueKey', this.mountedIssueKey);
    },
  },
  components: {
    FontAwesomeIcon,
  },
  methods: {
    openUrl() {
      shell.openExternal(this.issueUrl);
    },
  },
  mounted() {
    this.mountedIssueKey = this.issueKey;
  },
});
</script>

<style scoped>
.issueField {
  display: flex;
}
.issueField input[name="issueKey"] {
  width: 80px;
}
.resolvedIssueTitle {
  white-space: nowrap;
  display: block;
  padding: 5px;
  vertical-align: middle;
  border-radius: 0;
  max-width: 200px;
  overflow: hidden;
}
.resolvedIssueLink {
  border-top-left-radius: 0;
  border-bottom-left-radius: 0;
}
.issueKeyIsValid input[name="issueKey"] {
  border-top-right-radius: 0;
  border-bottom-right-radius: 0;
}
</style>
