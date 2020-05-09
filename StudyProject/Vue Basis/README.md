# [Vue Basis](https://cn.vuejs.org/v2/guide/#%E8%B5%B7%E6%AD%A5) Version 2.X

## 版本 2.X

## [声明式渲染](https://cn.vuejs.org/v2/guide/#%E5%A3%B0%E6%98%8E%E5%BC%8F%E6%B8%B2%E6%9F%93)

文本插值

> {{ app.message }}

数据和 DOM 被建立了关联都是响应式的，修改 JavaScript 控制台 app.message 的值，你将看到相应地更新。

> app.message = 123

* 注意不再和 HTML 直接交互了。一个 Vue 应用会将其挂载到一个 DOM 元素上 (对于这个例子是 #app) 然后对其进行完全控制。那个 HTML 是我们的入口，但其余都会发生在新创建的 Vue 实例内部。

绑定元素 attribute

> v-bind

指令带有前缀 `v-`  Vue 提供的特殊 attribute，在渲染的 DOM 上应用特殊的响应式行为。

> &lt;span v-bind:title="message">

将这个元素节点的 title attribute 和 Vue 实例的 message property 保持一致。

> app2.message = 123

## [条件与循环](https://cn.vuejs.org/v2/guide/#%E6%9D%A1%E4%BB%B6%E4%B8%8E%E5%BE%AA%E7%8E%AF)

> v-if="boolean"

條件判斷渲染

> v-for="todo in todos"

這裡其實感覺像後端的 foreach 但不知為何是 for 像是 python 也淘汰 for 不知為何?

> app4.todos.push({ text: '新项目' })

不仅可以把数据绑定到 DOM 文本或 attribute，还可以绑定到 DOM 结构。

* 还有其它很多指令，每个都有特殊的功能，進階的更可以在 Vue 插入/更新/移除元素时自动应用过渡效果。

## [处理用户输入](https://cn.vuejs.org/v2/guide/#%E5%A4%84%E7%90%86%E7%94%A8%E6%88%B7%E8%BE%93%E5%85%A5)

> v-on + 事件监听器

讓用户和应用进行交互

> v-on:click="reverseMessage"

```JavaScript
var app5 = new Vue({
  el: '#app-5',
  data: {
    message: 'Hello Vue.js!'
  },
  methods: {
    reverseMessage: function () {
      this.message = this.message.split('').reverse().join('')
    }
  }
})
```

### 小結1

跟 Angular 應用上無差別就是綁定，但細節使用上有所差別，且因 NG 強制使用 TS 有些地方會有些許不一樣。

* 更新了应用的状态，但没有触碰 DOM——所有的 DOM 操作都由 Vue 来处理，你编写的代码只需要关注逻辑层面即可。

這裡應該是講說並沒有像 jQ 那樣去抓 DOM 並對 DOM 做操作，而是指對資料做操作。

> v-model

轻松实现表单输入和应用状态之间的双向绑定。

## [组件化应用构建](https://cn.vuejs.org/v2/guide/#%E7%BB%84%E4%BB%B6%E5%8C%96%E5%BA%94%E7%94%A8%E6%9E%84%E5%BB%BA)

一个组件本质上是一个拥有预定义选项的一个 Vue 实例。

類似 Angular 的裝飾器 ?? 不太確定是否是這個意思

> 在 Vue 中注册组件

```JavaScript
// 定义名为 todo-item 的新组件
Vue.component('todo-item', {
  template: '<li>这是个待办项</li>'
})

var app = new Vue(...)
```

> 在 Vue 中使用组件

```HTML
<ol>
  <!-- 创建一个 todo-item 组件的实例 -->
  <todo-item></todo-item>
</ol>
```

> 父作用域将数据传到子组件 - prop

```JavaScript
Vue.component('todo-item', {
  // todo-item 组件现在接受一个
  // "prop"，类似于一个自定义 attribute。
  // 这个 prop 名为 todo。
  props: ['todo'],
  template: '<li>{{ todo.text }}</li>'
})
```

> 使用 v-bind 指令将待办项传到循环输出的每个组件中

```JavaScript
<div id="app-7">
  <ol>
    <!--
      现在我们为每个 todo-item 提供 todo 对象
      todo 对象是变量，即其内容可以是动态的。
      我们也需要为每个组件提供一个 key ，稍后再
      作详细解释。
    -->
    <todo-item
      v-for="item in groceryList"
      v-bind:todo="item"
      v-bind:key="item.id"
    ></todo-item>
  </ol>
</div>
```

```JavaScript
Vue.component('todo-item', {
  props: ['todo'],
  template: '<li>{{ todo.text }}</li>'
})

var app7 = new Vue({
  el: '#app-7',
  data: {
    groceryList: [
      { id: 0, text: '蔬菜' },
      { id: 1, text: '奶酪' },
      { id: 2, text: '随便其它什么人吃的东西' }
    ]
  }
})
```

> 大型組件 example

```HTML
<div id="app">
  <app-nav></app-nav>
  <app-view>
    <app-sidebar></app-sidebar>
    <app-content></app-content>
  </app-view>
</div>
```

### 小結2

這裡與 Angular 也所差異，使用 ng 時多是使用 ng cli 所以生成文件與 component 就由 cli 處理，但 vue 這邊還沒使用過 cli 不太確定差異性。

本質上似乎都是藉由 es6 export 讓組件 interface、class 化的感覺，不然就是要藉由 JS 引入檔的排序做變化。

## [与自定义元素的关系](https://cn.vuejs.org/v2/guide/#%E4%B8%8E%E8%87%AA%E5%AE%9A%E4%B9%89%E5%85%83%E7%B4%A0%E7%9A%84%E5%85%B3%E7%B3%BB)

## [数据与方法](https://cn.vuejs.org/v2/guide/instance.html#%E6%95%B0%E6%8D%AE%E4%B8%8E%E6%96%B9%E6%B3%95)

* Vue 实例被创建时，它将 data 对象中的所有的 property 加入到 Vue 的响应式系统中。当这些 property 的值发生改变时，视图将会产生 响应 ，即匹配更新为新的值。

```JavaScript
// 我们的数据对象
var data = { a: 1 }

// 该对象被加入到一个 Vue 实例中
var vm = new Vue({
  data: data
})

// 获得这个实例上的 property
// 返回源数据中对应的字段
vm.a == data.a // => true

// 设置 property 也会影响到原始数据
vm.a = 2
data.a // => 2

// ……反之亦然
data.a = 3
vm.a // => 3
```

> vm.b = 'hi'

* 只有当实例被创建时就已经存在于 data 中的 property 才是响应式的。对 b 的改动将不会触发任何视图的更新。

```JavaScript
data: {
  newTodoText: '',
  visitCount: 0,
  hideCompletedTodos: false,
  todos: [],
  error: null,
  b:''
}
```

> Object.freeze()

阻止修改现有的 property，响应系统无法再追踪变化。

## [Vue 保留 property 与方法，与用户定义的 property 区分](https://cn.vuejs.org/v2/api/#%E5%AE%9E%E4%BE%8B-property)

```JavaScript
var data = { a: 1 }
var vm = new Vue({
  el: '#example',
  data: data
})

vm.$data === data // => true
vm.$el === document.getElementById('example') // => true

// $watch 是一个实例方法
vm.$watch('a', function (newValue, oldValue) {
  // 这个回调将在 `vm.a` 改变后调用
})
```

## [实例生命周期钩子](https://cn.vuejs.org/v2/guide/instance.html#%E7%94%9F%E5%91%BD%E5%91%A8%E6%9C%9F%E5%9B%BE%E7%A4%BA)

* 不要在选项 property 或回调上使用箭头函数，比如 created: () => console.log(this.a) 或 vm.$watch('a', newValue => this.myMethod())。因为箭头函数并没有 this，this 会作为变量一直向上级词法作用域查找，直至找到为止，经常导致 Uncaught TypeError: Cannot read property of undefined 或 Uncaught TypeError: this.myMethod is not a function 之类的错误。

![IMAGE](https://link)