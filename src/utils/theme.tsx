import React from 'react'
import { useStore } from '@/store'

export function ThemeFragment(){
  const {store} = useStore()
  React.useEffect(()=>{
    const body = document.body;
    store.app.dark === 'dark' ? body.setAttribute('theme-mode', 'dark') : body.removeAttribute('theme-mode')
  },[store.app.dark])
  return <React.Fragment/>
}
