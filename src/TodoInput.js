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
	return (
		<div className="TodoInput-ct">
			<textarea type='text' value={props.content}
				className="TodoInput"
				onChange={changeTitle.bind(null, props)}
				onKeyDown={submit.bind(null, props)}
				placeholder="又有新事项啦？ctrl+enter提交事项"
			></textarea>
			{/*<span className="write-add-iconfont">&#xe62f;</span>*/}
			<span className="cancel">+</span>
		</div>
	)
}
