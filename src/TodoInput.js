import React, { Component } from 'react';// ES 6的解构赋值
import './TodoInput.css'

/*export default class TodoInput extends Component {
	render() {
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
}*/

function submit(props, e) {
	if (e.keyCode == 13 && e.ctrlKey) {
		if (e.target.value.trim() !== '') {
			props.onSubmit(e)
		}
	}
}

function changeTitle(props, e) {
	props.onChange(e)
}

export default function (props) {
	let TodoInput = (
		
			<textarea type='text' value={props.content}
				className="TodoInput"
				onChange={changeTitle.bind(null, props)}
				onKeyDown={submit.bind(null, props)}
				placeholder="又有新事项啦？ctrl+enter提交事项"
			></textarea>
		
	)
	return (

		<div className="TodoInput-ct">
			{props.todoInput? TodoInput:null}
			<svg className={props.todoInputStyle} onClick={props.onChangeTodoInput} id='svg' xmlns="http://www.w3.org/2000/svg" version="1.1">
				<circle cx="50" cy="50" r="30" />
				<line x1="40" y1="50" x2="60" y2="50"
					 />
				<line x1="50" y1="40" x2="50" y2="60"
					/>
			</svg>
		</div>
	)
}
