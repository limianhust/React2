import React, { Component } from 'react';
import SignUpForm from './SignUpForm';
import SignInForm from './SignInForm';

export default class SignInOrSignUp extends Component {
    constructor(props) {
        super(props)
        this.state = {
            selected: 'signUp'
        }
    }
    onSwitch(e) {
        let stateCopy = JSON.parse(JSON.stringify(this.state))
        stateCopy.selected = e.target.value
        this.setState(stateCopy)
    }
    render() {
        return (
            <div className="signInOrsignUp">
                <nav>
                    <label >
                        <input type="radio" value="signUp"
                            checked={this.state.selected === 'signUp'}
                            onChange={this.onSwitch.bind(this)}
                        /> <span> 注册</span>
                    </label>
                    
                    <label>
                        <input type="radio" value="signIn"
                            checked={this.state.selected === 'signIn'}
                            onChange={this.onSwitch.bind(this)} />
                        <span>登陆</span>
                    </label>
                </nav>
                <hr/>
                <div className="form-ct">
                    {this.state.selected === 'signUp' ? <SignUpForm formData={this.props.formData}
                        onSubmit={this.props.onSignUp}
                        onChangeFormData={this.props.onChangeFormData}
                        signUpError={this.props.signUpError} /> : null}
                    {this.state.selected === 'signIn' ? <SignInForm formData={this.props.formData}
                        onSubmit={this.props.onSignIn}
                        onChangeFormData={this.props.onChangeFormData}
                        signInError={this.props.signInError}
                        onShowForgotPassword={this.props.onShowForgotPassword} /> : null}
                </div>
            </div>
        )
    }
}