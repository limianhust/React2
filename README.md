## 我的第一个React App
### 需求描述
1. 用户在输入框写待办（Todo）
2. 回车即表示添加 Todo
3. 添加 Todo 后输入框清空
4. 每一个待办都可以标记为已完成
5. 每一个待办都能被删除
### 程序构思
最外面是一个 <App/> 标签，里面有各种组件，组合成完整的APP。

1. <code> \<h1 /\> </code>
2. <code> \<TodoInput /\> </code>
3. <code> \<TodoItem /\> </code>


todoList是数据，todos则是数据在 HTML 里的展现，两者绑定在一起。