<template>
  <table class="worklogs">
    <thead>
    <tr>
      <th>Date</th>
      <th>Issue</th>
      <th>Minutes</th>
      <th>Message</th>
      <th>Account</th>
      <th>Category</th>
      <th></th>
    </tr>
    </thead>
    <tbody>
    <tr>
      <td>
        <input type="date">
      </td>
      <td>
        <div class="issueField">
          <input name="issueKey" type="text" placeholder="Key">
          <span class="resolvedIssueName">Hello World this is a resolved issue name</span>
        </div>
      </td>
      <td>
        <input type="number" min="0">
      </td>
      <td>
                            <span
                              class="textarea"
                              role="textbox"
                              contenteditable>
    99
</span>
      </td>
      <td>

      </td>
      <td>

      </td>
      <td>
        <button>Delete</button>
      </td>
    </tr>
    </tbody>
  </table>
</template>

<script>
import { Vue } from 'vue-property-decorator';

export default Vue.extend({
  name: 'Worklogs',
  methods: {
    close() {
      this.$emit('close');
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
  vertical-align: top;
  top: 0;
  position: sticky;
  user-select: none;
}
.worklogs thead th {
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
.worklogs tr td button {
  visibility: hidden;
}
.worklogs tr:hover td button {
  visibility: visible;
}
table td:nth-child(1), table th:nth-child(1) {
  width: 135px; padding-left: 3px; padding-right: 3px;
}
table td:nth-child(2), table th:nth-child(2) {
  width: 135px; padding-left: 3px; padding-right: 3px;
}
table td:nth-child(3), table th:nth-child(3) {
  width: 60px; padding-left: 3px; padding-right: 3px;
}
.issueField {
  display: flex;
}
.issueField input[name="issueKey"] {
  width: 80px;
}
.resolvedIssueName {
  white-space: nowrap;
  display: block;
}
</style>
