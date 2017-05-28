import './Footer.css'
import React,{Component} from 'react'

export default class Footer extends Component {
    render() {
        return (
        <footer className="footer"><span>Copyright © 李冕 Website 2017</span>
            <div className="weichat-linkin-github">
                <span className="weichat">&#xe632;</span>
                <span className="linkin">&#xe630;</span>
                
                <a href="https://github.com/limianhust"><span className="github">&#xe69f;</span></a>
            </div>
            <span>Privacy Policy  Terms of Use</span>
        </footer>
        )
    }
    
}
