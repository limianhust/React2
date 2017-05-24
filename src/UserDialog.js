import React, { Component } from 'react';
import './UserDialog.css';
import { signUp, signIn, signOut,sendPasswordResetEmail } from './leancloud';
import ForgotPasswordForm from './ForgotPasswordForm';
import SignInOrSignUp from './SignInOrSignUp'

export default class UserDialog extends Component {
    constructor(props) {
        super(props)
        this.state = {
            selected: 'signUp', //or 'signIn'
            selectedTab: 'signInOrsignUp', //or 'forgotPassword'
            formData: {
                email: '',
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
        let { email, username, password } = this.state.formData
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
            if (error.code === 217) {
                this.setState({
                    signUpError: '不能使用空白的用户名'
                })
            }

        }

        signUp(email, username, password, success, error)

    }


    //用户名和密码登录
    signIn(e) {
        e.preventDefault()
        let { username, password } = this.state.formData

        let success = (user) => {
            console.log(user)
            this.props.onSignIn(user)
        }
        let error = (error) => {
            console.log(error)
            if (error.code === 201) {
                this.setState({
                    signInError: '密码为空，请输入密码'
                })
            }
            if (error.code === 200) {
                this.setState({
                    signInError: '请输入用户名'
                })
            }
            if (error.code === 210) {
                this.setState({
                    signInError: '密码不正确'
                })
            }
            if (error.code === 211) {
                this.setState({
                    signInError: '找不到用户'
                })
            }
        }
        signIn(username, password, success, error)

    }


    changeFormData(key, e) {
        let stateCopy = JSON.parse(JSON.stringify(this.state))
        stateCopy.formData[key] = e.target.value
        this.setState(stateCopy)
        //console.log(this.state)
    }

    showForgotPassword() {
        let stateCopy = JSON.parse(JSON.stringify(this.state))
        stateCopy.selectedTab = 'forgotPassword'
        this.setState(stateCopy)
    }

    resetPassword(e) {
        e.preventDefault()
        let success = ()=>{

        }
        let error = ()=>{
            
        }
        sendPasswordResetEmail(this.state.formData.email,success,error)
    }

    render() {

        return (
            <div className='UserDialog-wrapper' >
                <div className="UserDialog">
                    {this.state.selectedTab === 'signInOrsignUp' ? <SignInOrSignUp
                        selected={this.state.selected}
                        formData={this.state.formData}
                        onSignUp={this.signUp.bind(this)}
                        onSignIn={this.signIn.bind(this)}
                        onChangeFormData={this.changeFormData.bind(this)}
                        signUpError={this.state.signUpError}
                        signInError={this.state.signInError}
                        onShowForgotPassword={this.showForgotPassword.bind(this)}
                    /> : <ForgotPasswordForm
                            onSubmit={this.resetPassword.bind(null,this)}
                            formData={this.state.formData}
                            onChange={this.changeFormData.bind(this)}
                            onSignIn={this.returnToSignIn.bind(this)}
                        />}
                </div>
            </div>

        )
    }
    returnToSignIn() {
        let stateCopy = JSON.parse(JSON.stringify(this.state))
        stateCopy.selectedTab = 'signInOrsignUp'
        this.setState(stateCopy)
    }
}

