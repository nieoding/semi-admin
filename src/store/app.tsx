import {defaultConfig, App as BaseApp} from '@/config/app.config'
export type App = BaseApp

export const initialValues:App = {
  dark: window.localStorage['app.dark'] || defaultConfig.dark,
  siteName: defaultConfig.siteName
}

export function reducer(state: App, action: {type: string, payload: any}){
  switch(action.type) {
    case "SET_APP_DARK":
      window.localStorage['app.dark'] = state.dark = action.payload
      return {...state}
    default:
      return state
  }
}