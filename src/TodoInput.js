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

function submit(props,e) {
	if (e.key == 'Enter') {
		props.onSubmit(e)
		//console.log('enter')
	}
}

function changeTitle(props,e) {
	props.onChange(e)
}

export default function (props) {
	return (
	<input type='text' value={props.content}
			className="TodoInput"
			onChange={changeTitle.bind(null,props)}
			onKeyPress={submit.bind(null,props)}
		/>
	)
}
