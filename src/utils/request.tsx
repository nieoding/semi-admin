import * as React from "react";
import axios, {AxiosInstance, AxiosRequestConfig} from 'axios'
import {useStore} from '@/store'
import { Notification } from '@douyinfe/semi-ui'
import { LOGIN_PATH } from "@/config/router.config";

const conf: AxiosRequestConfig = {
  baseURL: '/api',
  timeout: 6000
}
const request:AxiosInstance = axios.create(conf)
let intercrepted = false
let errorHeppened = false

function useAjaxEffect() {
  const {dispatch} = useStore()
  if (intercrepted) {
    return
  }
  intercrepted = true
  request.interceptors.request.use((config: AxiosRequestConfig) => {
    const token = window.localStorage['access-token']
    if (token) {
      config.headers = {Authorization:'Bearer ' + token}
    }
    return config
  })
  request.interceptors.response.use((response) => {
    return response.data
  }, (error) => {
    if (error.response.status === 401 && (window.location.pathname !== LOGIN_PATH) && !errorHeppened) {
      Notification.error({title:'系统错误', content: 'token过期'})
      setTimeout(() =>{
        dispatch({type:'LOGOUT'})
        window.location.reload()
        errorHeppened = false
      }, 300)
      errorHeppened = true
    }
    return Promise.reject(error)
  })
}
function AjaxEffectFragment() {
  useAjaxEffect()
  return <React.Fragment/>
}


export {AjaxEffectFragment}
export default request