import request from "@/utils/request"
import {parseUserFromHeader} from './services/auth'

function wrapper(config, func){
  try{
    config.user = parseUserFromHeader(config.headers)
    config.data = config.data && JSON.parse(config.data)
    if(!func.noauth && !config.user){throw new AuthenticationFailed('Token过期')}
    return func(config)
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
export class NotFound extends Error{
  code = 404
}

export function init(delay){
  const modulesFiles = require.context('./services', true, /\.js$/)
  const services = modulesFiles.keys().reduce((services, modulePath)=>{
    const value = modulesFiles(modulePath)
    services.push(value.default)
    return services
  },[])
  const MockAdapter = require("axios-mock-adapter");
  const adapter = new MockAdapter(request, { delayResponse: delay });
  services.forEach(routers=> {
    routers.forEach(([method, matcher, func])=>{
      let caller
      switch(method.toUpperCase()){
        case 'GET':
          caller = adapter.onGet(matcher)
          break
        case 'POST':
          caller = adapter.onPost(matcher)
          break
        case 'DELETE':
          caller = adapter.onDelete(matcher)
          break
        case 'PATCH':
          caller = adapter.onPatch(matcher)
          break
        default:
          console.warn(`method ${method} skip`)
          caller = adapter.onGet(matcher)
      }
      caller.reply(config=>{return wrapper(config, func)})
    })
  })
}