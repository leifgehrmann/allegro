<template>
  <div class="footer">
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
  name: 'Footer',
});
</script>

<style scoped>
.footer {
  position: fixed;
  left: 0;
  bottom: 0;
  width: 100%;
  border-top: 1px solid #EEEEEE;
  background-color: #F7F7F7;
  height: 35px;
  padding: 5px;
  box-sizing: border-box;
}

@media (prefers-color-scheme: dark) {
  .footer {
    border-top: 1px solid #555555;
    background-color: #444444;
  }
}

.footer .align-left {
  float: left;
}
.footer .align-right {
  float: right;
}
</style>
