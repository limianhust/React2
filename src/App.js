import React, { Component } from 'react';
//import logo from './logo.svg';
import './App.css';
import 'normalize.css'
import './reset.css'
import TodoInput from './TodoInput';
import TodoItem from './TodoItem';
//import {save, load} from './localstore';
import UserDialog from './UserDialog';
import { destroy, getByUser, TodoModel, getCurrentUser, signOut, init, save, getUserFormAVUser } from './leancloud'

class App extends Component {
  constructor(props) {
    super(props)
    this.state = {
      user: getCurrentUser() || {},
      newTodo: '',
      todoList: []  //localStore.load('todoList')
    }
    let user = getCurrentUser()
    //console.log(user.name)


    if (user) {
      TodoModel.getByUser(user, (todos) => {
        let stateCopy = JSON.parse(JSON.stringify(this.state))
        stateCopy.todoList = todos
        // console.log('转换前，')
        // console.log(user)
        user = getUserFormAVUser(user)
        // console.log('转换后w')
        // console.log(user)
        stateCopy.user = user
        this.setState(stateCopy)
      })
    }
  }
  render() {
    //未完成事项
    let todos = this.state.todoList
      .filter((item) => !item.deleted && !(item.status.status === 'completed'))
      .map((item, index) => {
        return (
          <li key={index}>
            <TodoItem todo={item}
              onToggle={this.toggle.bind(this)}
              onDelete={this.delete.bind(this)} />
          </li>
        )
      })
    //已完成事项
    let done = this.state.todoList
      .filter((item) => !item.deleted && (item.status.status === 'completed'))
      .map((item, index) => {
        return (
          <li key={index}>
            <TodoItem todo={item}
              onToggle={this.toggle.bind(this)}
              onDelete={this.delete.bind(this)} />
          </li>
        )
      })
    return (
      <div className='App'>
        <nav>
          
          <p className="username"><span className="user-iconfont color">&#xe613;</span>
          {this.state.user.username || '未登陆'}</p>
          <div className="logout" onClick={this.onSignOut.bind(this)} >
            <span className="logout-iconfont">&#xe618;</span>
            注销</div>
          
        </nav>
        <div className="inputWrapper">
          <TodoInput content={this.state.newTodo}
            onChange={this.changeTitle.bind(this)}
            onSubmit={this.addTodo.bind(this)} />
        </div>
        <div className="todo-wrapper">
          <h3>未完成事项</h3>
          <ol className='todoList'>
            {todos}
          </ol>
        </div>
        <div className="done-wrapper">
          <h3>已完成事项</h3>
          <ol className='doneList'>
            {done}
          </ol>
        </div>

        {this.state.user.id ? null : <UserDialog
          onSignUp={this.onSignUp.bind(this)}
          onSignIn={this.onSignIn.bind(this)}
          onSignOut={this.onSignOut.bind(this)} />}
      </div>
    );
  }

  //注册成功回调函数
  onSignUp(user) {
    //console.log(user)
    let stateCopy = JSON.parse(JSON.stringify(this.state))
    stateCopy.user = user
    this.setState(stateCopy)
  }

  //登陆成功回调函数
  onSignIn(user) {
    //console.log(user)
    let stateCopy = JSON.parse(JSON.stringify(this.state))
    stateCopy.user = user

    this.setState(stateCopy)
    //登陆成功后向云端拉取全部todoList更新到页面
    TodoModel.getByUser(user, (todos) => {
      let stateCopy = JSON.parse(JSON.stringify(this.state))
      stateCopy.todoList = todos
      stateCopy.user = user
      console.log('登陆成功后user.name')
      console.log(user.name)
      this.setState(stateCopy)
    }, (error) => {
      console.log(error)
    })
    //init(user.id)
  }

  //登出账号
  onSignOut() {
    let stateCopy = JSON.parse(JSON.stringify(this.state))
    stateCopy.user = {}
    stateCopy.newTodo = ''
    stateCopy.todoList = []
    this.setState(stateCopy)
    signOut()
  }

  componentDidUpdate() {
    //save('todoList',this.state.todoList)
  }
  //删除todo
  delete(event, todo) {

    TodoModel.destroy(todo.id, (response) => {
      todo.deleted = true
      this.setState(this.state)
      console.log(response)
    })
    //save('todoList',this.state.todoList)
  }
  //事项状态切换
  toggle(e, todo) {
    let oldStatus = todo.status.status
    var newStatus = oldStatus === 'completed' ? '' : 'completed'
    // todo.status = todo.status === 'completed' ? '' : 'completed'
    // this.setState(this.state)
    TodoModel.update(todo.id, newStatus, () => {
      todo.status.status = todo.status.status === 'completed' ? '' : 'completed'
      this.setState(this.state)
    })
    //save('todoList',this.state.todoList)
  }
  changeTitle(event) {
    this.setState({
      newTodo: event.target.value,
      todoList: this.state.todoList
    })
    //save('todoList',this.state.todoList)
  }
  addTodo(event) {
    //console.log(this.state.newTodo)
    // this.state.todoList.push({
    //   id: idMaker(),
    //   title: event.target.value,
    //   status: null,
    //   deleted: false
    // })
    let newTodo = {
      title: event.target.value,
      status: { status: '' },
      deleted: false
    }
    TodoModel.create(newTodo, (id) => {
      newTodo.id = id
      this.state.todoList.push(newTodo)
      this.setState({
        newTodo: '',
        todoList: this.state.todoList
      })
    }, (error) => {
      console.log(error)
    })
    this.setState({
      newTodo: '',
      todoList: this.state.todoList
    })

  }

}

export default App;

let id = 0;

function idMaker() {
  id += 1
  return id
}
