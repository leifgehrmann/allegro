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
        :disabled="disabled"
        ref="issueKey"
      >
    </label>
    <popper
      trigger="hover"
      :visible-arrow="true"
      :options="{
        placement: 'bottom-start',
        'boundaries-selector': 'v-application'
      }"
      :delay-on-mouse-over="300"
      v-if="issueKeyIsValid"
    >
      <div class="popper popper-issue-title">
        {{ issueTitle }}
      </div>
      <span
        class="resolvedIssueTitle inputComponentPiece"
        v-if="issueKeyIsValid"
        @click="focusOnIssueKey"
        slot="reference"
      >
        {{ issueTitle }}
      </span>
    </popper>
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
import Popper from 'vue-popperjs';
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
    disabled: {
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
      this.$emit('update:issueKeyIsValid', false);
    },
  },
  components: {
    FontAwesomeIcon,
    Popper,
  },
  methods: {
    openUrl() {
      shell.openExternal(this.issueUrl);
    },
    focusOnIssueKey() {
      const issueKey = this.$refs.issueKey as HTMLInputElement;
      issueKey.focus();
      issueKey.select();
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

<style>
  .popper-issue-title.popper {
    width: auto;
    background-color: #212121;
    color: #fafafa;
    text-align: center;
    padding: 4px;
    display: inline-block;
    border-radius: 3px;
    position: absolute;
    font-weight: normal;
    z-index: 200000;
    font-size: 0.7rem;
    max-width: 300px;
  }
  .popper-issue-title.popper .popper__arrow {
    width: 0;
    height: 0;
    border-style: solid;
    position: absolute;
    margin: 5px;
  }
  .popper-issue-title.popper[x-placement^="top"] {
    margin-bottom: 5px;
  }
  .popper-issue-title.popper[x-placement^="top"] .popper__arrow {
    border-width: 5px 5px 0 5px;
    border-color: #212121 transparent transparent transparent;
    bottom: -5px;
    left: calc(50% - 5px);
    margin-top: 0;
    margin-bottom: 0;
  }
  .popper-issue-title.popper[x-placement^="bottom"] {
    margin-top: 5px;
  }
  .popper-issue-title.popper[x-placement^="bottom"] .popper__arrow {
    border-width: 0 5px 5px 5px;
    border-color: transparent transparent #212121 transparent;
    top: -5px;
    left: calc(50% - 5px);
    margin-top: 0;
    margin-bottom: 0;
  }
  .popper-issue-title.popper[x-placement^="right"] {
    margin-left: 5px;
  }
  .popper-issue-title.popper[x-placement^="right"] .popper__arrow {
    border-width: 5px 5px 5px 0;
    border-color: transparent #212121 transparent transparent;
    left: -5px;
    top: calc(50% - 5px);
    margin-left: 0;
    margin-right: 0;
  }
  .popper-issue-title.popper[x-placement^="left"] {
    margin-right: 5px;
  }
  .popper-issue-title.popper[x-placement^="left"] .popper__arrow {
    border-width: 5px 0 5px 5px;
    border-color: transparent transparent transparent #212121;
    right: -5px;
    top: calc(50% - 5px);
    margin-left: 0;
    margin-right: 0;
  }
</style>
