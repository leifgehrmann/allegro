<template>
  <div class="toolbar">
    <div class="align-left">
      <slot name="left">
      </slot>
    </div>
    <div class="align-right">
      <slot name="right">
      </slot>
    </div>
  </div>
</template>

<script lang="ts">
import { Vue } from 'vue-property-decorator';

export default Vue.extend({
  name: 'Toolbar',
});
</script>

<style scoped>
.toolbar {
  width: 100%;
  background-color: #F7F7F7;
  height: 35px;
  padding: 5px;
  box-sizing: border-box;
}

@media (prefers-color-scheme: dark) {
  .toolbar {
    background-color: #444444;
  }
}

.toolbar .align-left {
  float: left;
}
.toolbar .align-right {
  float: right;
}
</style>
