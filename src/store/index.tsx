import React from 'react'
import * as storeUser from "./user"
import * as storeApp from "./app"

type Store= {
  /** 用户信息 */
  user: storeUser.User,
  /** 应用信息 */
  app: storeApp.App,
  // 扩展
}

interface IReducer {
  [key:string]: any
}

function combineReducers(reducers: IReducer){
  return (state :any, action: any) => {
      return Object.keys(reducers).reduce((newState: IReducer, key) => {
          newState[key] = reducers[key](state[key], action);
          return newState;
      }, {});
  }
}


const storeContext = React.createContext<{store: any, dispatch: Function}>({} as any);
const initialState: Store = {
  user: storeUser.initialValues,
  app: storeApp.initialValues,
  // 扩展
}
const reducers = combineReducers({
  user: storeUser.reducer,
  app: storeApp.reducer,
  // 扩展
})

export function StoreProvider(props: {children: React.ReactNode}){
  const [store, dispatch] = React.useReducer(reducers, initialState)
  return <storeContext.Provider value={{store, dispatch}}>{props.children}</storeContext.Provider>
}

export function useStore(): {store:Store, dispatch:Function}{
  return React.useContext(storeContext)
}