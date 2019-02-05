(function() {
    'use strict';

    // store todos
    var STORAGE_KEY = 'todos-vuejs';
    var todoStorage = {
        fetch: () => JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]'),
        save: todos => {
            localStorage.setItem(STORAGE_KEY, JSON.stringify(todos));
        }
    };

    // todos' filter methods
    var filters = {
        all: todos => todos,
        active: todos => todos.filter(todo => !todo.completed),
        completed: todos => todos.filter(todo => todo.completed)
    };

    // setup Vue instance
    new Vue({
        // the root element that will be compiled
        el: '.todoapp',
        // app initial state
        data: {
            todos: todoStorage.fetch(),
            newTodo: '',
            editedTodo: null,
            visibility: 'all',
            toggleAll: false
        },
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
                var value = this.newTodo && this.newTodo.trim();
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
                var index = this.todos.indexOf(todo);
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
    });
})();
