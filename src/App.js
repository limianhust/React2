import React, { Component } from 'react';
//import logo from './logo.svg';
import './App.css';
import 'normalize.css'
import './reset.css'
import TodoInput from './TodoInput';
import TodoItem from './TodoItem';
//import {save, load} from './localstore';
import UserDialog from './UserDialog';
import {getByUser,TodoModel, getCurrentUser, signOut,init,save} from './leancloud'

class App extends Component {
  constructor(props) {
    super(props)
    this.state = {
      user: getCurrentUser() || {},
      newTodo: '',
      todoList: []  //localStore.load('todoList')
    }
    let user = getCurrentUser()
    if(user){
      TodoModel.getByUser(user,(todos)=>{
        let stateCopy = JSON.parse(JSON.stringify(this.state))
        stateCopy.todoList = todos
        this.setState(stateCopy)
      })
    }
  }
  render() {
    let todos = this.state.todoList
      .filter((item) => !item.deleted)
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
        <div className="logout" onClick={this.onSignOut.bind(this)}  >登出</div>
        <h1>{this.state.user.username || '我'}的待办</h1>
        
        <div className="inputWrapper">
          <TodoInput content={this.state.newTodo}
            onChange={this.changeTitle.bind(this)}
            onSubmit={this.addTodo.bind(this)} />
        </div>
        <ol className='todoList'>
          {todos}
        </ol>
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
    //init(user.id)
  }

  //登出账号
  onSignOut(){
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
  delete(event, todo) {
    todo.deleted = true
    this.setState(this.state)
    //save('todoList',this.state.todoList)
  }
  toggle(e, todo) {
    todo.status = todo.status === 'completed' ? '' : 'completed'
    this.setState(this.state)
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
      status: null,
      deleted: false
    }
    TodoModel.create(newTodo,(id)=>{
      newTodo.id = id
      this.state.todoList.push(newTodo)
      this.setState({
        newTodo: '',
        todoList: this.state.todoList
      })
    },(error)=>{
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
