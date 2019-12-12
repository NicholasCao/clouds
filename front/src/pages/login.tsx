import React, { useState, useEffect } from 'react'
import { Modal, Button } from 'antd'

import './login.css'

import LoginBox from '../components/loginBox'

const Login: React.FC = () => {
  const [showLogin, setShowLogin] = useState(false)
  const [background, setBackGround] = useState(0)

  useEffect(() => {
    setBackGround(Math.floor(Math.random() * 2))
  }, [])

  const openModal = () => {
    setShowLogin(true)
  }

  const closeModal = () => {
    setShowLogin(false)
  }

  return (
    <div className={"login bg" + background }>
      <main>
        <Modal
          title="Clouds"
          visible={showLogin}
          className="modal"
          onCancel={closeModal}
          maskClosable={false}
        >
          <LoginBox/>
        </Modal>
        <p className="cloud">Clouds</p>
        <p className="service">Cloud Storage Service</p>
        <Button ghost className="login-button" onClick={openModal}>Sign In</Button>
      </main>
    </div>
  )
}

export default Login
