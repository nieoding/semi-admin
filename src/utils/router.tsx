import React from 'react';
import { Route, Outlet} from "react-router-dom"
import {RouterItem} from '@/config/router.config'

export type Menu = {
  itemKey: string,
  path: string,
  text: string|undefined,
  icon: JSX.Element|undefined,
  items: Array<Menu>,
  router: RouterItem,
  parent: Menu|undefined,
}

function slashPath(source: string) {
  return source[0] === '/' ? source: `/${source}`
}
function hasPermission(route:RouterItem, role:string){
  const permission = route.meta && route.meta.permission
  if(!permission){
    return true
  }
  // 简单的：服务端的role = 客户端的permission；复杂的实现可以增加permission组合，例如添加修改删除细分
  return permission.find(item=>item===role)
}

export function filterRouters(source: Array<RouterItem>|undefined, role: string): Array<RouterItem>|undefined{
  if(!source){return undefined}
  const res: Array<RouterItem> = []
  source.forEach(item => {
    if(hasPermission(item, role)){
      res.push(item)
      item.children && (item.children = filterRouters(item.children, role))
    }
  })
  return res
}

export function renderRouter(item: RouterItem) {
  return (
    <Route key={item.name} path={item.path} element={
      <React.Suspense fallback={<></>}>
        {
          item.children ? <Outlet/> : (item.component && <item.component/>)
        }
      </React.Suspense>
    }>
      {
        item.children && item.children.map(child => renderRouter(child))
      }
    </Route>
  )
}

function generateMenu(router:RouterItem, parent: Menu|undefined=undefined){
  const parentPath = parent && slashPath(parent.router.path)
  const path = slashPath(router.path)
  const menu: Menu = {
    itemKey: router.name,
    path: parentPath ? `${parentPath}${path}` : path,
    text: router.meta && router.meta.title,
    icon: router.meta && router.meta.icon,
    items: [],
    router: router,
    parent: parent,
  }
  if (router.children) {
    router.children.forEach(children => {
      !children.hidden && menu.items.push(generateMenu(children, menu))
    })
  }
  return menu
}

export function generateMenus(routers: Array<RouterItem>): Array<Menu>{
  return routers.filter(item=>!item.hidden).map(item => generateMenu(item))
}

export function findMenuByPathname(menus: Array<Menu>, pathname: string): Menu|undefined{
  let rs = menus.find(item=>item.path === pathname)
  if(!rs){
    for(let i=0;i<menus.length;i++){
      rs = findMenuByPathname(menus[i].items,pathname)
      if(rs){
        break
      }
    }
  }
  return rs
}

export function checkPermission(routers: Array<RouterItem>, pathname: string, role:string): boolean {
  pathname = pathname.substr(1)
  if(pathname===''){
    return true
  }
  const ar = pathname.split('/')
  let tmp: Array<RouterItem> = routers
  for(let i=0;i<ar.length;i++){
    const leaf = tmp.find(item=>item.path===ar[i])
    if(!leaf || !hasPermission(leaf, role)){
      // 父节点的权限判断
      return false
    }
    if(i===ar.length-1){
      // 终节点找到以后，并已经通过权限验证
      return true
    }
    if(!leaf.children){
      break
    }
    tmp = leaf.children
  }
  return false
}

export function getMenu(menus: Array<Menu>, itemKey: string): Menu|undefined{
  let rs = menus.find(item=>item.itemKey === itemKey)
  if(!rs){
    for(let i=0;i<menus.length;i++){
      rs = getMenu(menus[i].items,itemKey)
      if(rs){
        break
      }
    }
  }
  return rs
}

export function generateCrumbs(menu: Menu|undefined): Array<any>{
  const rs = []
  let tmp: Menu|undefined = menu
  while(tmp){
    rs.push({
      name: tmp.text,
      path: tmp.path,
      noLink: false
    })
    tmp = tmp.parent
  }
  return rs.reverse()
}
