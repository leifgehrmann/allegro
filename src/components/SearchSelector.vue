<template>
  <div
    v-click-outside="focusoutWithoutSelect"
  >
    <popper
      trigger="hover"
      :visible-arrow="false"
      :force-show="searching"
      :options="{
        placement: 'bottom-start',
        'boundaries-selector': 'v-application'
      }"
      :delay-on-mouse-over="100000000"
      :delay-on-mouse-out="100000000"
    >
      <div
        slot="reference"
        class="container"
      >
        <label>
          <input
            class="search-input"
            type="text"
            placeholder=""
            :disabled="disabled"
            @click="click"
            @keydown.enter="enter"
            @keydown.down="down"
            @keydown.up="up"
            @keydown.tab="focusoutWithoutSelect"
            @input="updateSearch"
          >
        </label>
        <button
          class="dropdown-icon"
          tabindex="-1"
          :disabled="disabled"
        >
          <font-awesome-icon
            icon="chevron-down"
            @click="toggleSearch"
          />
        </button>
      </div>
      <div class="popper">
        <div class="search-results">
          <ul class="search-results-list">
            <li
              v-for="(option, index) in matches"
              :key="index"
              :class="{ 'search-result-list-item-selected': index === searchIndex }"
              class="search-results-list-item"
              @click.prevent="selectOption(option)"
              @mousemove="searchIndex = index"
            >
              <span v-if="option.label === ''">-</span>
              {{ option.label }}
            </li>
            <li v-if="matches.length === 0">
              No matches
            </li>
          </ul>
        </div>
      </div>
    </popper>
  </div>
</template>

<script lang="ts">
import Vue from 'vue';
import vClickOutside from 'v-click-outside';
import Popper from 'vue-popperjs';
import { library } from '@fortawesome/fontawesome-svg-core';
import { faChevronDown } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';

library.add(faChevronDown);

interface SelectOption {
  value: string;
  label: string;
}

export default Vue.extend({
  name: 'SearchSelector',
  directives: {
    clickOutside: vClickOutside.directive,
  },
  components: {
    Popper,
    FontAwesomeIcon,
  },
  props: {
    options: {
      type: Array as () => SelectOption[],
      default: (): SelectOption[] => [],
    },
    value: {
      type: String,
      default: '',
    },
    disabled: {
      type: Boolean,
      default: false,
    },
  },
  data: () => ({
    searching: false,
    searchTerm: '',
    searchIndex: 0,
  }),
  computed: {
    matches(): SelectOption[] {
      return this.options.filter(
        (option) => option.label.toLowerCase().indexOf(this.searchTerm.toLowerCase()) !== -1,
      );
    },
    valueLabel(): string {
      const selectedOption = this.options.find((option) => option.value === this.value);
      return selectedOption?.label ?? '';
    },
    valueMatchIndex(): number|null {
      return this.options.findIndex((option) => option.value === this.value) ?? null;
    },
  },
  watch: {
    options(): void {
      if (!this.searching) {
        this.displaySelectedValue();
      }
    },
    value(): void {
      if (!this.searching) {
        this.displaySelectedValue();
      }
    },
    disabled(): void {
      this.searching = false;
    },
  },
  methods: {
    getSearchInputField(): HTMLInputElement {
      const elements = this.$el.getElementsByClassName('search-input');
      return elements.item(0) as HTMLInputElement;
    },
    getCurrentSearchResultListItem(): HTMLLIElement|null {
      const elements = this.$el.getElementsByClassName('search-results-list-item');
      return elements.item(this.searchIndex) as HTMLLIElement;
    },
    scrollToCurrentListItem(): void {
      const currentListItem = this.getCurrentSearchResultListItem();
      if (currentListItem !== null) {
        currentListItem.scrollIntoView({ block: 'nearest', inline: 'start' });
      }
    },
    click() {
      this.focusin();
    },
    searchIndexInRange(): boolean {
      return this.searchIndex >= 0 && this.searchIndex < this.matches.length;
    },
    focusin() {
      this.searchIndex = this.valueMatchIndex ?? 0;
      this.searching = true;
      this.displaySearchTerm();
      this.selectInputFieldContents();
      this.scrollToCurrentListItem();
    },
    focusout() {
      this.searching = false;
      this.displaySelectedValue();
      this.selectInputFieldContents();
    },
    focusoutWithoutSelect() {
      this.searching = false;
      this.displaySelectedValue();
    },
    toggleSearch() {
      if (this.searching) {
        this.focusout();
      } else {
        this.focusin();
      }
    },
    displaySelectedValue() {
      const inputField = this.getSearchInputField();
      inputField.value = this.valueLabel;
    },
    displaySearchTerm() {
      const inputField = this.getSearchInputField();
      inputField.value = this.searchTerm;
    },
    selectInputFieldContents() {
      const inputField = this.getSearchInputField();
      inputField.setSelectionRange(0, inputField.value.length);
    },
    enter() {
      if (!this.searching) {
        this.focusin();
      } else if (this.searchIndexInRange()) {
        this.selectOption(this.matches[this.searchIndex]);
      } else {
        this.toggleSearch();
      }
    },
    up(event: Event) {
      if (!this.searching) {
        this.focusin();
      } else if (this.searchIndex > 0) {
        this.searchIndex -= 1;
        this.scrollToCurrentListItem();
        event.preventDefault();
      }
    },
    down(event: Event) {
      if (!this.searching) {
        this.focusin();
      } else if (this.searchIndex < this.matches.length - 1) {
        this.searchIndex += 1;
        this.scrollToCurrentListItem();
        event.preventDefault();
      }
    },
    updateSearch() {
      this.searching = true;
      this.searchTerm = this.getSearchInputField()?.value;
      this.searchIndex = Math.min(this.searchIndex, this.matches.length - 1);
    },
    selectOption(option: SelectOption): void {
      this.searching = false;
      this.$emit('update:value', option.value);
      this.displaySelectedValue();
      this.selectInputFieldContents();
    },
  },
  mounted(): void {
    this.focusout();
  },
});
</script>

<style scoped>
  .container {
    position: relative;
    padding: 0;
    white-space: nowrap;
  }

  .search-input {
    border-top-right-radius: 0;
    border-bottom-right-radius: 0;
  }

  .dropdown-icon {
    border-top-left-radius: 0;
    border-bottom-left-radius: 0;
  }

  .search-results-container {
    position: relative;
    width: 100%;
    height: 0;
  }

  .search-results {
    background: #FFF;
    box-shadow: 0 5px 5px -3px rgba(0, 0, 0, 0.2),
    0 8px 10px 1px rgba(0, 0, 0, 0.14),
    0 3px 14px 2px rgba(0, 0, 0, 0.12);
    border-radius: 5px;
    position: absolute;
    top: 5px;
    z-index: 10;
    max-height: 400px;
    overflow-y: scroll;
  }

  .search-results ul {
    list-style: none;
    padding: 4px 0;
  }

  .search-results ul li {
    cursor: pointer;
    padding: 2px 8px 2px 8px;
  }

  .search-result-list-item-selected {
    background: rgba(0, 0, 0, 0.1);
  }

  .search-results-epsg-io a {
    text-decoration: none;
  }

  .svg-inline--fa.fa-times-circle {
    cursor: pointer;
  }

  @media (prefers-color-scheme: dark) {
    .search-results {
      background: #212121;
    }

    .search-result-list-item-selected {
      background: rgba(255, 255, 255, 0.1);
    }
  }
</style>

<style>
  .popper {
    z-index: 1;
  }

  .popper .search-results {
    background: #FFF;
    box-shadow: 0 5px 5px -3px rgba(0, 0, 0, 0.2),
    0 8px 10px 1px rgba(0, 0, 0, 0.14),
    0 3px 14px 2px rgba(0, 0, 0, 0.12);
    border-radius: 5px;
    position: absolute;
    top: 5px;
    z-index: 20;
    max-height: 400px;
    overflow-y: scroll;
  }

  .popper .search-results ul {
    list-style: none;
    padding: 0 0;
  }

  .popper .search-results ul li {
    white-space: nowrap;
    cursor: pointer;
    padding: 2px 8px 2px 8px;
  }

  .search-result-list-item-selected {
    background: rgba(0, 0, 0, 0.1);
  }

  .popper .search-results-epsg-io a {
    text-decoration: none;
  }

  .svg-inline--fa.fa-times-circle {
    cursor: pointer;
  }

  @media (prefers-color-scheme: dark) {

    .popper .search-results {
      background: #333234;
    }

    .popper .search-result-list-item-selected {
      background: rgba(255, 255, 255, 0.1);
    }
  }
</style>
