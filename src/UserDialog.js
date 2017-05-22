import React, { Component } from 'react';
import './UserDialog.css';
import { signUp , signIn , signOut} from './leancloud'

export default class UserDialog extends Component {
    constructor(props) {
        super(props)
        this.state = {
            selected: 'signUp',
            formData: {
                username: '',
                password: ''
            },
            signUpError: '',
            signInError: ''
        }
    }
    //用户名和密码注册
    signUp(e) {
        e.preventDefault()
        let { username, password } = this.state.formData
        let success = (user) => {
            console.log('注册成功')
            console.log(user)
            this.props.onSignUp(user)

            // let stateCopy = JSON.parse(JSON.stringify(this.state))
            // stateCopy.signUpState = '注册成功'
            // //console.log(this.state)
            // this.setState(stateCopy)
        }
        let error = (error) => {
            console.log(error.code)
            if (error.code === 202) {
                this.setState({
                    signUpError: '该用户名已经被注册, 请换个用户名重新注册'
                })
            }

        }

        signUp(username, password, success, error)

    }


    //用户名和密码登录
    signIn(e) {
        e.preventDefault()
        let { username, password } = this.state.formData
        
        let success = (user)=>{
            console.log(user)
            this.props.onSignIn(user)
        }
        let error = (error)=>{
            console.log(error)
            if(error.code === 201){
                this.setState({
                    signInError: '密码为空，请输入密码'
                })
            }
            if(error.code === 200 ){
                this.setState({
                    signInError : '请输入用户名'
                })
            }
            if(error.code === 210 ){
                this.setState({
                    signInError : '密码不正确'
                })
            }
            if(error.code === 211 ){
                this.setState({
                    signInError : '找不到用户'
                })
            }
        }
        signIn(username,password,success,error)
        
    }
    

    changeFormData(key, e) {
        let stateCopy = JSON.parse(JSON.stringify(this.state))
        stateCopy.formData[key] = e.target.value
        this.setState(stateCopy)
        //console.log(this.state)
    }
    switch(e) {
        this.setState({
            selected: e.target.value
        })
    }
    render() {
        let signUpForm = (
            <form action="get" className="sign-up"
                onSubmit={this.signUp.bind(this)}  >
                <div className="row-ct">
                    <label htmlFor="">用户名</label>
                    <input type="text" value={this.state.formData.username}
                        onChange={this.changeFormData.bind(this, 'username')} />
                </div>
                <div className="row-ct">
                    <label htmlFor="">密码</label>
                    <input type="password" value={this.state.formData.password}
                        onChange={this.changeFormData.bind(this, 'password')} />
                </div>
                <div className="row actions">
                    <button type='submit' >注册</button>
                    {this.state.signUpError === '' ? null : <div className="signUpError"> {this.state.signUpError} </div>}

                </div>
            </form>
        )
        let signInForm = (
            <form action="get" className="sign-in"
                onSubmit={this.signIn.bind(this)}>
                <div className="row-ct">
                    <label htmlFor="">用户名</label>
                    <input type="text" value={this.state.formData.username}
                        onChange={this.changeFormData.bind(this, 'username')} />
                </div>
                <div className="row-ct">
                    <label htmlFor="">密码</label>
                    <input type="password" value={this.state.formData.password}
                        onChange={this.changeFormData.bind(this, 'password')} />
                </div>
                <div className="row actions">
                    <button type='submit'>登陆</button>
                    {this.state.signInError === '' ? null : <div className="signInError"> {this.state.signInError} </div> }
                </div>
            </form>

        )
        let signUpSuccess = (
            <div className="signUpSuccess"> {this.state.signUpState} </div>
        )
        return (
            <div className='UserDialog-wrapper' >
                <div className="UserDialog">
                    <nav>
                        <label>
                            <input type="radio" value="signUp"
                                checked={this.state.selected === 'signUp'}
                                onChange={this.switch.bind(this)}
                            />注册
                        </label>
                        <label>
                            <input type="radio" value="signIn"
                                checked={this.state.selected === 'signIn'}
                                onChange={this.switch.bind(this)} />
                            登陆
                        </label>
                    </nav>
                    <div className="form-ct">
                        {this.state.selected === 'signUp' ? signUpForm : null}
                        {this.state.selected === 'signIn' ? signInForm : null}
                    </div>
                    
                </div>

            </div>

        )
    }
}

