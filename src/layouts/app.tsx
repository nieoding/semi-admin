import React from 'react';
import {useStore} from '@/store'
import { useNavigate, Outlet, useLocation } from "react-router-dom";
import { Layout, Nav, Button, Breadcrumb, Modal, Avatar, Space,} from '@douyinfe/semi-ui';
import { IconBytedanceLogo, IconExit, IconIndentLeft, IconIndentRight, IconRefresh } from '@douyinfe/semi-icons';
import { LOGIN_PATH, KEY_HOME } from '@/config/router.config';
import { Menu, generateMenus, findMenuByPathname, generateCrumbs, getMenu} from '@/utils/router'

export default function Index() {
  const [collapsed, setCollapsed] = React.useState(false);
  const [currentKey, setCurrentKey] = React.useState(KEY_HOME);
  const {store, dispatch}= useStore()
  const navigate = useNavigate();
  const location = useLocation();
  const { Header, Footer, Sider, Content } = Layout;

  const menus: Array<Menu> = React.useMemo(() =>{
    return generateMenus(store.user.routers)
  },[store.user.routers])
  const crumbs: Array<any> = React.useMemo(()=>{
    const menu = getMenu(menus, currentKey)
    return menu ? generateCrumbs(menu) : []
  },[currentKey, menus])
  React.useEffect(() => {
    const menu = findMenuByPathname(menus, window.location.pathname)
    if(menu){
      setCurrentKey(menu.itemKey)
      document.title = `${store.app.siteName} - ${menu.text}`
    }
    
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [menus, window.location.pathname])

  function handleRefresh () {
    navigate('refresh', {state:{from: location.pathname},replace:true})
  }
  function handleNavigate(data:any) {
    setCurrentKey(data.itemKey)
    const menu = getMenu(menus, data.itemKey)
    menu && navigate(menu.path)
  }
  function handleClickCrumb(item: any){
    if(!item.path){return}
    navigate(item.path)
    
  }
  function handleLogout() {
    Modal.confirm({title: '确认', content: '确认退出吗？', onOk: () => {
      (async () => {
        dispatch({type:'LOGOUT'})
        navigate(LOGIN_PATH)
      })()
    }})
  }


  return (
    <Layout style={{ border: '1px solid var(--semi-color-border)' }}>
        <Sider style={{ backgroundColor: 'var(--semi-color-bg-1)' }}>
            <Nav
                selectedKeys={[currentKey]}
                style={{ maxWidth: 220, height: '100%' }}
                items={menus}
                onSelect={handleNavigate}
                header={{
                    logo: <Avatar size="small" color="amber">{store.user.info && store.user.info.username && store.user.info.username[0]}</Avatar>,
                    text: store.user.info && store.user.info.username,
                }}
                isCollapsed={collapsed}
            />
        </Sider>
        <Layout>
            <Header style={{ backgroundColor: 'var(--semi-color-bg-1)' }}>
                <Nav
                    mode="horizontal"
                    header={
                      <>
                      <Button onClick={() => {setCollapsed(!collapsed)}} theme="borderless" style={{
                        color: 'var(--semi-color-text-2)',
                        marginRight: '12px',
                    }} icon={
                        collapsed? <IconIndentRight /> : <IconIndentLeft />}/>
                        <Breadcrumb routes={crumbs} onClick={handleClickCrumb}></Breadcrumb>
                      </>
                    }
                    footer={
                        <Space>
                            <Button
                              theme="borderless"
                              icon={<IconRefresh size="large" />}
                              style={{
                                  color: 'var(--semi-color-text-2)',
                              }}
                              onClick={handleRefresh}
                            />
                            <Button
                                theme="borderless"
                                icon={<IconExit size="large" />}
                                style={{
                                    color: 'var(--semi-color-text-2)',
                                }}
                                onClick={handleLogout}
                            />
                        </Space>
                    }
                ></Nav>
            </Header>
            <Content
                style={{
                    padding: '24px',
                    minHeight: '560px',
                    backgroundColor: 'var(--semi-color-bg-1)',
                }}
            >
                <Outlet/>
            </Content>
            <Footer
                style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    padding: '20px',
                    color: 'var(--semi-color-text-2)',
                    backgroundColor: 'rgba(var(--semi-grey-0), 1)',
                }}
            >
                <span
                    style={{
                        display: 'flex',
                        alignItems: 'center',
                    }}
                >
                    <IconBytedanceLogo size="large" style={{ marginRight: '8px' }} />
                    <span>Copyright © 2019 ByteDance. All Rights Reserved. </span>
                </span>
                <span>
                    <span style={{ marginRight: '24px' }}>平台客服</span>
                    <span>反馈建议</span>
                </span>
            </Footer>
        </Layout>
    </Layout>
  );
}
