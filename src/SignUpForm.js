import React,{Component} from 'react'
import './SignUpForm.css'
/*export default class SignUpForm extends Component{
    constructor(props){
        super(props)
    }
    
    render() {
        return (
            <form action="get" className="sign-up"
                onSubmit={this.props.onSubmit.bind(this)}  >
                <div className="row-ct">
                    <label htmlFor="">邮箱</label>
                    <input type="text" value={this.props.formData.email}
                        onChange={this.props.onChangeFormData.bind(null, 'email')} />
                </div>
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
                    <button type='submit' >注册</button>
                    {this.props.signUpError === '' ? null : <div className="signUpError"> {this.props.signUpError} </div>}

                </div>
            </form>
        )
    }   
}*/
export default function (props) {
    return (
            <form action="get" className="sign-up"
                onSubmit={props.onSubmit.bind(this)}  >
                <div className="row-ct">
                    <label htmlFor="">邮箱</label>
                    <input type="text" value={props.formData.email}
                        onChange={props.onChangeFormData.bind(null, 'email')} />
                </div>
                <div className="row-ct">
                    <label htmlFor="">用户名</label>
                    <input type="text" value={props.formData.username} placeholder='长度不小于三位'
                        onChange={props.onChangeFormData.bind(null, 'username')} />
                </div>
                <div className="row-ct">
                    <label htmlFor="">密码</label>
                    <input type="password" value={props.formData.password} placeholder='长度不小于六位'
                        onChange={props.onChangeFormData.bind(null, 'password')} />
                </div>
                <div className="row actions">
                    <button type='submit' >注册</button>
                    
                </div>
                <div className="signUpError-ct">
                    {props.signUpError} 
                </div>
            </form>
        )
}