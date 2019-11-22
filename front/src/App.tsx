import React from 'react'
import './App.css'
import { BrowserRouter as Router, Route } from 'react-router-dom'
import loadable from './utils/loadable'

const Login = loadable(() => import('./pages/login'))
const Test = loadable(() => import('./pages/test'))

const App: React.FC = () => (
  <Router>
    <Route path='/' component={Login} />
    <Route path='/test' component={Test} />
  </Router>
)

export default App
