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

<script>
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
  background-color: #EEEEEE;
  height: 37px;
  padding: 7px;
  box-sizing: border-box;
}
.footer .align-left {
  float: left;
}
.footer .align-right {
  float: right;
}
</style>
