<template>
    <div>
        <section class="todoapp">
            <header class="header">
                <h1>{{ title }}</h1>
                <input
                    class="new-todo"
                    placeholder="What needs to be done?"
                    autofocus
                    v-model="newTodo"
                    @keyup.enter="addTodo"
                >
            </header>
            <!-- This section should be hidden by default and shown when there are todos -->
            <section class="main">
                <input class="toggle-all" type="checkbox" v-model="toggleAll" @click="allDone()">
                <label for="toggle-all">Mark all as complete</label>
                <ul class="todo-list">
                    <!-- These are here just to show the structure of the list items -->
                    <!-- List items should get the class `editing` when editing and `completed` when marked as completed -->
                    <li
                        class="todo"
                        v-for="todo in filteredTodos"
                        :key="todo.id"
                        :class="{completed: todo.completed, editing: todo == editedTodo}"
                    >
                        <div class="view">
                            <input class="toggle" type="checkbox" v-model="todo.completed">
                            <label @dblclick="editTodo(todo)">{{ todo.title }}</label>
                            <button class="destroy" @click="removeTodo(todo)"></button>
                        </div>
                        <input
                            class="edit"
                            type="text"
                            v-model="todo.title"
                            v-todo-focus="todo == editedTodo"
                            @blur="doneEdit(todo)"
                            @keyup.enter="doneEdit(todo)"
                            @keyup.esc="cancelEdit(todo)"
                        >
                    </li>
                </ul>
            </section>
            <!-- This footer should hidden by default and shown when there are todos -->
            <footer class="footer">
                <!-- This should be `0 items left` by default -->
                <span class="todo-count">
                    <strong v-text="remaining"></strong>
                    {{ pluralize('item', remaining) }} left
                </span>
                <!-- Remove this if you don't implement routing -->
                <ul class="filters">
                    <li>
                        <a :class="{selected: visibility == 'all'}" @click="action('all')">All</a>
                    </li>
                    <li>
                        <a
                            :class="{selected: visibility == 'active'}"
                            @click="action('active')"
                        >Active</a>
                    </li>
                    <li>
                        <a
                            :class="{selected: visibility == 'completed'}"
                            @click="action('completed')"
                        >Completed</a>
                    </li>
                </ul>
                <!-- Hidden if no completed items are left ↓ -->
                <button
                    class="clear-completed"
                    @click="removeCompleted"
                    v-show="todos.length > remaining"
                >Clear completed</button>
            </footer>
        </section>
        <footer class="info">
            <p>Double-click to edit a todo</p>
            <!-- Remove the below line ↓ -->
            <p>
                Template by
                <a href="http://sindresorhus.com">Sindre Sorhus</a>
            </p>
            <!-- Change this out with your name and url ↓ -->
            <p>
                Created by
                <a href="https://poychang.github.io">Poy Chang</a>
            </p>
            <p>
                Part of
                <a href="http://todomvc.com">TodoMVC</a>
            </p>
        </footer>
    </div>
</template>

<script>
import { todoStorage, filters } from '../services/store-service';

export default {
    name: 'Todos',
    props: {
        title: String
    },
    // app initial state
    data: () => ({
        todos: todoStorage.fetch(),
        newTodo: '',
        editedTodo: null,
        visibility: 'all',
        toggleAll: false
    }),
    // watch todos change for localStorage persistence
    watch: {
        todos: {
            deep: true,
            handler: todoStorage.save
        }
    },
    // computed properties
    computed: {
        filteredTodos: function() {
            return filters[this.visibility](this.todos);
        },
        remaining: function() {
            return filters.active(this.todos).length;
        }
    },
    // methods that implement data logic.
    // note there's no DOM manipulation here at all.
    methods: {
        allDone: function() {
            this.todos.forEach(todo => {
                todo.completed = this.toggleAll;
            });
        },
        pluralize: (word, count) => word + (count === 1 ? '' : 's'),
        addTodo: function() {
            let value = this.newTodo && this.newTodo.trim();
            if (!value) {
                return;
            }
            this.todos.push({
                id: this.todos.length + 1,
                title: value,
                completed: false
            });
            this.newTodo = '';
        },
        removeTodo: function(todo) {
            let index = this.todos.indexOf(todo);
            this.todos.splice(index, 1);
        },
        editTodo: function(todo) {
            this.beforeEditCache = todo.title;
            this.editedTodo = todo;
        },
        doneEdit: function(todo) {
            if (!this.editedTodo) {
                return;
            }
            this.editedTodo = null;
            todo.title = todo.title.trim();
            if (!todo.title) {
                this.removeTodo(todo);
            }
        },
        cancelEdit: function(todo) {
            this.editedTodo = null;
            todo.title = this.beforeEditCache;
        },
        removeCompleted: function() {
            this.todos = filters.active(this.todos);
        },
        action: function(act) {
            switch (act) {
                case 'all':
                    this.visibility = act;
                    break;
                case 'active':
                    this.visibility = act;
                    break;
                case 'completed':
                    this.visibility = act;
                    break;
                default:
                    this.visibility = 'all';
                    break;
            }
        }
    },
    // a custom directive to wait for the DOM to be updated before focusing on the input field.
    // http://vuejs.org/guide/custom-directive.html
    directives: {
        'todo-focus': function(el, binding) {
            if (binding.value) {
                el.focus();
            }
        }
    }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
</style>
