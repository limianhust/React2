import React, { Component } from 'react';

export default class TodoInput extends Component {
    render() {
        return <input type='text' defaultValue={this.props.content}
            onChange={this.changeTitle.bind(this)}
            onKeyPress={this.submit.bind(this)} />
    }
    submit(e) {
        if (e.key == 'Enter') {
            this.props.onSubmit(e)
            console.log('enter')
        }
    }
    changeTitle(event) {
        this.props.onChange(event)
    }
}
