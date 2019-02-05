<template>
    <div id="app">
        <Todos title="todos"/>
    </div>
</template>

<script>
import Todos from './components/todos.vue';

export default {
    name: 'app',
    components: {
        Todos
    }
};
</script>

<style>
</style>
