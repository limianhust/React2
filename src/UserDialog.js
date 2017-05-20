import React, {Component} from 'react';
import './UserDialog.css'
export default class UserDialog extends Component{
    constructor(props){
        super(props)
        this.state = {
            selected: 'signUp',
            formData: {
                username: '',
                password: ''
            }
        }
    }
    signUp(e){}
    signIn(e){}
    changeUsername(e){
        let stateCopy = JSON.parse(JSON.stringify(this.state))
        stateCopy.formData.username = e.target.value
        this.setState(stateCopy)
        console.log(this.state)
    }
    changePassword(e){
        let stateCopy = JSON.parse(JSON.stringify(this.state))
        stateCopy.formData.password = e.target.value
        this.setState(stateCopy)
        console.log(this.state)
    }
    switch(e){
        this.setState({
            selected: e.target.value
        })
    }
    render(){
        let signUpForm = (
            <form action="get" className="sign-up"
             onSubmit={this.signUp.bind(this)}>
                            <div className="row-ct">
                                <label htmlFor="">用户名</label>
                                <input type="text" value={this.state.formData.username}
                                onChange={this.changeUsername.bind(this)}/>
                            </div>
                            <div className="row-ct">
                                <label htmlFor="">密码</label>
                                <input type="password" value={this.state.formData.password}
                                onChange={this.changePassword.bind(this)} />
                            </div>
                            <div className="row actions">
                                <button type='submit' >注册</button>
                            </div>       
                        </form>
        )
        let signInForm = (
            <form action="get" className="sign-in"
             onSubmit={this.signIn.bind(this)}>
                            <div className="row-ct">
                                <label htmlFor="">用户名</label>
                                <input type="text" value={this.state.formData.username}
                                onChange={this.changeUsername.bind(this)} />
                            </div>
                            <div className="row-ct">
                                <label htmlFor="">密码</label>
                                <input type="password" value={this.state.formData.password}
                                onChange={this.changePassword.bind(this)} />
                            </div>
                            <div className="row actions">
                                <button type='submit'>登陆</button>
                            </div>       
                        </form>
        )
        return (
            <div className='UserDialog-wrapper'>
                <div className="UserDialog">
                    <nav onChange={this.switch.bind(this)}>
                        <label><input type="radio" value="signUp" checked={this.state.selected === 'signUp'} />注册</label>
                        <label><input type="radio" value="signIn" checked={this.state.selected === 'signIn'} />登陆</label>
                    </nav>
                    <div className="form-ct">
                        {this.state.selected === 'signUp' ? signUpForm : null}
                        {this.state.selected === 'signIn'? signInForm : null}
                    </div>
                </div>
            </div>

        )
    }
}

