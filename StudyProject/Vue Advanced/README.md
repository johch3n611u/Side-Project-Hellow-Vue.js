# 總結

# [Vue Advanced](https://cn.vuejs.org/v2/guide/components-registration.html) Version 2.X

## 组件名

建議 "字母全小写且必须包含一个连字符"。这会帮助你避免和当前以及未来的 HTML 元素相冲突。

my-component-name

## 全域 vs 局部 聲明

### 全域

```JavaScript
Vue.component(
    'my-component-name',
    {/*...*/}
    )

new Vue({el:'#App'})
```

### 局部

```JavaScript
var ComponentName = {/*...*/}
new Vue({
    el:'#App',
    components:{
        'my-component-name' : ComponentName
    }
})
```

### ES5+ Module

```JavaScript
import Component from './Component'

export default {
    components: {
    Component,
  },
  // ...
}
```

### [自动化全局注册 Vue CLI 3+ 實例](https://github.com/chrisvfritz/vue-enterprise-boilerplate/blob/master/src/components/_globals.js)

## [Prop](https://cn.vuejs.org/v2/guide/components-props.html)

### 大小寫

### Prop 类型

数字 布尔值 数组 对象

### 传递静态或动态 Prop

即便 `false` 是静态的，我们仍然需要 `v-bind` 来告诉 Vue 这是一个 JavaScript 表达式而不是一个字符串。

```JavaScript
post: {
  id: 1,
  title: 'My Journey with Vue'
}

<blog-post v-bind="post"></blog-post>
//等价于：
<blog-post
  v-bind:id="post.id"
  v-bind:title="post.title"
></blog-post>
```

### 单向数据流

類似 React 只支援從上到下的資料流

### [Prop 验证检查、类型检查](https://cn.vuejs.org/v2/guide/components-props.html#Prop-%E9%AA%8C%E8%AF%81)

一些類似 MVC 內　Module 的模型屬性，並顯示於控制台警告方便開發。　<https://docs.microsoft.com/zh-tw/aspnet/core/mvc/models/validation?view=aspnetcore-3.1#validation-attributes>

### 非 Prop 的 Attribute

e.g. 通过一个 Bootstrap 插件使用了一个第三方的 &lt;bootstrap-date-input> 组件，这个插件需要在其 &lt;input> 上用到一个 data-date-picker attribute。

### 替换/合并已有的 Attribute

对于绝大多数 attribute 来说，从外部提供给组件的值会替换掉组件内部设置好的值。 type="text" 就会替换掉 type="date"

庆幸的是，class 和 style attribute 会稍微智能一些，即两边的值会被合并起来，从而得到最终的值：form-control date-picker-theme-dark。

#### 禁用 Attribute 继承

不希望组件的根元素继承 attribute，你可以在组件的选项中设置 inheritAttrs: false

配合实例的 $attrs property 使用，该 property 包含了传递给一个组件的 attribute 名和 attribute 值

就可以手动决定这些 attribute 会被赋予哪个元素。

```JavaScript
Vue.component('base-input', {
  inheritAttrs: false,
  props: ['label', 'value'],
  template: `
    <label>
      {{ label }}
      <input
        v-bind="$attrs"
        v-bind:value="value"
        v-on:input="$emit('input', $event.target.value)"
      >
    </label>
  `
})
```

## [自定义事件](https://cn.vuejs.org/v2/guide/components-custom-events.html)

### 事件名

不同于组件和 prop，事件名不存在任何自动化的大小写转换。而是触发的事件名需要完全匹配监听这个事件所用的名称。

因此，我们推荐你始终使用 kebab-case 的事件名。

Kebeb Case(Kebeb-Case)

Kebeb本身是烤肉串的意思，變數就像烤肉串一樣串在一起。

命名方式：在單字間加入破折號hyphen。

例子：good-to-eat, cart-item。

常用場景：通常會用在網址。如本篇的naming-convention

### 自定义组件的 v-model

一个组件上的 v-model 默认会利用名为 value 的 prop 和名为 input 的事件，但单选框、复选框等类型的输入控件可能会将 value attribute 用于[不同的目的](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input/checkbox#Value)。model 选项可以用来避免这样的冲突：

```JavaScript
Vue.component('base-checkbox', {
  model: {
    prop: 'checked',
    event: 'change'
  },
  props: {
    checked: Boolean
  },
  template: `
    <input
      type="checkbox"
      v-bind:checked="checked"
      v-on:change="$emit('change', $event.target.checked)"
    >
  `
})

//<base-checkbox v-model="lovingVue"></base-checkbox>
```

### 将原生事件绑定到组件

使用 v-on 的 .native 修饰符

```JavaScript
<base-input v-on:focus.native="onFocus"></base-input>
// 可能的失敗案例　<base-input> 组件可能做了如下重构，所以根元素实际上是一个 <label> 元素
<label>
  {{ label }}
  <input
    v-bind="$attrs"
    v-bind:value="value"
    v-on:input="$emit('input', $event.target.value)"
  >
</label>
// 为了解决这个问题，Vue 提供了一个 $listeners property，它是一个对象，里面包含了作用在这个组件上的所有监听器。
{
  focus: function (event) { /* ... */ }
  input: function (value) { /* ... */ },
}
// 现在 <base-input> 组件是一个完全透明的包裹器了，也就是说它可以完全像一个普通的 <input> 元素一样使用了：所有跟它相同的 attribute 和监听器都可以工作。
Vue.component('base-input', {
  inheritAttrs: false,
  props: ['label', 'value'],
  computed: {
    inputListeners: function () {
      var vm = this
      // `Object.assign` 将所有的对象合并为一个新对象
      return Object.assign({},
        // 我们从父级添加所有的监听器
        this.$listeners,
        // 然后我们添加自定义监听器，
        // 或覆写一些监听器的行为
        {
          // 这里确保组件配合 `v-model` 的工作
          input: function (event) {
            vm.$emit('input', event.target.value)
          }
        }
      )
    }
  },
  template: `
    <label>
      {{ label }}
      <input
        v-bind="$attrs"
        v-bind:value="value"
        v-on="inputListeners"
      >
    </label>
  `
})
```

### .sync 修饰符

在有些情况下，我们可能需要对一个 prop 进行'双向绑定'。不幸的是，真正的双向绑定会带来维护上的问题，因为子组件可以变更父组件，且在父组件和子组件都没有明显的变更来源。

* 这也是为什么我们推荐以 update:myPropName 的模式触发事件取而代之。

```JavaScript
this.$emit('update:title', newTitle)

<text-document
  v-bind:title="doc.title"
  v-on:update:title="doc.title = $event"
></text-document>
// 等價於
<text-document v-bind:title.sync="doc.title"></text-document>
```

＊　注意带有 .sync 修饰符的 v-bind 不能和表达式一起使用 (例如 v-bind:title.sync=’doc.title + ‘!’’ 是无效的)。取而代之的是，你只能提供你想要绑定的 property 名，类似 v-mode＊

### 小結1

vue 相對於 ng、react 發展較晚所以吸收容納了許多類似的架構還有融入像 ts 的 es5+ 內容，理解容易但就要看實作熟練度了。

## [插槽](https://cn.vuejs.org/v2/guide/components-slots.html)

## [动态组件 & 异步组件](https://cn.vuejs.org/v2/guide/components-dynamic-async.html)

## [处理边界情况](https://cn.vuejs.org/v2/guide/components-edge-cases.html)

# 过渡 & 动画

## [进入/离开 & 列表过渡](https://cn.vuejs.org/v2/guide/transitions.html)

## [状态过渡](https://cn.vuejs.org/v2/guide/transitioning-state.html)

# 可复用性 & 组合

## [混入](https://cn.vuejs.org/v2/guide/mixins.html)

## [自定义指令](https://cn.vuejs.org/v2/guide/custom-directive.html)

## [渲染函数 & JSX](https://cn.vuejs.org/v2/guide/render-function.html)

## [插件](https://cn.vuejs.org/v2/guide/plugins.html)

## [过滤器](https://cn.vuejs.org/v2/guide/filters.html)

# 工具

## [单文件组件](https://cn.vuejs.org/v2/guide/single-file-components.html)

## [单元测试](https://cn.vuejs.org/v2/guide/unit-testing.html)

## [TypeScript 支持](https://cn.vuejs.org/v2/guide/typescript.html)

## [生产环境部署](https://cn.vuejs.org/v2/guide/deployment.html)

# 規模化

## [路由](https://cn.vuejs.org/v2/guide/routing.html)

## [状态管理](https://cn.vuejs.org/v2/guide/state-management.html)

## [服务端渲染](https://cn.vuejs.org/v2/guide/ssr.html)

## [安全](https://cn.vuejs.org/v2/guide/security.html)

# [内在 深入响应式原理](https://cn.vuejs.org/v2/guide/reactivity.html)

# [迁移](https://cn.vuejs.org/v2/guide/migration.html)

# [更多](https://cn.vuejs.org/v2/guide/comparison.html)
