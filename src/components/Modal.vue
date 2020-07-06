<template>
  <transition name="modal-fade">
    <div class="modal-backdrop">
      <div class="modal"
           role="dialog"
           aria-labelledby="modalTitle"
           aria-describedby="modalDescription"
      >
        <header
          class="modal-header"
          id="modalTitle"
        >
          <slot name="header">
            This is the default tile!
          </slot>
        </header>
        <section
          class="modal-body"
          id="modalDescription"
        >
          <slot name="body">
            I'm the default body!
          </slot>
        </section>
        <footer class="modal-footer">
          <slot name="footer">
            <button
              type="button"
              @click="close"
              aria-label="Close modal"
            >
              Close me!
            </button>
          </slot>
        </footer>
      </div>
    </div>
  </transition>
</template>

<script lang="ts">
import { Vue } from 'vue-property-decorator';

export default Vue.extend({
  name: 'Modal',
  methods: {
    close() {
      this.$emit('close');
    },
  },
});
</script>

<style scoped>
.modal-backdrop {
  position: fixed;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  background-color: rgba(0, 0, 0, 0.3);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 10;
}

.modal {
  border-radius: 10px;
  background: #FFFFFF;
  overflow-x: auto;
  display: flex;
  flex-direction: column;
}

@media (prefers-color-scheme: dark) {
  .modal {
    background: #333234;
  }
}

.modal-header,
.modal-footer {
  padding: 15px;
  display: flex;
}

.modal-header {
  border-bottom: 1px solid #eeeeee;
  justify-content: space-between;
  font-weight: bold;
}

.modal-footer {
  border-top: 1px solid #eeeeee;
  justify-content: flex-end;
}

@media (prefers-color-scheme: dark) {
  .modal-header {
    border-bottom: 1px solid #444444;
  }

  .modal-footer {
    border-top: 1px solid #444444;
  }
}

.modal-body {
  position: relative;
  padding: 20px 10px;
}

.modal-fade-enter,
.modal-fade-leave-active {
  opacity: 0;
}

.modal-fade-enter-active,
.modal-fade-leave-active {
  transition: opacity .2s ease
}
</style>
