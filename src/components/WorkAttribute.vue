<template>
  <div>
    <label v-if="workAttributeType==='ACCOUNT'">
        <select v-model="mountedValue">
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
      <select v-model="mountedValue">
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
        values: [],
        // Todo: Remove 'values' when bug fix is made in node-tempo-client, as property is optional
      }),
    },
    projectAccountLinks: {
      type: Array as () => AccountLinkByScopeResponse[],
      default: (): AccountLinkByScopeResponse[] => [],
    },
  },
  data: () => ({
    mountedValue: '',
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
  },
  methods: {
    update() {
      this.$emit('update:value', this.mountedValue);
    },
  },
  mounted() {
    this.mountedValue = this.value;
  },
});
</script>

<style scoped>
select {
  max-width: 250px;
}
</style>
