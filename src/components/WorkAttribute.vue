<template>
  <div>
    <label v-if="workAttributeType==='ACCOUNT'">
        <select
          v-model="mountedValue"
          :disabled="disabled"
        >
          <option
            v-for="projectAccountLink in projectAccountLinks"
            :key="projectAccountLink.account.key"
            :value="projectAccountLink.account.key"
          >
            {{projectAccountLink.account.name}} ({{projectAccountLink.account.key}})
          </option>
        </select>
    </label>
    <label v-if="workAttributeType==='STATIC_LIST'">
      <select
        v-model="mountedValue"
        :disabled="disabled"
      >
        <option value="" />
        <option v-for="value in workAttribute.values" :key="value" :value="value">
          {{value}}
        </option>
      </select>
    </label>
  </div>
</template>

<script lang="ts">
import { Vue } from 'vue-property-decorator';
import { AccountLinkByScopeResponse, WorkAttributeResponse } from 'tempo-client/lib/responseTypes';

export default Vue.extend({
  name: 'WorkAttribute',
  props: {
    value: {
      type: String,
      default: '',
    },
    workAttribute: {
      type: Object as () => WorkAttributeResponse,
      default: (): WorkAttributeResponse => ({
        key: 'default',
        name: 'default',
        required: false,
        self: '',
        type: 'DEFAULT',
      }),
    },
    projectsAccountLinks: {
      type: Object as () => Record<string, AccountLinkByScopeResponse[]>,
      default: (): Record<string, AccountLinkByScopeResponse[]> => ({}),
    },
    issueKey: {
      type: String,
      default: '',
    },
    issueTempoAccountId: {
      type: Number,
      default: null,
    },
    disabled: {
      type: Boolean,
      default: false,
    },
  },
  data: () => ({
    mountedValue: '',
    projectAccountLinks: [] as AccountLinkByScopeResponse[],
  }),
  computed: {
    workAttributeType(): string {
      return this.workAttribute.type;
    },
  },
  watch: {
    mountedValue() {
      this.update();
    },
    issueKey() {
      this.populateProjectAccountLink();
    },
    projectsAccountLinks() {
      if (this.workAttributeType === 'ACCOUNT') {
        this.populateProjectAccountLink();
        const mountedValueExists = this.projectAccountLinkKeyExists(this.mountedValue);
        if (!mountedValueExists) {
          this.mountedValue = '';
          this.update();
        }
      }
    },
    issueTempoAccountId() {
      if (this.workAttributeType === 'ACCOUNT') {
        this.populateProjectAccountLink();
        const accountKey = this.getAccountKeyFromAccountId(this.issueTempoAccountId);
        if (accountKey !== null) {
          this.mountedValue = accountKey;
          this.update();
        }
      }
    },
  },
  methods: {
    update() {
      this.$emit('update:value', this.mountedValue);
    },
    getProjectFromIssueKey(issueKey: string): string {
      return issueKey.split('-')[0];
    },
    getAccountKeyFromAccountId(accountId: number): string|null {
      const accountLink = this.projectAccountLinks.find(
        (projectAccountLink) => projectAccountLink.account.id === accountId,
      );
      if (accountLink !== undefined) {
        return accountLink.account.key;
      }
      return null;
    },
    projectAccountLinkKeyExists(projectAccountLinkKey: string) {
      if (this.projectAccountLinks === undefined) {
        return false;
      }
      return this.projectAccountLinks.some(
        (projectAccountLink) => projectAccountLink.account.key === projectAccountLinkKey,
      );
    },
    populateProjectAccountLink() {
      this.projectAccountLinks = this.projectsAccountLinks[
        this.getProjectFromIssueKey(this.issueKey)
      ] ?? [];
    },
  },
  mounted() {
    this.mountedValue = this.value;
    if (this.workAttributeType === 'ACCOUNT') {
      this.populateProjectAccountLink();
      const mountedValueExists = this.projectAccountLinkKeyExists(this.mountedValue);
      if (!mountedValueExists) {
        this.mountedValue = '';
        this.update();
      }
    }
  },
});
</script>

<style scoped>
select {
  max-width: 250px;
}
</style>
