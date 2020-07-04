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
        <td scope="row" class="handle">Drag</td>
        <td>
          <div class="dateField">
            <label>
              <input type="date">
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
        <td><button>Delete</button></td>
      </tr>
    </draggable>
    <tr class="worklogs-add-row">
      <td colspan="100"><button>Add Worklog</button></td>
    </tr>
  </table>
</template>

<script>
import { Vue } from 'vue-property-decorator';
import Draggable from 'vuedraggable';

export default Vue.extend({
  name: 'Worklogs',
  components: {
    Draggable,
  },
  data() {
    return {
      list: [
        { id: 1, name: 'Abby', sport: 'basket' },
        { id: 2, name: 'Brooke', sport: 'foot' },
        { id: 3, name: 'Courtenay', sport: 'volley' },
        { id: 4, name: 'David', sport: 'rugby' },
      ],
      dragging: false,
    };
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
  width: 30px; padding-left: 3px; padding-right: 3px;
}
table td:nth-child(2), table th:nth-child(2) {
  width: 135px; padding-left: 3px; padding-right: 3px;
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
</style>
