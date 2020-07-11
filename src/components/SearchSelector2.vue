<template>
  <div
    v-click-outside="focusout"
  >
    <popper
      trigger="click"
      :visible-arrow="false"
      :force-show="searching"
      :options="{
        placement: 'bottom-start',
        'boundaries-selector': 'v-application'
      }"
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
            @focusin="focusin"
            @keydown.enter="enter"
            @keydown.down="down"
            @keydown.up="up"
            @keydown.tab="focusout"
            @input="updateSearch"
          >
        </label>
        <button
          class="clear-icon"
          v-if="!searching"
        >
          <font-awesome-icon
            icon="times"
            @click="clearValue"
          />
        </button>
        <button
          class="dropdown-icon"
          v-if="!searching"
        >
          <font-awesome-icon
            icon="chevron-down"
            @click="focusin"
          />
        </button>
      </div>
      <div class="popper">
        <div class="search-results">
          <ul class="search-results-list">
            <li
              v-for="(option, index) in matches"
              :key="index"
              :class="{ 'search-result-list-item-selected': index === current }"
              class="search-results-list-item"
              @click="selectOptionFromList(option, index)"
              @mousemove="current = index"
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
  name: 'SearchSelector2',
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
  },
  data() {
    return {
      searching: false,
    };
  },
  methods: {
    getSearchInputField(): HTMLInputElement {
      const elements = this.$el.getElementsByClassName('search-input');
      return elements.item(0) as HTMLInputElement;
    },
    getCurrentSearchResultListItem(): HTMLLIElement|null {
      const elements = this.$el.getElementsByClassName('search-results-list-item');
      return elements.item(0) as HTMLLIElement;
    },
    focusin() {
      /* Do Nothing */
    },
    focusout() {
      /* Do Nothing */
    },
    enter() {
      /* Do Nothing */
    },
    up() {
      /* Do Nothing */
    },
    down() {
      /* Do Nothing */
    },
    updateSearch() {
      /* Do Nothing */
    },
    clearValue() {
      /* Do Nothing */
    },
  },
});
</script>

<style scoped>
  .container {
    border-radius: 4px;
    background: #FFFFFF;
    position: relative;
    padding: 0;
  }

  .search-input {
    max-width: 270px;
    border-radius: 4px;
    padding-left: 7px;
    padding-top: 5px;
    padding-bottom: 5px;
  }

  .dropdown-icon {
    display: inline-block;
    position: absolute;
    right: 7px;
    top: 7px;
    cursor: pointer;
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
    border-radius: 4px;
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

  .svg-inline--fa {
    width: 16px;
    height: 16px;
    opacity: 0.8;
  }

  .svg-inline--fa.fa-times-circle {
    cursor: pointer;
  }

  @media (prefers-color-scheme: dark) {
    .search-input {
      color: #FFFFFF;
    }

    .container {
      background: #212121;
    }

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
    border-radius: 4px;
    position: absolute;
    top: 5px;
    z-index: 20;
    max-height: 400px;
    overflow-y: scroll;
  }

  .popper .search-results ul {
    list-style: none;
    padding: 4px 0;
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

  .svg-inline--fa {
    width: 16px;
    height: 16px;
    opacity: 0.8;
  }

  .svg-inline--fa.fa-times-circle {
    cursor: pointer;
  }

  @media (prefers-color-scheme: dark) {

    .popper .search-results {
      background: #212121;
    }

    .popper .search-result-list-item-selected {
      background: rgba(255, 255, 255, 0.1);
    }
  }
</style>
