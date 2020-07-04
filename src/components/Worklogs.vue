<template>
  <table class="worklogs">
    <tr>
      <th scope="col"></th>
      <th scope="col">Date</th>
      <th scope="col">Issue</th>
      <th scope="col">Minutes</th>
      <th scope="col">Message</th>
      <th scope="col">Account</th>
      <th scope="col">Category</th>
      <th scope="col">Actions</th>
    </tr>
    <draggable v-model="list" tag="tbody" handle=".handle">
      <tr v-for="item in list" :key="item.name">
        <td scope="row" class="handle">
          <font-awesome-icon icon="grip-lines"/>
        </td>
        <td>
          <div class="dateField">
            <label>
              <input name="date" type="date">
              <button name="date-minus"><font-awesome-icon icon="chevron-left"/></button>
              <button name="date-plus"><font-awesome-icon icon="chevron-right"/></button>
            </label>
          </div>
        </td>
        <td>
          <div class="issueField">
            <label>
              <input name="issueKey" type="text" placeholder="Key" v-model="item.id">
            </label>
            <span class="resolvedIssueName">Hello World this is a resolved issue name</span>
          </div>
        </td>
        <td>
          <div class="minutesField">
            <label>
              <input type="number" min="0">
            </label>
          </div>
        </td>
        <td>
          <div class="messageField">
            <label>
              <textarea rows="1" v-model="item.sport"/>
            </label>
          </div>
        </td>
        <td>
          <label>
            <select>
              <option>alpha</option>
              <option>beta</option>
              <option>gamma</option>
            </select>
          </label>
        </td>
        <td>
          <label>
            <select>
              <option>alpha</option>
              <option>beta</option>
              <option>gamma</option>
            </select>
          </label>
        </td>
        <td><button name="delete"><font-awesome-icon icon="trash"/> Delete</button></td>
      </tr>
    </draggable>
    <tr class="worklogs-add-row">
      <td></td>
      <td colspan="100">
        <button
          name="add"
          @click="addWorklog"
        >
          <font-awesome-icon icon="plus"/> Add Worklog
        </button>
      </td>
    </tr>
  </table>
</template>

<script>
import { Vue } from 'vue-property-decorator';
import Draggable from 'vuedraggable';
import { library } from '@fortawesome/fontawesome-svg-core';
import {
  faGripLines, faPlus, faChevronLeft, faChevronRight, faTrash,
} from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';

library.add(faGripLines);
library.add(faPlus);
library.add(faTrash);
library.add(faChevronLeft);
library.add(faChevronRight);
library.add(faTrash);

const list = [
  { id: 1, name: 'Abby', sport: 'basket' },
  { id: 2, name: 'Brooke', sport: 'foot' },
  { id: 3, name: 'Courtenay', sport: 'volley' },
  { id: 4, name: 'David', sport: 'rugby' },
];

export default Vue.extend({
  name: 'Worklogs',
  components: {
    Draggable,
    FontAwesomeIcon,
  },
  data() {
    return {
      list,
      dragging: false,
    };
  },
  methods: {
    addWorklog() {
      list.push(
        { id: 0, name: '', sport: '' },
      );
    },
  },
});
</script>

<style scoped>
.worklogs {
  width: 100%;
  border-collapse: collapse;
  border-spacing: 0;
  position: relative;
}
.worklogs tr {
  font-weight: inherit;
  text-align: left;
  padding: 7px;
  padding-left: 9px;
  vertical-align: middle;
  top: 0;
  position: sticky;
  user-select: none;
  background: #FFFFFF;
  border-bottom: 1px solid #EEEEEE;
}
.worklogs tr.worklogs-add-row {
  border-bottom: none;
}
.worklogs tr.worklogs-add-row td {
  border-bottom: none;
}
.worklogs th {
  font-weight: inherit;
  text-align: left;
  padding: 7px;
  padding-left: 9px;
  vertical-align: bottom;
  background: #F7F7F7;
  top: 0;
  position: sticky;
  user-select: none;
}
.worklogs td {
  padding: 5px;
}
table td:nth-child(1), table th:nth-child(1) {
  padding-left: 10px;
  padding-right: 10px;
  text-align: center;
}
table td:nth-child(2), table th:nth-child(2) {
  width: 195px; padding-left: 3px; padding-right: 3px;
}
table td:nth-child(3), table th:nth-child(3) {
  width: 60px; padding-left: 3px; padding-right: 3px;
}
table td:nth-child(4), table th:nth-child(4) {
  width: 30px; padding-left: 3px; padding-right: 3px;
}
table td:nth-child(5), table th:nth-child(5) {
  width: 220px; padding-left: 3px; padding-right: 3px;
}
.dateField input {
  width: 135px;
}
.dateField [name=date] {
  width: 135px;
  border-bottom-right-radius: 0;
  border-top-right-radius: 0;
}
.dateField [name=date-minus] {
  border-radius: 0;
}
.dateField [name=date-plus] {
  border-bottom-left-radius: 0;
  border-top-left-radius: 0;
}
.issueField {
  display: flex;
}
.issueField input[name="issueKey"] {
  width: 80px;
}
.minutesField input {
  width: 50px;
}
.messageField textarea {
  min-width: 300px;
  min-height: 15px;
  width: 300px;
}
.resolvedIssueName {
  white-space: nowrap;
  display: block;
}
.messageField textarea {
  min-width: 300px;
  min-height: 15px;
  width: 300px;
}

button[name=delete] {
  background: rgba(255, 0, 0, 0.2);
  white-space: nowrap;
}

button[name=add] {
  background: rgba(0, 128, 255, 0.2);
  white-space: nowrap;
}
</style>
