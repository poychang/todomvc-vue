# TodoMVC Template

Capture from [TodoMVC](http://todomvc.com) project.

Only the Html and Css files are left as a template for practicing CRUD front-end operations.

![screenshot](http://i.imgur.com/ilUGg0a.png)

## Play by play

### Foundation

You can follow step below to build your Todo app form this starter.

1. Download vue.js from [this link](https://vuejs.org/js/vue.js) and save it into `vendor` folder.
2. Add the script source to bottom of `body` tag in the `index.html`.

    `<script src="vendor/vue.js"></script>`

    You can also ignore step 1 and just add the CDN script source like below:

    `<script src="https://cdn.jsdelivr.net/npm/vue/dist/vue.js"></script>`

3. Now you can open and start building Vue app with `app.js` and `index.html`.
4. Setup Vue instance in `app.js`.
    ```javascript
    new Vue({
        // the root element that will be compiled
        el: '.todoapp',
        // app initial state
        data: {},
        // watch todos change for localStorage persistence
        watch: {},
        // computed properties
        computed: {},
        // methods that implement data logic.
        // note there's no DOM manipulation here at all.
        methods: {},
        // register a global custom directive
        directives: {}
    });
    ```
5. Implement save with local storage and filter logic.
    ```javascript
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
    ```

### Data Binding

Add a array property, `todos`, in Vue's `data` that store todos data and will fetch data from local storage at begin. Also add a `newTodo` for store new todo data from input.

You can use in-template expressions, `{{ newTodo }}`, to output the value of property on the html page. Or use `v-model` to bind the property and element.

```javascript
// in app.js
new Vue({
    data: {
        todos: todoStorage.fetch(),
        newTodo: '',
    },
    // ...
});
```

```html
<!-- in index.html -->
<input
    class="new-todo"
    placeholder="What needs to be done?"
    autofocus
    v-model="newTodo"
/>
```

### Event Binding

Binding <kbd>Enter</kbd> key event with input element to trigger `addTodo` method.

```javascript
// in app.js
    new Vue({
        methods: {
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
        },
        // ...
    });
```

```html
<!-- in index.html -->
<input
    class="new-todo"
    placeholder="What needs to be done?"
    autofocus
    v-model="newTodo"
    @keyup.enter="addTodo"
/>
```

### Watcher

Watcher means monitor a property. It will execute the handler function when the property has changed.

Here we watch `todos` property. When something has changed,  `todos` is an object. The basic watcher only detect the surface. If has deeper changed, that will execute nothing unless you set `deep` as `true`.

```javascript
// in app.js
    new Vue({
        watch: {
            todos: {
                deep: true,
                handler: todoStorage.save
            }
        },
        // ...
    });
```

### Computed Properties

The purpose of `computed` is similar to `watch`. In-template expressions are very convenient, but put too much logic in the template can make then hard to maintain.

For example, blow code has too much operation. It's make your code complex.

```html
<div id="example">
  {{ message.split('').reverse().join('') }}
</div>
```

We can leverage `computed` to encapsulate the complex logic, calculate remaining todos.

```javascript
// in app.js
    new Vue({
        computed: {
            filteredTodos: function() {
                return filters[this.visibility](this.todos);
            },
            remaining: function() {
                return filters.active(this.todos).length;
            }
        },
        // ...
    });
```

```html
<span class="todo-count">
    <strong v-text="remaining"></strong> {{ pluralize('item', remaining) }} left
</span>
```

### Dynamic Structure

Dynamic create the HTML element by data is very common scenario. In Vue.js, we can simply use `v-for` directive on DOM element to achieve the goal.

On the last section, we use `computed` to filtered todos by `filteredTodos`. Now we can use that to generate the whole todo list.

<!-- TODO: 撰寫 v-for 的範例程式碼 -->

```html
<ul class="todo-list">
    <li
        class="todo"
        v-for="todo in filteredTodos"
        :key="todo.id"
    >
        <div class="view">
            <input class="toggle" type="checkbox" v-model="todo.completed" />
            <label @dblclick="editTodo(todo)">{{ todo.title }}</label>
            <button class="destroy" @click="removeTodo(todo)"></button>
        </div>
    </li>
</ul>
```
