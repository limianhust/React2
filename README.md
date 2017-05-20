## 我的第二个React App
在第一个React APP 基础上增加网络数据库存储功能，使用leancloud。
### 需求描述
1. 用户在输入框写待办（Todo）
2. 回车即表示添加 Todo
3. 添加 Todo 后输入框清空
4. 每一个待办都可以标记为已完成
5. 每一个待办都能被删除
### 程序构思
最外面是一个 <App/> 标签，里面有各种组件，组合成完整的APP。采用React内置Webpack打包工具打包压缩。

1. <code> \<h1 /\> </code>
2. <code> \<TodoInput /\> </code>
3. <code> \<TodoItem /\> </code>


todoList是数据，todos则是数据在 HTML 里的展现，两者绑定在一起。
## React父子组件间通信的实现：
今天弄清楚了父子组件间通信是怎么实现的。父组件向子组件通信是通过向子组件传递参数props：
 //父组件
	 // APP.js
	 return (
      <div className='App'>

        <h1>我的待办</h1>
        <div className="inputWrapper">
          <TodoInput content={this.state.newTodo}
            onChange={this.changeTitle.bind(this)}
            onSubmit={this.addTodo.bind(this)} />
        </div>
        <ol className='todoList'>
          {todos}
        </ol>
      </div>
    );
     changeTitle(event) {
     this.setState({
       newTodo: event.target.value,
       todoList: this.state.todoList
     })
    }
	  addTodo(event) {
	    this.state.todoList.push({
	      id: idMaker(),
	      title: event.target.value,
	      status: null,
	      deleted: false
	    })
	    console.log('addtodo')
	    this.setState({
	      newTodo: '',
	      todoList: this.state.todoList
	    })
	
	  }

//子组件

    // TodoInput.js
	    export default class TodoInput extends Component {
	    render() {
	        return <input type='text' value={this.props.content}
	            className="TodoInput"
	            //这里为什么要绑定this呢，因为在事件的回调函数（
	            //也就是changeTitle）里，this是指向触发事件的目标元素，
	            //而我们对this有特殊的用途，必须让this指向子组件本身，
	            //我们才能取到props里的回调函数，来加以调用。因此必须
	            //绑定this指向子组件。
	            onChange={this.changeTitle.bind(this)}
	            onKeyPress={this.submit.bind(this)}
	             />
	    }
	    submit(e) {
	        if (e.key == 'Enter') {
	        		 //调用父组件里的onSubmit函数，
	        		 //并将事件对象作为参数传递进去
	            this.props.onSubmit(e)  
	            console.log('enter')
	        }
	    }
	    changeTitle(event) {
	        this.props.onChange(event)
	    }
	}

父组件中实例化一个子组件时传递了参数```content={this.state.newTodo```,这是一个字符串```this.state = {
      newTodo: '',
      todoList: [
      ]
    }```，这样实现了父组件向子组件传递了参数。
  
那么子组件是怎么向父组件通信的呢？父组件向子组件通信是传递参数，很自然的如果传递的是父组件里定义的回调函数，子组件通过props来调用这个回调函数，也就实现了子组件向父组件通信的目的了。上面的```onChange```和```onSubmit ```都是父组件向子组件传递的```props```里，而且他们都指向父组件里的```changeTitle```和```addTodo```函数，在需要时，子组件就可以通过props调用它们，这样就实现了子组件向父组件通信的目的。一句话总结：当传递数据给子组件的props时: 

```content={this.state.newTodo}```
，就是父组件向子组件通信，当传递的是回调函数名给props时:
 ```onChange={this.changeTitle.bind(this)}```

，就是子组件向父组件通信。

## 利用本地存储localStorage实现刷新后数据还在
由于componentDidUpdate会在组件更新后调用，将存储函数写进componentDidUpdate里，每次数据更新后，组件会更新，调用存储函数实现数据存储同步更新。
