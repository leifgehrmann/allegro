<template>
  <div>
    <div v-if="workAttributeType==='ACCOUNT'">
      <SearchSelector
        :value.sync="mountedValue"
        :options="projectAccountLinkDropdownArray"
        :disabled="disabled"
      />
    </div>
    <label v-if="workAttributeType==='STATIC_LIST'">
      <SearchSelector
        :value.sync="mountedValue"
        :options="workAttributeDropdownArray"
        :disabled="disabled"
      />
    </label>
  </div>
</template>

<script lang="ts">
import { Vue } from 'vue-property-decorator';
import SearchSelector from '@/components/SearchSelector.vue';
import { AccountLinkByScopeResponse, WorkAttributeResponse } from 'tempo-client/lib/responseTypes';

export default Vue.extend({
  name: 'WorkAttribute',
  components: {
    SearchSelector,
  },
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
    projectAccountLinkDropdownArray: [] as {value: string, label: string}[],
  }),
  computed: {
    workAttributeType(): string {
      return this.workAttribute.type;
    },
    workAttributeDropdownArray(): {value: string, label: string}[] {
      const dropdownArray = [
        { value: '', label: '' },
      ];
      if (this.workAttribute.values === undefined) {
        return dropdownArray;
      }
      dropdownArray.push(...this.workAttribute.values.map((value) => ({
        value,
        label: value,
      })));
      return dropdownArray;
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
    workAttribute() {
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
      this.projectAccountLinkDropdownArray = this.projectAccountLinks.map(
        (projectAccountLink) => ({
          value: projectAccountLink.account.key,
          label: `${projectAccountLink.account.name} (${projectAccountLink.account.key})`,
        }),
      ).sort((selectOptionA, selectOptionB) => {
        const labelA = selectOptionA.label.toLowerCase();
        const labelB = selectOptionB.label.toLowerCase();
        if (labelA < labelB) {
          return -1;
        }
        if (labelA > labelB) {
          return 1;
        }
        return 0;
      });
      this.projectAccountLinkDropdownArray.unshift({
        value: '',
        label: '',
      });
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
