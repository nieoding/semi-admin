import React from 'react'
import { useStore } from "@/store"
import { useLocation, Navigate } from "react-router"
import nprogress from 'nprogress'
import * as service from '@/api/auth'
import { LOGIN_PATH } from '@/config/router.config'
import { checkPermission } from '@/utils/router'

export const  RequireAuth = (props: {children: JSX.Element}) => {
  const {store, dispatch} = useStore()
  const location = useLocation()
  const [loading, setLoading] = React.useState(true)
  React.useEffect(()=>{
    if (store.user.info || !window.localStorage['access-token']){
      setLoading(false)
      return
    }
    (async () =>{
      nprogress.start()
      dispatch({type: 'SET_USER', payload: await service.userinfo()})
      setLoading(false)
      nprogress.done()
    })()
  }, [store.user.info, dispatch])
  if (loading) {
    return <div/>
  } else if (store.user.info) {
    return checkPermission(store.user.routers, location.pathname, store.user.info.role) ? props.children : <Navigate to='/'/>
  }
  else {
    return <Navigate to={LOGIN_PATH} state={{from: location}}/>
  }
}
