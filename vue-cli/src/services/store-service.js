// store todos
let STORAGE_KEY = 'todos-vuejs';
export let todoStorage = {
    fetch: () => JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]'),
    save: todos => {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(todos));
    }
};

// todos' filter methods
export let filters = {
    all: todos => todos,
    active: todos => todos.filter(todo => !todo.completed),
    completed: todos => todos.filter(todo => todo.completed)
};
