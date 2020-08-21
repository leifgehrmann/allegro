<template>
  <div style="display: inline-block">
    <popper
      trigger="hover"
      :visible-arrow="true"
      :options="{
        placement: labelPlacement,
      }"
      :delay-on-mouse-over="1000"
      :delay-on-mouse-out="0"
      :append-to-body="true"
    >
      <div class="popper popper-icon-button">
        {{ label }}
      </div>
      <button
        @click.exact="clickExact"
        @click.shift="clickShift"
        :disabled="disabled"
        :class="`button-${variant}`"
        slot="reference"
      >
        <FontAwesomeIcon
          v-if="icon !== ''"
          :icon="icon"
        />
        <div v-if="icon === ''" style="visibility: hidden">-</div>
      </button>
    </popper>
  </div>
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
    labelPlacement: {
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
    variant: {
      type: String,
      default: 'secondary',
    },
  },
  methods: {
    clickExact() {
      this.$emit('click-button');
      this.$emit('click-button-exact');
    },
    clickShift() {
      this.$emit('click-button');
      this.$emit('click-button-shift');
    },
  },
});
</script>

<style scoped>
button {
  width: 25px;
  display: inline-block;
}

.button-primary {
  background: rgba(0, 128, 255, 0.2);
}

.button-danger {
  background: rgba(255, 0, 0, 0.2);
}
.button-link {
  background: none;
}

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
