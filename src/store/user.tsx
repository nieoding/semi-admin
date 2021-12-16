import * as service from '@/api/auth'
import {asyncRouters, RouterItem} from '@/config/router.config'
import {filterRouters} from '@/utils/router'

type UserInfo = {
  id: number,
  username: string,
  role: string
}
export type User = {
  info: UserInfo|null,
  routers: Array<RouterItem>
}

export const initialValues: User = {
  info: null,
  routers: []
}

function actionSetUser(state:User, info: UserInfo){
  return {...state, info:info, routers: filterRouters(asyncRouters, info.role)}
}
function actionLogout(){
  (async () => {
    await service.logout()
  })()
  window.localStorage.removeItem('access-token')
  return initialValues
}

export function reducer(state: User, action: {type: string, payload: any}){
  switch(action.type) {
    case "SET_USER":
      return actionSetUser(state, action.payload)
    case "LOGOUT":
      return actionLogout()
    default:
      return state
  }
}
