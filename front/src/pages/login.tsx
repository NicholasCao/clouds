import React from 'react'
import { Modal, Button } from 'antd'
import './login.css'
import LoginBox from '../components/loginBox'

interface IState {
  showLogin: boolean,
  background: number
}

class Login extends React.Component<any, IState> {
  state = {
    showLogin: false,
    background: 0
  }

  UNSAFE_componentWillMount() {
    // get random background
    this.setState({
      background: Math.floor(Math.random() * 2)
    })
  }

  openModal = () => {
    this.setState({
      showLogin: true,
    })
  }
  closeModal = () => {
    this.setState({
      showLogin: false,
    })
  }
  render() {
    return (<div className={"login bg" + this.state.background }>
        <main>
          <Modal
            title="Clouds"
            visible={this.state.showLogin}
            className="modal"
            onCancel={this.closeModal}
            maskClosable={false}
          >
            <LoginBox/>
          </Modal>
          <p className="cloud">Clouds</p>
          <p className="service">一站式云端存储服务</p>
          <Button ghost className="login-button" onClick={this.openModal}>Sign In</Button>
        </main>
      </div>
    )
  }
}

export default Login
