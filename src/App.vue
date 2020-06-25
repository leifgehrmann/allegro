<template>
    <div>
        <div class="content">
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
                    <tr>
                        <td>
                            <button>Delete</button>
                        </td>
                    </tr>
                    <tr>
                        <td>
                            <button>Delete</button>
                        </td>
                    </tr>
                    <tr>
                        <td>
                            <button>Delete</button>
                        </td>
                    </tr>
                    <tr>
                        <td>
                            <button>Delete</button>
                        </td>
                    </tr>
                    <tr>
                        <td>
                            <button>Delete</button>
                        </td>
                    </tr>
                    <tr>
                        <td>
                            <button>Delete</button>
                        </td>
                    </tr>
                    <tr>
                        <td>
                            <button>Delete</button>
                        </td>
                    </tr>
                    <tr>
                        <td>
                            <button>Delete</button>
                        </td>
                    </tr>
                    <tr>
                        <td>
                            <button>Delete</button>
                        </td>
                    </tr>
                    <tr>
                        <td>
                            <button>Delete</button>
                        </td>
                    </tr>
                </tbody>
            </table>
        </div>
        <div class="footer">
            <div class="align-left">
                <button id="submit-addEntry" class="icon icon-labeled-horizontal icon-jira-connected">JIRA: OK</button>
                <button id="submit-addEntry" class="icon icon-labeled-horizontal icon-tempo-connected">Tempo: OK</button>
            </div>
            <div class="align-right">
                <button id="submit-submitEntries">Submit Worklogs</button>
            </div>
        </div>
    </div>
</template>

<script lang="ts">
import Vue from "vue";

export default Vue.extend({
    name: 'App',
    components: {},
    data: () => ({
        message: 'Hello World'
    }),
    created() {
        this.initialize();
    },
    methods: {
        initialize: () => {
            // this.message = 'boo!'
        }
    },
});
</script>

<style scoped>
    .content {
        width: 100%;
        height: 100%;
        padding-bottom: 37px;
    }
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

    table td:nth-child(1), table th:nth-child(1) { width: 135px; padding-left: 3px; padding-right: 3px; }
    table td:nth-child(2), table th:nth-child(2) { width: 135px; padding-left: 3px; padding-right: 3px; }
    table td:nth-child(3), table th:nth-child(3) { width: 60px; padding-left: 3px; padding-right: 3px; }

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

    .footer {
        position: fixed;
        left: 0;
        bottom: 0;
        width: 100%;
        backdrop-filter: blur(10px);
        background-color: rgba(255, 255, 255, 0.5);
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

<style>
    body {
        margin: 0;
        background: #FFF;

        font-weight: 400;
        font-family: Helvetica, Arial, Verdana, sans-serif;
        font-size: 13px;
    }

    body.window-unfocused button,
    body.window-unfocused select,
    body.window-unfocused input,
    body.window-unfocused .textarea {
        opacity: 0.5;
    }

    button {
        background-color: rgba(0, 0, 0, 0.05);
        border: none;
        margin: 0;
        padding: 5px;
        border-radius: 5px;
        outline: none;
    }

    button:hover {
        background-color: rgba(0, 0, 0, 0.02);
    }

    .icon {
        display: inline-block;
        vertical-align: middle;
        background-size: 16px 16px;
        background-position: left;
        background-position-x: 5px;
        background-position-y: 5px;
        background-repeat: no-repeat;
        width: calc(16px + 5px * 2);
        height: calc(16px + 5px * 2);
    }

    button.icon-jira-connected {
        background-image: url("images/jira-connected.svg");
    }

    button.icon-tempo-connected {
        background-image: url("images/tempo-connected.svg");
    }

    button.icon-labeled-horizontal {
        padding-left: calc(16px + 10px);
        width: auto;
    }

    input {
        border: none;
        border-bottom: 1px solid rgba(0, 0, 0, 0.2);
        padding: 5px;
        outline: none;
    }

    input[type="date"] {
        padding: 5px;
        border-radius: 0;
    }

    input:focus {
        border-bottom: 1px solid rgba(0, 0, 0, 0.4);
    }

    .textarea {
        display: block;
        border: none;
        border-bottom: 1px solid rgba(0, 0, 0, 0.2);
        padding: 5px;
        outline: none;
        font-family: Helvetica, Arial, Verdana, sans-serif;
    }
</style>
