import React, { Component } from 'react'
import './TodoItem.css'

export default class TodoItem extends Component {
    render() {
        //console.log('TodoItem render')
        return (
            <div className="TodoItem" >
                <input type="checkbox" checked={this.props.todo.status.status === 'completed'}
                    onChange={this.toggle.bind(this)} />
                <span className="title">{this.props.todo.title}</span> 
                <button onClick={this.delete.bind(this)}>删除</button>
            </div>
        )
    }
    toggle(e, todo) {
        this.props.onToggle(e, this.props.todo) //this.props 为传过来的参数，即todo={item}
    }
    delete(e) {
        this.props.onDelete(e, this.props.todo)
    }
    
}