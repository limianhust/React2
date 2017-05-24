import React,{Component} from 'react'

export default class SignInForm extends Component{
    constructor(props){
        super(props)
    }
    render() {
        return (
            <form action="get" className="sign-in"
                onSubmit={this.props.onSubmit}>
                <div className="row-ct">
                    <label htmlFor="">用户名</label>
                    <input type="text" value={this.props.formData.username}
                        onChange={this.props.onChangeFormData.bind(null, 'username')} />
                </div>
                <div className="row-ct">
                    <label htmlFor="">密码</label>
                    <input type="password" value={this.props.formData.password}
                        onChange={this.props.onChangeFormData.bind(null, 'password')} />
                </div>
                <div className="row actions">
                    <button type='submit'>登陆</button>
                    <a href="javascript:;" onClick={this.props.onShowForgotPassword} >忘记密码？</a>
                    {this.props.signInError === '' ? null : <div className="signInError"> {this.props.signInError} </div>}
                </div>
            </form>
        )
    }   
}