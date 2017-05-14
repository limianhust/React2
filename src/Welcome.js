import React from 'react';
class Welcome extends React.Component {
	constructor(props){
		super(props)
		this.state = {
			date: new Date()
		}
		setInterval(()=>{
				this.setState({
					date: new Date()
				})
		})
		console.log('我已经在constructor里将 props 和 state 初始化好了')
	}
	componentWillMount(){
		console.log('运行到这里的话，说明马上要运行 render 了')
	}
	render(){
		//return <h1>Hello,{this.props.name}</h1>;
		console.log('嗯，这里是render')
		return (
			<div>
				<h1>Hello,{this.props.name}</h1>
				<h2>{this.state.date.toString()}</h2>
			</div>
		)
    }
	componentDidMount(){
		console.log('以及挂载到页面里了')
	}
}

export default Welcome
