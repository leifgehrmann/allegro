<template>
    <div>
        {{ message }}
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

</style>
