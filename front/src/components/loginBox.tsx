import React from 'react'
import { Form, Button, Icon, Card, Carousel } from 'antd'
import { FormComponentProps } from 'antd/lib/form/Form'
import './loginBox.css'
import Register from './register'

class LoginBox extends React.Component<FormComponentProps> {
  state = { 
    visible: false,
    focus: ''
  }

  handleSubmit = (e:any) => {
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

  carousel: any = {}
  bindCarousel = (ref:any) => {
    this.carousel = ref
  }
  register = (e:any) => {
    e.preventDefault()
    this.carousel.next()
  }

  render() {
    const { getFieldDecorator } = this.props.form
    return (
      <Card
        title="Clouds"
        extra={<Button type="link" icon="close" className="close-button" />}
        style={{ width: 300 }}
        className="login-box"
      >
        <Carousel ref={this.bindCarousel} dots={false}>
          <Form onSubmit={this.handleSubmit}>
            <div style={{ marginBottom: '30px' }}>
              <p className="weclome">Weclome back,</p>
              <p className="sign-in">sign in to continue to Clouds.</p>
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
                rules: [{ required: true, message: 'Please input your Password!' }],
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
              <Button type="link" htmlType="submit" className="submit-button">
                Login
              </Button>
              <br/>
              <p className="sign-up-container">
                Don't have an account?
                <Button type="link" onClick={this.register}>
                  Sign up
                </Button>
              </p>
            </Form.Item>
          </Form>
          <Register back={() => this.carousel.prev()} />
          </Carousel>
      </Card>
    )
  }
}

export default Form.create<FormComponentProps>()(LoginBox)
