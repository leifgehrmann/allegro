<template>
    <div>
        {{ message }}
    </div>
</template>

<script>
    import Vue from "vue";

    export default Vue.extend({
        name: 'App',
        components: {},
        data: () => ({
            message: 'hello my World!'
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
