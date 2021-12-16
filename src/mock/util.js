import request from "@/utils/request"
import {parseUserFromHeader} from './services/auth'

function wrapper(config, func){
  try{
    const request = {
      header: config.header,
      user: parseUserFromHeader(config.headers),
      data: config.data && JSON.parse(config.data)
    }
    if(!func.noauth && !request.user){throw new AuthenticationFailed('Token过期')}
    return func(request)  
  }
  catch(e){
    return [e.code || 500, e.message]
  }
}

export function noAuth(func){
    func.noauth=true
    return func
}

export class ApiException extends Error {
  code = 500
}
export class ValidateException extends Error{
  code = 400
}
export class AuthenticationFailed extends Error{
  code = 401
}
export class PermissionFailed extends Error{
  code = 403
}

export function init(modals, delay){
  const MockAdapter = require("axios-mock-adapter");
  const adapter = new MockAdapter(request, { delayResponse: delay });
  modals.forEach(modal => {
    Object.entries(modal.default).forEach(([urlpartern, func]) => {
      const [method, matcher] = urlpartern.split(' ')
      let caller
      switch(method.toUpperCase()){
        case 'GET':
          caller = adapter.onGet(matcher)
          break
        case 'POST':
          caller = adapter.onPost(matcher)
          break
        default:
          console.warn(`method ${method} skip`)
          caller = adapter.onGet(matcher)
      }
      caller.reply(config=>{return wrapper(config, func)})
    })
  })
}