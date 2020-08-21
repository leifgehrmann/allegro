<template>
  <div class="toolbar">
    <div>
      <slot name="left">
      </slot>
    </div>
    <div class="toolbar-push-right">
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
  height: 57px;
  padding: 16px;
  box-sizing: border-box;
  user-select: none;
  display: flex;
}

@media (prefers-color-scheme: dark) {
  .toolbar {
    background-color: #444444;
  }
}

.toolbar-push-right {
  margin-left: auto;
}
</style>

<style>
.toolbar > div > * {
  margin-left: 2px;
  margin-right: 2px;
}
.toolbar > div > *:first-child {
  margin-left: 4px;
  margin-right: 2px;
}
.toolbar > div > *:last-child {
  margin-left: 2px;
  margin-right: 4px;
}
</style>
