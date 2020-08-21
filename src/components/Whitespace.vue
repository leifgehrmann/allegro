<template>
  <div
    class="whitespace"
    :style="{width}"
  >
  </div>
</template>

<script lang="ts">
import { Vue } from 'vue-property-decorator';

export default Vue.extend({
  name: 'Whitespace',
  props: {
    width: {
      type: String,
      default: '0',
    },
  },
});
</script>

<style>
.whitespace {
  display: inline-block;
}
</style>
