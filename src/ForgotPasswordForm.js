import React, { Component } from 'react';
import './ForgotPasswordForm.css';

export default class ForgotPasswordForm extends Component {
    constructor(props) {
        super(props)
    }
    render() {
        return (
            <div className="forgotPassword">
                <h3>重置密码</h3>
                <form className="forgotPassword" 
                onSubmit={this.props.onSubmit} >
                    <div className="row">
                        <label>邮箱</label>
                        <input type="text" value={this.props.formData.email}
                            onChange={this.props.onChange.bind(null, 'email')} />
                    </div>
                    <div className="row actions">
                        <button type="submit">发送重置邮件</button>
                        <a href="#" onClick={this.props.onSignIn}>返回登陆</a>
                    </div>
                </form>
            </div>
        )
    }
}

