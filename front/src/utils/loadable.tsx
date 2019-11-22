import React from 'react'
import Loadable from 'react-loadable'
import nprogress from 'nprogress'
import 'nprogress/nprogress.css'

class loading extends React.Component<Loadable.LoadingComponentProps> {
  UNSAFE_componentWillMount() {
    nprogress.start()
  }
  componentWillUnmount() {
    setTimeout(() => nprogress.done(), 100)
  }
  render() {
    return (
      <></>
    )
  }
}

export default (loader:any) => {
  return Loadable({
    loader,
    loading
  })
}
