import React from 'react'
// import Button from 'antd/es/button'
// import { Link } from 'react-router-dom'
import './login.css'
import LoginBox from '../components/loginBox'

class Index extends React.Component {
  constructor(props: React.Props<any>) {
    super(props)
    this.state = {
    }
  }
  UNSAFE_componentWillMount() {
  }
  render() {
    return (<div className="index">
        <main>
          <LoginBox></LoginBox>
          {/* <Link to='/test'>
            <Button ghost className="login-button">Sign In</Button>
          </Link> */}
        </main>
      </div>
    )
  }
}

export default Index