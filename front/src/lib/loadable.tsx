import React, { useEffect } from 'react'
import Loadable from 'react-loadable'
import nprogress from 'nprogress'
import 'nprogress/nprogress.css'

const Loading: React.FC<Loadable.LoadingComponentProps> = (props) => {
  nprogress.start()

  useEffect(() => {
    // mount

    // unmount
    return () => { setTimeout(() => nprogress.done(), 100) }
  }, [])

  return (
    <></>
  )
}

export default (loader:any) => {
  return Loadable({
    loader,
    loading: Loading
  })
}
