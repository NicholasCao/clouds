import React, { useState } from 'react'
import { Form, Button, Icon } from 'antd'
import { FormComponentProps } from 'antd/lib/form/Form'
import './register.css'

interface RegisterProps {
  back: () => void
}

const Register: React.FC<RegisterProps & FormComponentProps> = (props) => {
  const [focus, setFocus] = useState('')
  const [confirmDirty, setConfirmDirty] = useState(false)

  const register = (e:any) => {
    e.preventDefault()
    props.form.validateFields((err, values) => {
      if (!err) {
        console.log('Received values of form: ', values)
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

  const compareToFirstPassword = (rule: any, value: any, callback: any) => {
    const { form } = props
    if (value && value !== form.getFieldValue('password')) {
      callback('Two passwords that you enter is inconsistent!')
    } else {
      callback()
    }
  }

  const validateToNextPassword = (rule: any, value: any, callback: any) => {
    const { form } = props
    if (value && confirmDirty) {
      form.validateFields(['confirm'], { force: true })
    }
    callback()
  }

  const { getFieldDecorator } = props.form
  return (
    <Form onSubmit={register}>
      <div style={{ marginBottom: '30px' }}>
        <p className="sign-up">Sign up for Clouds</p>
      </div>
      <Form.Item>
        {getFieldDecorator('username', {
          rules: [{ required: true, message: 'Please input your username!' }],
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
        {getFieldDecorator('invitationCode', {
          rules: [{ required: true, message: 'Please input your invitation code!' }],
        })(
          <div>
            <div className="input-container">
              <input
                placeholder="Invitation Code"
                onFocus={() => handleFocus('invitationCode')}
                onBlur={() => setFocus('')}
              />
              <Icon type="check" className="check" />
            </div>
            <div className={focus === 'invitationCode' ? "focus-line line" : 'line'}/>
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

export default Form.create<RegisterProps & FormComponentProps>()(Register)
