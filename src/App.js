import React, { Component } from 'react';
//import logo from './logo.svg';
import './App.css';
import './TodoInput'
class App extends Component {
  constructor(props){
    super(props)
    this.state = {
      newTodo: 'test',
      todoList: [
        {id: 1,title: '第一个代办'}
      ]
    }
  }
  render(){
    let todos = this.state.todoList.map((item,index)=>{
      return <li>{item.title}</li>
    })
    return (
      <div className='App'>
        
          <h1>我的待办</h1>
          <div className="inputWrapper">
            <TodoInput content={this.state.newTodo} />
          </div>
          <ol>
            {todos}
          </ol>
      </div>
    );
  }
}

export default App;
