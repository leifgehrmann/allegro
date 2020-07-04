<template>
  <div
    class="issueField"
    :class="{ 'isValidIssueKey': valid }"
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
      v-if="valid"
    >
              {{ issueTitle }}
            </span>
    <button
      class="resolvedIssueLink"
      :title="`Open ${mountedIssueKey} in JIRA`"
      v-if="valid"
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
    issueTitle: {
      type: String,
      default: '',
    },
    valid: {
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
  background: rgba(0, 0, 0, 0.05);
  vertical-align: middle;
  border-radius: 0;
  max-width: 200px;
  overflow: hidden;
}
.resolvedIssueLink {
  border-top-left-radius: 0;
  border-bottom-left-radius: 0;
}
.isValidIssueKey input[name="issueKey"] {
  border-top-right-radius: 0;
  border-bottom-right-radius: 0;
}
</style>
