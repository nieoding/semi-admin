import { AuthenticationFailed, noAuth } from '../util'
import jwt from 'jsonwebtoken'
const SECRET_KEY = 'HelloWorld'
const TOKEN_TIMEOUT = 60 * 60 //TOken过期时间

const users = [
  {
    id: 1,
    username: 'admin',
    password: 'admin',
    role: 'admin',
  },
  {
    id: 2,
    username: 'guest',
    password: 'guest',
    role: 'guest',
  }
]

export function parseUserFromHeader(header){
  const info = header.Authorization
  if(!info){return null}
  const [prefix, token] = info.split(' ')
  if(prefix!=='Bearer'){return null}
  try{
    const tokenDecoded = jwt.verify(token, SECRET_KEY)
    return users.find(item=>item.id===tokenDecoded.id)
  }
  catch(e){
    return null
  }

}

function login(request){
  const user = users.find(item=>item.username===request.data.username)
  if(!user){throw new AuthenticationFailed('用户不存在')}
  if(user.password!==request.data.password){throw new AuthenticationFailed('密码错误')}
  const payload = {
    id:user.id,
    username: user.username,
    exp: Math.floor(Date.now()/1000) + TOKEN_TIMEOUT
  }
  user.token = jwt.sign(payload, SECRET_KEY, {algorithm:'HS256'})
  return [200, {token: user.token}]
}

function userinfo(request){
  return [200, request.user]
}

function logout(request){
  if(request.user){
    request.user.token = ''
  }
  return [200, {}]
}

const routers = [
  ["POST", "/api/auth/login/", noAuth(login)],
  ["GET", "/api/auth/userinfo/", userinfo],
  ["POST", "/api/auth/logout/", noAuth(logout)],
]
export default routers