import React from 'react'
import { Form, Button, Icon } from 'antd'
import { FormComponentProps } from 'antd/lib/form/Form'
import './register.css'

interface RegisterProps {
  back: () => any
}

class Register extends React.Component<RegisterProps & FormComponentProps> {
  state = { 
    focus: '',
    confirmDirty: false
  }

  register = (e:any) => {
    e.preventDefault()
    this.props.form.validateFields((err, values) => {
      if (!err) {
        console.log('Received values of form: ', values)
      }
    })
  }

  handleFocus = (key: string) => {
    this.setState({
      focus: key
    })
  }
  handleConfirmBlur = (e:any) => {
    const { value } = e.target
    this.setState({ confirmDirty: this.state.confirmDirty || !!value, focus: '' })
  }

  compareToFirstPassword = (rule: any, value: any, callback: any) => {
    const { form } = this.props
    if (value && value !== form.getFieldValue('password')) {
      callback('Two passwords that you enter is inconsistent!')
    } else {
      callback()
    }
  }

  validateToNextPassword = (rule: any, value: any, callback: any) => {
    const { form } = this.props
    if (value && this.state.confirmDirty) {
      form.validateFields(['confirm'], { force: true })
    }
    callback()
  }

  render() {
    const { getFieldDecorator } = this.props.form
    return (
      <Form onSubmit={this.register}>
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
                  onFocus={() => this.handleFocus('username')}
                  onBlur={() => this.setState({ focus: '' })}
                />
                <Icon type="check" className="check" />
              </div>
              <div className={this.state.focus === 'username' ? "focus-line line" : 'line'}/>
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
                validator: this.validateToNextPassword,
              },
            ],
          })(
            <div>
              <div className="input-container">
                <input
                  placeholder="Password"
                  type="password"
                  onFocus={() => this.handleFocus('password')}
                  onBlur={() => this.setState({ focus: '' })}
                />
                <Icon type="check" className="check" />
              </div>
              <div className={this.state.focus === 'password' ? "focus-line line" : 'line'}/>
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
                validator: this.compareToFirstPassword,
              },
            ],
          })(
            <div>
              <div className="input-container">
                <input
                  placeholder="Confirm Password"
                  type="password"
                  onFocus={() => this.handleFocus('confirm')}
                  onBlur={this.handleConfirmBlur}
                />
                <Icon type="check" className="check" />
              </div>
              <div className={this.state.focus === 'confirm' ? "focus-line line" : 'line'}/>
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
                  onFocus={() => this.handleFocus('invitationCode')}
                  onBlur={() => this.setState({ focus: '' })}
                />
                <Icon type="check" className="check" />
              </div>
              <div className={this.state.focus === 'invitationCode' ? "focus-line line" : 'line'}/>
            </div>
          )}
        </Form.Item>
        <Form.Item>
          <div className="buttons-container">
          <Button type="link" htmlType="submit">
            Register
          </Button>
          <Button type="link" onClick={this.props.back}>
            Back
          </Button>
          </div>
        </Form.Item>
      </Form>
    )
  }
}

export default Form.create<RegisterProps & FormComponentProps>()(Register)
