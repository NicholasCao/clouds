import React, { useState } from 'react'
import { withRouter, RouteComponentProps } from 'react-router-dom'
import { Form, Button, Icon } from 'antd'
import { FormComponentProps } from 'antd/lib/form/Form'

import './register.css'

import axios from '../lib/axios'
import { rsaEncrypt } from '../lib/utils'

interface RegisterProps {
  back: () => void
}

const Register: React.FC<RegisterProps & FormComponentProps & RouteComponentProps> = (props) => {
  const [focus, setFocus] = useState('')
  const [confirmDirty, setConfirmDirty] = useState(false)

  const register = (e:any) => {
    e.preventDefault()
    props.form.validateFields((err, values) => {
      if (!err) {
        axios.post('/users/register', {
          username: values.username,
          password: rsaEncrypt(values.password)
        }).then(res => {
          if (localStorage) {
            localStorage.setItem("clouds-token", res.data.token)
          }
          props.history.push('/disk', {
            username: values.username
          })
        })
      }
    })
  }

  const handleFocus = (key: string) => {
    setFocus(key)
  }
  const handleConfirmBlur = (e:any) => {
    const { value } = e.target
    setConfirmDirty(confirmDirty || !!value)
    setFocus('')
  }

  const validateNoWhitespace = (rule: any, value: any, callback: any) => {
    if (value && value.indexOf(' ') > -1) {
      callback(`Username shouldn't contain whitespace.`)
    } else {
      callback()
    }
  }

  const compareToFirstPassword = (rule: any, value: any, callback: any) => {
    if (value && value.indexOf(' ') > -1) {
      callback(`Password shouldn't contain whitespace.`)
    }

    const { form } = props
    if (value && value !== form.getFieldValue('password')) {
      callback('Two passwords that you enter is inconsistent!')
    } else {
      callback()
    }
  }

  const validateToNextPassword = (rule: any, value: any, callback: any) => {
    if (value && value.indexOf(' ') > -1) {
      callback(`Password shouldn't contain whitespace.`)
    }

    const { form } = props
    if (value && confirmDirty) {
      form.validateFields(['confirm'], { force: true })
    }
    callback()
  }

  const { getFieldDecorator } = props.form
  return (
    <Form onSubmit={register}>
      <div style={{ marginBottom: '50px' }}>
        <p className="sign-up">Sign up for Clouds</p>
      </div>
      <Form.Item>
        {getFieldDecorator('username', {
          rules: [
            { required: true, message: 'Please input your username!' },
            { min: 3, max: 15, message: 'Username must be between 3 and 15 characters.' },
            { validator: validateNoWhitespace }
          ],
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
            {
              required: true,
              message: 'Please input your password!',
            },
            {
              min: 3,
              max: 15,
              message: 'Password must be between 3 and 15 characters.'
            },
            {
              validator: validateToNextPassword,
            },
          ],
        })(
          <div>
            <div className="input-container">
              <input
                placeholder="Password"
                type="password"
                onFocus={() => handleFocus('password')}
                onBlur={() => setFocus('')}
              />
              <Icon type="check" className="check" />
            </div>
            <div className={focus === 'password' ? "focus-line line" : 'line'}/>
          </div>
        )}
      </Form.Item>
      <Form.Item>
        {getFieldDecorator('confirm', {
          rules: [
            { 
              required: true,
              message: 'Please confirm your password!'
            },
            {
              validator: compareToFirstPassword,
            },
          ],
        })(
          <div>
            <div className="input-container">
              <input
                placeholder="Confirm Password"
                type="password"
                onFocus={() => handleFocus('confirm')}
                onBlur={handleConfirmBlur}
              />
              <Icon type="check" className="check" />
            </div>
            <div className={focus === 'confirm' ? "focus-line line" : 'line'}/>
          </div>
        )}
      </Form.Item>
      <Form.Item>
        <div className="buttons-container">
        <Button type="link" htmlType="submit">
          Register
        </Button>
        <Button type="link" onClick={props.back}>
          Back
        </Button>
        </div>
      </Form.Item>
    </Form>
  )
}

export default Form.create<RegisterProps & FormComponentProps>()(withRouter(Register))
