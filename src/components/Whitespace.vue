<template>
  <span>
    <popper
      trigger="hover"
      :visible-arrow="true"
      :options="{
        placement: labelHoverPlacement,
        'boundaries-selector': 'v-application'
      }"
      :delay-on-mouse-over="300"
      :delay-on-mouse-out="0"
      :append-to-body="true"
    >
      <div class="popper popper-icon-button">
        {{ label }}
      </div>
      <button
        :disabled="disabled"
        slot="reference"
      >
        <FontAwesomeIcon
          :icon="icon"
        />
      </button>
    </popper>
  </span>
</template>

<script lang="ts">
import { Vue } from 'vue-property-decorator';
import Popper from 'vue-popperjs';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';

export default Vue.extend({
  name: 'IconButton',
  components: {
    FontAwesomeIcon,
    Popper,
  },
  props: {
    label: {
      type: String,
      default: '',
    },
    labelHoverPlacement: {
      type: String,
      default: 'bottom-start',
    },
    disabled: {
      type: Boolean,
      default: false,
    },
    icon: {
      default: () => ({}),
    },
  },
});
</script>

<style scoped>

</style>

<style>
.popper-icon-button.popper {
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
  user-select: none;
}
.popper-icon-button.popper .popper__arrow {
  width: 0;
  height: 0;
  border-style: solid;
  position: absolute;
  margin: 5px;
}
.popper-icon-button.popper[x-placement^="top"] {
  margin-bottom: 5px;
}
.popper-icon-button.popper[x-placement^="top"] .popper__arrow {
  border-width: 5px 5px 0 5px;
  border-color: #212121 transparent transparent transparent;
  bottom: -5px;
  left: calc(50% - 5px);
  margin-top: 0;
  margin-bottom: 0;
}
.popper-icon-button.popper[x-placement^="bottom"] {
  margin-top: 5px;
}
.popper-icon-button.popper[x-placement^="bottom"] .popper__arrow {
  border-width: 0 5px 5px 5px;
  border-color: transparent transparent #212121 transparent;
  top: -5px;
  left: calc(50% - 5px);
  margin-top: 0;
  margin-bottom: 0;
}
.popper-icon-button.popper[x-placement^="right"] {
  margin-left: 5px;
}
.popper-icon-button.popper[x-placement^="right"] .popper__arrow {
  border-width: 5px 5px 5px 0;
  border-color: transparent #212121 transparent transparent;
  left: -5px;
  top: calc(50% - 5px);
  margin-left: 0;
  margin-right: 0;
}
.popper-icon-button.popper[x-placement^="left"] {
  margin-right: 5px;
}
.popper-icon-button.popper[x-placement^="left"] .popper__arrow {
  border-width: 5px 0 5px 5px;
  border-color: transparent transparent transparent #212121;
  right: -5px;
  top: calc(50% - 5px);
  margin-left: 0;
  margin-right: 0;
}
</style>
