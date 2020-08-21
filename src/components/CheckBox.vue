<template>
  <div
    class="check-box"
    :class="`check-box-${checked ? 'checked': 'unchecked'}`"
  >
    <IconButton
      @click-button-exact="toggleChecked"
      @click-button-shift="toggleCheckedShift"
      :icon="icon"
      :disabled="disabled"
      :label="label"
      :label-placement="labelPlacement"
    />
  </div>
</template>

<script lang="ts">
import { Vue } from 'vue-property-decorator';
import IconButton from '@/components/IconButton.vue';
import {
  faCheck,
  faMinus,
} from '@fortawesome/free-solid-svg-icons';
import { library } from '@fortawesome/fontawesome-svg-core';

library.add(faCheck);
library.add(faMinus);

export default Vue.extend({
  name: 'CheckBox',
  components: {
    IconButton,
  },
  props: {
    checked: {
      type: Boolean,
      default: false,
    },
    partial: {
      type: Boolean,
      default: false,
    },
    disabled: {
      type: Boolean,
      default: false,
    },
    label: {
      type: String,
      required: true,
    },
    labelPlacement: {
      type: String,
      default: 'bottom-start',
    },
  },
  computed: {
    icon(): string {
      if (this.partial) {
        return 'minus';
      }
      if (this.checked) {
        return 'check';
      }
      return '';
    },
  },
  methods: {
    toggleChecked(shift = false) {
      const oldCheckedValue = this.checked;
      if (oldCheckedValue && this.partial) {
        this.$emit('update:partial', false);
      }
      this.$emit('update:checked', !oldCheckedValue);
      this.$emit('toggle');
      if (shift) {
        this.$emit('toggle-shift');
      } else {
        this.$emit('toggle-exact');
      }
    },
    toggleCheckedShift() {
      this.toggleChecked(true);
    },
  },
});
</script>

<style scoped>
.check-box {
  display: inline-block;
}
</style>

<style>
.check-box button {
  border: 2px solid rgba(0, 0, 0, 0.2);
  height: 25px;
  padding-left: 4px;
  padding-top: 4px;
  background: none;
}
.check-box.check-box-checked button {
  border: 2px solid transparent;
  background: rgba(0, 0, 0, 0.5);
  color: #FFF;
}
.check-box button:focus {
  outline: none;
  border: 2px solid rgba(0, 0, 0, 0.5);
}
.check-box.check-box-checked button:focus {
  background: #000;
}

@media (prefers-color-scheme: dark) {
  .check-box button {
    border: 2px solid rgba(255, 255, 255, 0.2);
  }
  .check-box.check-box-checked button {
    border: 2px solid transparent;
    background: rgba(255, 255, 255, 0.5);
    color: #000;
  }
  .check-box button:focus {
    outline: none;
    border: 2px solid rgba(255, 255, 255, 0.5);
  }
  .check-box.check-box-checked button:focus {
    background: #FFF;
  }
}
</style>
