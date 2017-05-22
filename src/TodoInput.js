import React, { Component } from 'react';// ES 6的解构赋值
import './TodoInput.css'

export default class TodoInput extends Component {
    render() {
        console.log('TodoInput render')
        return <input type='text' value={this.props.content}
            className="TodoInput"
            onChange={this.changeTitle.bind(this)}
            onKeyPress={this.submit.bind(this)}
             />
    }
    submit(e) {
        if (e.key == 'Enter') {
            this.props.onSubmit(e)
            //console.log('enter')
        }
    }
    changeTitle(event) {
        this.props.onChange(event)
    }
    // shouldComponentUpdate(){
	// 	console.log('shouldComponentUpdate')
    //     return true
	// }
	// componentWillUnmount(){
	// 	console.log('componentWillUnmount')
	// }
	// componentDidUpdate(){
	// 	console.log('componentDidUpdate')
	// }
	// componentWillUpdate(){
	// 	console.log('componentWillUpdate')
	// }
	// componentWillReceiveProps(){
	// 	console.log('componentWillReceiveProps')
	// }
	// componentWillMount(){
	// 	console.log('componentWillMount')
	// }
	// componentDidMount (){
	// 	console.log('componentDidMount')
	// }
}
