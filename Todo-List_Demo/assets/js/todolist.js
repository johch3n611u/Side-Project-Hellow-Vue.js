Vue.component('todo-item', {
    template: '\
    <li>\
      {{ title }}\
      。<button v-on:click="$emit(\'remove\')">刪除</button>\
    </li>\
  ',
    props: ['title']
})

new Vue({
    el: '#todo-list',
    data: {
        newTodoText: '',
        todos: [{
                id: 1,
                title: '吃早餐',
            },
            {
                id: 2,
                title: '起床',
            },
            {
                id: 3,
                title: '打開電腦'
            }
        ],
        nextTodoId: 4
    },
    methods: {
        addNewTodo: function() {
            this.todos.push({
                id: this.nextTodoId++,
                title: this.newTodoText
            })
            this.newTodoText = ''
        }
    }
})