import React from 'react'
import './App.css'
import { BrowserRouter as Router, Route } from 'react-router-dom'
import loadable from './utils/loadable'

const Login = loadable(() => import('./pages/login'))
const Disk = loadable(() => import('./pages/disk'))

const App: React.FC = () => (
  <Router>
    <Route path='/' exact component={Login} />
    <Route path='/disk' exact component={Disk} />
  </Router>
)

export default App
