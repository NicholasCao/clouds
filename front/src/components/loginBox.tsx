import React, { useState, useRef } from 'react'
import { Form, Button, Icon, Carousel } from 'antd'
import { withRouter, RouteComponentProps } from 'react-router-dom'
import { FormComponentProps } from 'antd/lib/form/Form'

import './loginBox.css'

import axios from '../lib/axios'
import { rsaEncrypt } from '../lib/utils'
import Register from './register'

const LoginBox: React.FC<FormComponentProps & RouteComponentProps> = (props) => {
  const [focus, setFocus] = useState('')
  const carousel = useRef<Carousel>(null)

  const login = (e:any) => {
    e.preventDefault()
    props.form.validateFields((err, values) => {
      if (!err) {
        axios.post('/users/login', {
          username: values.username,
          password: rsaEncrypt(values.password)
        }).then(res => {
          if (localStorage) {
            localStorage.setItem("clouds-token", res.data.token)
          }
          props.history.push('/disk')
        })
      }
    })
  }

  const handleFocus = (key: string) => {
    setFocus(key)
  }

  const register = (e:any) => {
    e.preventDefault()
    if (carousel.current) carousel.current.next()
  }

  const { getFieldDecorator } = props.form
  return (
    <Carousel ref={carousel} dots={false}>
      <Form onSubmit={login}>
        <div style={{ marginBottom: '30px' }}>
          <p className="weclome">Weclome back,</p>
          <p className="sign-in">sign in to continue to Clouds.</p>
        </div>
        <Form.Item>
          {getFieldDecorator('username', {
            rules: [
              { required: true, message: 'Please input your username!' },
              { min: 3, max: 15, message: 'Username must be between 3 and 15 characters.' }
            ]
          })(
            <div>
              <div className="input-container">
                <input 
                  placeholder="Username"
                  onFocus={() => handleFocus('username')}
                  onBlur={() => setFocus('')}
                />
                <Icon type="check" className="check" />
              </div>
              <div className={focus === 'username' ? "focus-line line" : 'line'}/>
            </div>
          )}
        </Form.Item>
        <Form.Item>
          {getFieldDecorator('password', {
            rules: [
              { required: true, message: 'Please input your Password!' },
              { min: 3, max: 15, message: 'Password must be between 3 and 15 characters.' }
            ]
          })(
            <div>
              <div className="input-container">
                <input 
                  placeholder="Password"
                  type="password"
                  onFocus={() => handleFocus('password')}
                  onBlur={() => setFocus('')}
                  // onChange={(e:any) => {setPassword(e.target.value)}}
                />
                <Icon type="check" className="check" />
              </div>
              <div className={focus === 'password' ? "focus-line line" : 'line'}/>
            </div>
          )}
        </Form.Item>
        <Form.Item>
          <Button type="link" htmlType="submit" className="submit-button">
            Login
          </Button>
          <br/>
          <p className="sign-up-container">
            Don't have an account?
            <Button type="link" onClick={register}>
              Sign up
            </Button>
          </p>
        </Form.Item>
      </Form>
      <Register back={() => { if (carousel.current) carousel.current.prev() }} />
    </Carousel>
  )
}

export default Form.create<FormComponentProps>()(withRouter(LoginBox))
